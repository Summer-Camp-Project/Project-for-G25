import React from 'react';

const ProfileSettings = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Profile Settings</h1>
          <p className="text-xl text-muted-foreground">
            Manage your account preferences and personal information
          </p>
        </div>
        
        <div className="bg-card p-8 rounded-lg border border-border">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language Preference</label>
                  <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                    <option>English</option>
                    <option>አማርኛ</option>
                    <option>Afaan Oromoo</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
