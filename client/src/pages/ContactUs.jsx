import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe, MessageCircle, Users, Award, Sparkles, Home, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center bg-primary-foreground/10 text-primary-foreground rounded-full px-4 py-2 mb-4">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Get In Touch</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Have questions about Ethiopian heritage? Want to partner with us? 
              We'd love to hear from you and help preserve our cultural legacy together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-lg">
              <div className="mb-6">
                <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-3">
                  <Send className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">Send Message</span>
                </div>
                <h2 className="text-2xl font-bold text-card-foreground mb-3">
                  Let's Start a Conversation
                </h2>
                <p className="text-muted-foreground text-sm">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Type */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-3">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/20 transition-colors">
                      <input
                        type="radio"
                        name="type"
                        value="general"
                        checked={formData.type === 'general'}
                        onChange={handleChange}
                        className="mr-3 text-primary"
                      />
                      <div>
                        <div className="font-medium text-card-foreground">General Inquiry</div>
                        <div className="text-sm text-muted-foreground">Questions about our platform</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/20 transition-colors">
                      <input
                        type="radio"
                        name="type"
                        value="partnership"
                        checked={formData.type === 'partnership'}
                        onChange={handleChange}
                        className="mr-3 text-primary"
                      />
                      <div>
                        <div className="font-medium text-card-foreground">Partnership</div>
                        <div className="text-sm text-muted-foreground">Collaboration opportunities</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/20 transition-colors">
                      <input
                        type="radio"
                        name="type"
                        value="support"
                        checked={formData.type === 'support'}
                        onChange={handleChange}
                        className="mr-3 text-primary"
                      />
                      <div>
                        <div className="font-medium text-card-foreground">Technical Support</div>
                        <div className="text-sm text-muted-foreground">Help using our platform</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/20 transition-colors">
                      <input
                        type="radio"
                        name="type"
                        value="media"
                        checked={formData.type === 'media'}
                        onChange={handleChange}
                        className="mr-3 text-primary"
                      />
                      <div>
                        <div className="font-medium text-card-foreground">Media & Press</div>
                        <div className="text-sm text-muted-foreground">Press inquiries</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-background"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-background"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-card-foreground mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-background"
                    placeholder="What is this regarding?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-background resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Main Contact Info */}
              <div className="bg-card rounded-3xl p-8 border border-border">
                <div className="inline-flex items-center bg-secondary/10 text-secondary rounded-full px-4 py-2 mb-6">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">Contact Information</span>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  Get in Touch With Us
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-1">Email Us</h4>
                      <p className="text-muted-foreground">info@ethioheritage360.com</p>
                      <p className="text-muted-foreground text-sm">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Phone className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-1">Call Us</h4>
                      <p className="text-muted-foreground">+251 11 123 4567</p>
                      <p className="text-muted-foreground text-sm">Monday - Friday, 9:00 AM - 6:00 PM EAT</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-1">Visit Us</h4>
                      <p className="text-muted-foreground">
                        Heritage Building, 3rd Floor<br />
                        Churchill Avenue, Addis Ababa<br />
                        Ethiopia
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-1">Office Hours</h4>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Contacts */}
              <div className="bg-card rounded-3xl p-8 border border-border">
                <div className="inline-flex items-center bg-accent/10 text-accent rounded-full px-4 py-2 mb-6">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">Department Contacts</span>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  Reach the Right Team
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-card-foreground">Partnerships</h4>
                      <p className="text-sm text-muted-foreground">Museum collaborations & institutional partnerships</p>
                    </div>
                    <div className="text-primary font-medium">partnerships@ethioheritage360.com</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-card-foreground">Technical Support</h4>
                      <p className="text-sm text-muted-foreground">Platform help & technical issues</p>
                    </div>
                    <div className="text-primary font-medium">support@ethioheritage360.com</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-card-foreground">Media & Press</h4>
                      <p className="text-sm text-muted-foreground">Press inquiries & media relations</p>
                    </div>
                    <div className="text-primary font-medium">media@ethioheritage360.com</div>
                  </div>
                </div>
              </div>

              {/* Quick Response Promise */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 border border-border">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    Quick Response Promise
                  </h3>
                  <p className="text-muted-foreground">
                    We're committed to responding to all inquiries within 24 hours during business days. 
                    Your heritage questions and partnership ideas are important to us!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Quick Answers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Find quick answers to common questions about our platform and services.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                How can I access the virtual museum tours?
              </h3>
              <p className="text-muted-foreground">
                Simply create a free account on our platform and browse our collection of virtual tours. 
                Some premium tours may require a subscription or one-time fee.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                Can my museum partner with EthioHeritage360?
              </h3>
              <p className="text-muted-foreground">
                Yes! We welcome partnerships with museums, cultural institutions, and educational organizations. 
                Contact our partnerships team to discuss collaboration opportunities.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                Is the platform available in multiple languages?
              </h3>
              <p className="text-muted-foreground">
                Currently, we offer content in English, Amharic, and Afaan Oromoo. We're working to expand 
                our multilingual support to include more Ethiopian languages.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                How can I contribute to heritage preservation?
              </h3>
              <p className="text-muted-foreground">
                There are many ways to contribute: volunteer as a digital archivist, donate to our preservation fund, 
                share your knowledge as a cultural expert, or help us translate content.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
