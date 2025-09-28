# Google Cloud Platform MongoDB Setup Guide

## Overview
This comprehensive guide covers multiple approaches to deploy MongoDB on Google Cloud Platform (GCP), including MongoDB Atlas on GCP, self-hosted MongoDB on Compute Engine, and using Google Cloud's managed services.

## Table of Contents
1. [MongoDB Atlas on GCP](#mongodb-atlas-on-gcp)
2. [Self-Hosted MongoDB on GCP Compute Engine](#self-hosted-mongodb-on-gcp-compute-engine)
3. [MongoDB with Google Kubernetes Engine (GKE)](#mongodb-with-google-kubernetes-engine-gke)
4. [Using Google Cloud Firestore as Alternative](#using-google-cloud-firestore-as-alternative)
5. [Cost Optimization](#cost-optimization)
6. [Security Best Practices](#security-best-practices)

---

## MongoDB Atlas on GCP

### Option 1: MongoDB Atlas with GCP Integration

#### 1.1 Setup MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create an account or sign in
3. Create a new project
4. Choose "Build a Database"
5. Select **Google Cloud Platform** as your cloud provider
6. Choose your preferred region (select one close to your users)
7. Select cluster tier (M0 for free, M10+ for production)

#### 1.2 Configure Atlas for GCP
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Set up authentication
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

#### 1.3 VPC Peering (For Production)
1. In Atlas, go to Network Access → Peering
2. Click "Add Peering Connection"
3. Choose "Google Cloud Platform"
4. Enter your GCP Project ID
5. Enter your VPC Network Name
6. Configure the peering on GCP side:

```bash
# Create VPC peering connection from GCP
gcloud compute networks peerings create atlas-peering \
    --network=YOUR_VPC_NETWORK \
    --peer-project=PROJECT_ID_FROM_ATLAS \
    --peer-network=NETWORK_NAME_FROM_ATLAS \
    --auto-create-routes
```

#### 1.4 Private Service Connect (PSC)
For enhanced security, use Private Service Connect:

```bash
# Create a private service connect endpoint
gcloud compute addresses create atlas-psc-address \
    --global \
    --purpose=PRIVATE_SERVICE_CONNECT \
    --network=YOUR_VPC_NETWORK

gcloud compute forwarding-rules create atlas-psc-endpoint \
    --global \
    --network=YOUR_VPC_NETWORK \
    --address=atlas-psc-address \
    --target-service-attachment=ATLAS_SERVICE_ATTACHMENT
```

---

## Self-Hosted MongoDB on GCP Compute Engine

### 2.1 Create VM Instance

```bash
# Create a VM instance for MongoDB
gcloud compute instances create mongodb-server \
    --zone=us-central1-a \
    --machine-type=e2-standard-4 \
    --network-interface=network-tier=PREMIUM,subnet=default \
    --maintenance-policy=MIGRATE \
    --provisioning-model=STANDARD \
    --scopes=https://www.googleapis.com/auth/cloud-platform \
    --tags=mongodb-server \
    --create-disk=auto-delete=yes,boot=yes,device-name=mongodb-server,image=projects/ubuntu-os-cloud/global/images/ubuntu-2004-focal-v20231101,mode=rw,size=50,type=projects/YOUR_PROJECT/zones/us-central1-a/diskTypes/pd-ssd \
    --create-disk=device-name=mongodb-data,mode=rw,size=100,type=projects/YOUR_PROJECT/zones/us-central1-a/diskTypes/pd-ssd \
    --no-shielded-secure-boot \
    --shielded-vtpm \
    --shielded-integrity-monitoring \
    --reservation-affinity=any
```

### 2.2 Configure Firewall Rules

```bash
# Create firewall rule for MongoDB
gcloud compute firewall-rules create allow-mongodb \
    --allow tcp:27017 \
    --source-ranges 0.0.0.0/0 \
    --target-tags mongodb-server \
    --description "Allow MongoDB traffic"

# For production, restrict source ranges to specific IPs:
gcloud compute firewall-rules create allow-mongodb-restricted \
    --allow tcp:27017 \
    --source-ranges YOUR_APP_SERVER_IP/32 \
    --target-tags mongodb-server \
    --description "Allow MongoDB traffic from app servers only"
```

### 2.3 Install MongoDB on VM

```bash
# SSH into the VM
gcloud compute ssh mongodb-server --zone=us-central1-a

# Update system
sudo apt update && sudo apt upgrade -y

# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Format and mount the data disk
sudo mkfs.ext4 -F /dev/sdb
sudo mkdir -p /data/db
sudo mount /dev/sdb /data/db
sudo chown mongodb:mongodb /data/db

# Add to fstab for persistent mounting
echo '/dev/sdb /data/db ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

### 2.4 Configure MongoDB

```bash
# Edit MongoDB configuration
sudo nano /etc/mongod.conf
```

```yaml
# /etc/mongod.conf
storage:
  dbPath: /data/db
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 0.0.0.0  # Be careful with this in production

security:
  authorization: enabled

replication:
  replSetName: "rs0"
```

```bash
# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Create admin user
mongosh --eval "
db = db.getSiblingDB('admin');
db.createUser({
  user: 'admin',
  pwd: 'your_secure_password',
  roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]
});
"

# Initialize replica set (for production)
mongosh --eval "rs.initiate()"
```

---

## MongoDB with Google Kubernetes Engine (GKE)

### 3.1 Create GKE Cluster

```bash
# Create GKE cluster
gcloud container clusters create mongodb-cluster \
    --zone=us-central1-a \
    --num-nodes=3 \
    --disk-size=50 \
    --machine-type=e2-standard-4 \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=5

# Get credentials
gcloud container clusters get-credentials mongodb-cluster --zone=us-central1-a
```

### 3.2 Create MongoDB StatefulSet

```yaml
# mongodb-statefulset.yaml
apiVersion: v1
kind: Service
metadata:
  name: mongodb-headless
spec:
  clusterIP: None
  selector:
    app: mongodb
  ports:
    - port: 27017
      targetPort: 27017
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
spec:
  serviceName: mongodb-headless
  replicas: 3
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:6.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "admin"
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        volumeMounts:
        - name: mongodb-data
          mountPath: /data/db
        command:
        - mongod
        - "--replSet"
        - "rs0"
        - "--bind_ip_all"
  volumeClaimTemplates:
  - metadata:
      name: mongodb-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "standard"
      resources:
        requests:
          storage: 10Gi
```

```bash
# Create secret for MongoDB password
kubectl create secret generic mongodb-secret --from-literal=password=your_secure_password

# Deploy MongoDB
kubectl apply -f mongodb-statefulset.yaml

# Initialize replica set
kubectl exec -it mongodb-0 -- mongosh --eval "
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongodb-0.mongodb-headless.default.svc.cluster.local:27017' },
    { _id: 1, host: 'mongodb-1.mongodb-headless.default.svc.cluster.local:27017' },
    { _id: 2, host: 'mongodb-2.mongodb-headless.default.svc.cluster.local:27017' }
  ]
});
"
```

### 3.3 Create MongoDB Service

```yaml
# mongodb-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
spec:
  type: LoadBalancer
  selector:
    app: mongodb
  ports:
    - port: 27017
      targetPort: 27017
```

```bash
kubectl apply -f mongodb-service.yaml
```

---

## Using Google Cloud Firestore as Alternative

### 4.1 Enable Firestore API

```bash
# Enable Firestore API
gcloud services enable firestore.googleapis.com

# Create Firestore database
gcloud firestore databases create --region=us-central
```

### 4.2 Node.js Example with Firestore

```javascript
// package.json dependencies
// "dependencies": {
//   "@google-cloud/firestore": "^6.8.0"
// }

const { Firestore } = require('@google-cloud/firestore');

// Initialize Firestore
const firestore = new Firestore({
  projectId: 'your-project-id',
  keyFilename: 'path/to/service-account-key.json', // For local development
});

// Example operations
async function firestoreOperations() {
  // Add document
  const docRef = await firestore.collection('users').add({
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date()
  });

  console.log('Document written with ID: ', docRef.id);

  // Get document
  const doc = await firestore.collection('users').doc(docRef.id).get();
  if (doc.exists) {
    console.log('Document data:', doc.data());
  }

  // Query collection
  const snapshot = await firestore.collection('users')
    .where('email', '==', 'john@example.com')
    .get();
  
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
}

firestoreOperations();
```

---

## Cost Optimization

### 5.1 MongoDB Atlas Cost Optimization

1. **Right-size your cluster**: Start with M10, scale as needed
2. **Use pausing**: Atlas M10+ clusters can be paused when not in use
3. **Choose appropriate regions**: Some regions are more cost-effective
4. **Set up billing alerts**:

```bash
# Create budget alert
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="MongoDB Atlas Budget" \
    --budget-amount=100USD \
    --threshold-rules=percent=0.9,basis=CURRENT_SPEND
```

### 5.2 Compute Engine Cost Optimization

1. **Use preemptible instances** for non-production:

```bash
gcloud compute instances create mongodb-preemptible \
    --preemptible \
    --zone=us-central1-a \
    --machine-type=e2-medium
```

2. **Use sustained use discounts**
3. **Schedule instances** to shut down during off-hours:

```bash
# Create instance schedule
gcloud compute resource-policies create instance-schedule mongodb-schedule \
    --region=us-central1 \
    --vm-start-schedule="0 8 * * MON-FRI" \
    --vm-stop-schedule="0 18 * * MON-FRI" \
    --timezone="America/New_York"

# Apply schedule to instance
gcloud compute instances add-resource-policies mongodb-server \
    --resource-policies=mongodb-schedule \
    --zone=us-central1-a
```

---

## Security Best Practices

### 6.1 Network Security

```bash
# Create custom VPC
gcloud compute networks create mongodb-vpc --subnet-mode regional

# Create subnet
gcloud compute networks subnets create mongodb-subnet \
    --network mongodb-vpc \
    --region us-central1 \
    --range 10.1.0.0/24

# Create more restrictive firewall rules
gcloud compute firewall-rules create mongodb-internal \
    --network mongodb-vpc \
    --allow tcp:27017 \
    --source-ranges 10.1.0.0/24 \
    --target-tags mongodb-server
```

### 6.2 Identity and Access Management (IAM)

```bash
# Create service account for MongoDB
gcloud iam service-accounts create mongodb-sa \
    --description="Service account for MongoDB" \
    --display-name="MongoDB Service Account"

# Grant minimal permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:mongodb-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/compute.instanceAdmin"
```

### 6.3 Encryption

```bash
# Create KMS key for encryption
gcloud kms keyrings create mongodb-keyring --location=global

gcloud kms keys create mongodb-key \
    --location=global \
    --keyring=mongodb-keyring \
    --purpose=encryption
```

### 6.4 Monitoring and Alerting

```bash
# Enable Cloud Monitoring API
gcloud services enable monitoring.googleapis.com

# Create uptime check
gcloud alpha monitoring uptime create \
    --display-name="MongoDB Uptime Check" \
    --tcp-check-port=27017 \
    --resource-type=uptime_url \
    --hostname=YOUR_MONGODB_IP
```

---

## Backup and Disaster Recovery

### 7.1 Automated Backups

```bash
# Create backup script
cat << 'EOF' > /usr/local/bin/mongodb-backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb_$DATE"
mkdir -p $BACKUP_DIR

mongodump --host localhost:27017 --out $BACKUP_DIR

# Upload to Cloud Storage
gsutil -m cp -r $BACKUP_DIR gs://your-backup-bucket/mongodb/

# Clean up local backup (keep last 3 days)
find /backups -type d -name "mongodb_*" -mtime +3 -exec rm -rf {} \;
EOF

chmod +x /usr/local/bin/mongodb-backup.sh

# Set up cron job
echo "0 2 * * * /usr/local/bin/mongodb-backup.sh" | sudo crontab -
```

### 7.2 Point-in-Time Recovery

For Atlas:
- Enable continuous backups in Atlas dashboard
- Configure backup schedule and retention

For self-hosted:
```bash
# Enable oplog
# Add to mongod.conf:
# replication:
#   oplogSizeMB: 1024
```

---

## Application Integration Examples

### 8.1 Environment Configuration

```bash
# .env file for GCP deployment
MONGODB_URI=mongodb://username:password@INTERNAL_IP:27017/database
# or for Atlas:
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster0.abc123.gcp.mongodb.net/database

# GCP specific
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

### 8.2 Connection with Error Handling

```javascript
const { MongoClient } = require('mongodb');

class MongoDBConnection {
  constructor(uri) {
    this.uri = uri;
    this.client = null;
  }

  async connect() {
    try {
      this.client = new MongoClient(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        retryReads: true,
      });

      await this.client.connect();
      console.log('Connected to MongoDB on GCP');
      
      // Test the connection
      await this.client.db('admin').admin().ping();
      console.log('MongoDB ping successful');
      
      return this.client;
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

module.exports = MongoDBConnection;
```

---

## Troubleshooting Guide

### Common Issues and Solutions

1. **Connection Timeout on GCE**
   ```bash
   # Check firewall rules
   gcloud compute firewall-rules list --filter="name~mongodb"
   
   # Test connectivity
   telnet MONGODB_IP 27017
   ```

2. **Performance Issues**
   ```bash
   # Monitor MongoDB performance
   mongosh --eval "db.runCommand({serverStatus: 1}).metrics"
   
   # Check GCP VM performance
   gcloud compute instances get-serial-port-output mongodb-server
   ```

3. **Storage Issues**
   ```bash
   # Check disk usage
   df -h
   
   # Resize disk if needed
   gcloud compute disks resize mongodb-data --size=200GB --zone=us-central1-a
   ```

---

## Deployment Checklist

### Pre-Production
- [ ] Choose appropriate deployment method
- [ ] Set up proper networking and security groups
- [ ] Configure SSL/TLS encryption
- [ ] Set up authentication and authorization
- [ ] Plan backup and recovery strategy
- [ ] Set up monitoring and alerting
- [ ] Document connection strings and credentials

### Production
- [ ] Use replica sets for high availability
- [ ] Implement proper indexing strategy
- [ ] Set up automated backups
- [ ] Configure log rotation
- [ ] Set up performance monitoring
- [ ] Implement security hardening
- [ ] Plan for scaling and capacity
- [ ] Set up disaster recovery procedures

This comprehensive guide should help you deploy MongoDB on GCP using the method that best fits your requirements and constraints.
