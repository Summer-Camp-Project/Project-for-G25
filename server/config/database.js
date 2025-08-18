const mongoose = require("mongoose")

export default function connect_Mong(){
    
    try{
      const uri = "";
      mongoose.connect(uri);
      console.log("MongoDB connected successfully");
    }catch(error){
        console.error("MongoDB connection error:", error);
    }
}

   