import React, { useState, createContext, useContext } from "react";
import { X, MapPin, Clock, Users, DollarSign } from "lucide-react";

// --- Mock UI Components for a Self-Contained App ---
// These are simplified versions based on standard Tailwind classes.
const Button = ({ children, className, variant, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100",
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className, ...props }) => (
  <input
    className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  />
);

const Textarea = ({ className, ...props }) => (
  <textarea
    className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  />
);

const Label = ({ className, children, ...props }) => (
  <label
    className={`flex items-center gap-2 text-sm leading-none font-medium text-gray-700 ${className}`}
    {...props}
  >
    {children}
  </label>
);

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");

  const handleSelect = (val) => {
    setSelectedValue(val);
    if (onValueChange) onValueChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValue || "Select a value"}
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {children(handleSelect)}
        </div>
      )}
    </div>
  );
};

const SelectContent = ({ children }) => {
  return children;
};

const SelectItem = ({ value, children, onSelect }) => (
  <div
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={() => onSelect(value)}
  >
    {children}
  </div>
);

const SelectTrigger = ({ children }) => children;
const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;


// --- Mock Context for a Self-Contained App ---
const DashboardContext = createContext(null);
const useDashboard = () => useContext(DashboardContext);

// Mock toast function for demonstration
const toast = {
  success: (message) => console.log("Toast Success:", message),
  error: (message) => console.error("Toast Error:", message),
};

// --- Your CreateTourModal Component (Updated) ---
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
        images: ['https://placehold.co/600x400/E5E7EB/4B5563?text=Tour+Image'], // Mock image
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

  if (!showCreateTourModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Tour Package
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                className="border-gray-300 focus:ring-green-500 focus:border-green-500"
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
                className="border-gray-300 focus:ring-green-500 focus:border-green-500"
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
                className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="text-gray-700 font-medium">
                Region
              </Label>
              <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                {(onSelect) => (
                  <SelectContent>
                    <SelectItem value="amhara" onSelect={onSelect}>Amhara</SelectItem>
                    <SelectItem value="tigray" onSelect={onSelect}>Tigray</SelectItem>
                    <SelectItem value="oromia" onSelect={onSelect}>Oromia</SelectItem>
                    <SelectItem value="snnpr" onSelect={onSelect}>SNNPR</SelectItem>
                    <SelectItem value="afar" onSelect={onSelect}>Afar</SelectItem>
                    <SelectItem value="somali" onSelect={onSelect}>Somali</SelectItem>
                    <SelectItem value="benishangul" onSelect={onSelect}>Benishangul-Gumuz</SelectItem>
                    <SelectItem value="gambela" onSelect={onSelect}>Gambela</SelectItem>
                  </SelectContent>
                )}
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
                className="border-gray-300 focus:ring-green-500 focus:border-green-500"
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
                className="border-gray-300 focus:ring-green-500 focus:border-green-500"
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
                className="border-gray-300 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-gray-700 font-medium">
                Difficulty Level
              </Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                {(onSelect) => (
                  <SelectContent>
                    <SelectItem value="easy" onSelect={onSelect}>Easy</SelectItem>
                    <SelectItem value="moderate" onSelect={onSelect}>Moderate</SelectItem>
                    <SelectItem value="hard" onSelect={onSelect}>Hard</SelectItem>
                  </SelectContent>
                )}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-700 font-medium">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              {(onSelect) => (
                <SelectContent>
                  <SelectItem value="Religious & Historical" onSelect={onSelect}>Religious & Historical</SelectItem>
                  <SelectItem value="Adventure & Nature" onSelect={onSelect}>Adventure & Nature</SelectItem>
                  <SelectItem value="Cultural & Tribal" onSelect={onSelect}>Cultural & Tribal</SelectItem>
                  <SelectItem value="Wildlife & Safari" onSelect={onSelect}>Wildlife & Safari</SelectItem>
                  <SelectItem value="Archaeological" onSelect={onSelect}>Archaeological</SelectItem>
                </SelectContent>
              )}
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
              className="bg-green-600 hover:bg-green-700 transition-colors"
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
      </div>
    </div>
  );
}

// Main App component to demonstrate the modal
export default function App() {
  const [showCreateTourModal, setShowCreateTourModal] = useState(false);
  const createTourPackage = (tourData) => {
    console.log("Creating new tour package:", tourData);
  };

  const dashboardContextValue = {
    showCreateTourModal,
    setShowCreateTourModal,
    createTourPackage,
  };

  return (
    <DashboardContext.Provider value={dashboardContextValue}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tour Management</h1>
        <p className="text-lg text-gray-600 mb-8">
          Click the button below to create a new tour package.
        </p>
        <Button onClick={() => setShowCreateTourModal(true)}>
          Create Tour Package
        </Button>

        <CreateTourModal />
      </div>
    </DashboardContext.Provider>
  );
}