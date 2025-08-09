import { useState } from "react";
import { Check, X, Eye, Mail, Calendar, Users, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { useDashboard } from "../../../context/DashboardContext";
import { toast } from "sonner";

export function BookingRequestsModal() {
  const { 
    showBookingRequestsModal, 
    setShowBookingRequestsModal, 
    bookings,
    tourPackages,
    updateBookingStatus 
  } = useDashboard();
  
  const [isUpdating, setIsUpdating] = useState(null);
  
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  
  const handleStatusUpdate = async (bookingId, status) => {
    setIsUpdating(bookingId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateBookingStatus(bookingId, status);
      
      const booking = bookings.find(b => b.id === bookingId);
      toast.success(`Booking ${status} for ${booking?.customerName}`);
      
    } catch (error) {
      toast.error("Failed to update booking status");
    } finally {
      setIsUpdating(null);
    }
  };
  
  const handleViewDetails = (bookingId) => {
    toast.info(`Detailed view for booking ${bookingId} would open here`);
  };
  
  const handleContactCustomer = (email) => {
    toast.info(`Email composer would open for ${email}`);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={showBookingRequestsModal} onOpenChange={setShowBookingRequestsModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-stone-800">
            Booking Requests ({pendingBookings.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {pendingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <p className="text-stone-600">No pending booking requests</p>
            </div>
          ) : (
            pendingBookings.map((booking) => {
              const tour = tourPackages.find(t => t.id === booking.tourPackageId);
              const isUpdatingThis = isUpdating === booking.id;
              
              return (
                <Card key={booking.id} className="border-stone-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-stone-800">
                        {tour?.title || 'Unknown Tour'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          Pending
                        </Badge>
                        <Badge variant="outline">
                          ${booking.totalAmount}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-stone-600" />
                          <span className="font-medium">{booking.customerName}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-stone-600" />
                          <span className="text-sm text-stone-600">{booking.customerEmail}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-stone-600" />
                          <span className="text-sm">{formatDate(booking.tourDate)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-stone-600" />
                          <span className="text-sm">{booking.guests} guests</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-stone-600" />
                          <span className="text-sm">Total: ${booking.totalAmount}</span>
                        </div>
                        
                        <div className="text-xs text-stone-500">
                          Requested: {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="bg-stone-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-stone-800 mb-1">Special Requests:</h5>
                        <p className="text-sm text-stone-600">{booking.specialRequests}</p>
                      </div>
                    )}
                    
                    <Separator />
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(booking.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactCustomer(booking.customerEmail)}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          disabled={isUpdatingThis}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          disabled={isUpdatingThis}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {isUpdatingThis ? 'Confirming...' : 'Confirm'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
        
        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => setShowBookingRequestsModal(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
