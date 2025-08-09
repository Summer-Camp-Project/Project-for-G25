import { useState } from "react";
import { X, MapPin, Clock, Users, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // <-- Added this import
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useDashboard } from "../../../context/DashboardContext";
import { toast } from "sonner";

export function CreateTourModal() {
  const { showCreateTourModal, setShowCreateTourModal, createTourPackage } = useDashboard();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    region: '',
    duration: '',
    price: '',
    maxGuests: '',
    difficulty: '',
    category: '',
    images: ['']
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      createTourPackage({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        region: formData.region,
        duration: formData.duration,
        price: parseFloat(formData.price) || 0,
        maxGuests: parseInt(formData.maxGuests) || 10,
        difficulty: formData.difficulty,
        category: formData.category,
        images: formData.images.filter(img => img),
        status: 'active'
      });
      
      toast.success("Tour package created successfully!");
      setShowCreateTourModal(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        region: '',
        duration: '',
        price: '',
        maxGuests: '',
        difficulty: '',
        category: '',
        images: ['']
      });
      
    } catch (error) {
      toast.error("Failed to create tour package");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    setShowCreateTourModal(false);
  };

  return (
    <Dialog open={showCreateTourModal} onOpenChange={setShowCreateTourModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Create New Tour Package
          </DialogTitle>
          {/* This is the fix for the accessibility warning */}
          <DialogDescription>
            Fill out the details below to create a new tour package.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4 px-1">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Tour Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter tour title"
                className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your tour package..."
                rows={4}
                className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
          
          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Lalibela, Amhara"
                className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region" className="text-gray-700 font-medium">
                Region
              </Label>
              <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                <SelectTrigger className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amhara">Amhara</SelectItem>
                  <SelectItem value="tigray">Tigray</SelectItem>
                  <SelectItem value="oromia">Oromia</SelectItem>
                  <SelectItem value="snnpr">SNNPR</SelectItem>
                  <SelectItem value="afar">Afar</SelectItem>
                  <SelectItem value="somali">Somali</SelectItem>
                  <SelectItem value="benishangul">Benishangul-Gumuz</SelectItem>
                  <SelectItem value="gambela">Gambela</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Tour Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-gray-700 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                Duration
              </Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 3 days"
                className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxGuests" className="text-gray-700 font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                Max Guests
              </Label>
              <Input
                id="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                placeholder="10"
                min="1"
                className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700 font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                Price per Person (USD)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="450"
                min="0"
                step="0.01"
                className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-gray-700 font-medium">
                Difficulty Level
              </Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-700 font-medium">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Religious & Historical">Religious & Historical</SelectItem>
                <SelectItem value="Adventure & Nature">Adventure & Nature</SelectItem>
                <SelectItem value="Cultural & Tribal">Cultural & Tribal</SelectItem>
                <SelectItem value="Wildlife & Safari">Wildlife & Safari</SelectItem>
                <SelectItem value="Archaeological">Archaeological</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Tour Package'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}