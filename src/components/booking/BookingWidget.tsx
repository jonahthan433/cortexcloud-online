import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export const BookingWidget = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailability();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots();
    }
  }, [selectedDate, availability]);

  const fetchAvailability = async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('is_available', true);
      
      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error",
        description: "Failed to load availability",
        variant: "destructive"
      });
    }
  };

  const generateTimeSlots = async () => {
    if (!selectedDate) return;

    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.find(a => a.day_of_week === dayOfWeek);
    
    if (!dayAvailability) {
      setAvailableSlots([]);
      return;
    }

    const slots: TimeSlot[] = [];
    const startTime = new Date(`2000-01-01T${dayAvailability.start_time}`);
    const endTime = new Date(`2000-01-01T${dayAvailability.end_time}`);
    
    // Generate 30-minute slots
    const current = new Date(startTime);
    while (current < endTime) {
      const timeString = current.toTimeString().slice(0, 5);
      
      // Check if this slot is already booked
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', format(selectedDate, 'yyyy-MM-dd'))
        .eq('booking_time', timeString)
        .eq('status', 'confirmed');

      slots.push({
        time: timeString,
        available: !existingBookings || existingBookings.length === 0
      });

      current.setMinutes(current.getMinutes() + 30);
    }

    setAvailableSlots(slots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Check for conflicts
      const { data: conflictCheck, error: conflictError } = await supabase
        .rpc('check_booking_conflict', {
          p_booking_date: format(selectedDate, 'yyyy-MM-dd'),
          p_booking_time: selectedTime,
          p_duration_minutes: 30
        });

      if (conflictError) throw conflictError;

      if (conflictCheck) {
        toast({
          title: "Time Slot Unavailable",
          description: "This time slot has been booked. Please select another time.",
          variant: "destructive"
        });
        generateTimeSlots(); // Refresh slots
        return;
      }

      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          booking_time: selectedTime,
          duration_minutes: 30,
          notes: formData.notes,
          status: 'confirmed'
        });

      if (bookingError) throw bookingError;

      toast({
        title: "Booking Confirmed!",
        description: `Your appointment is scheduled for ${format(selectedDate, 'MMMM dd, yyyy')} at ${selectedTime}`,
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", notes: "" });
      setSelectedDate(undefined);
      setSelectedTime("");
      setAvailableSlots([]);

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availability.some(a => a.day_of_week === dayOfWeek && a.is_available);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass-effect border-primary/20">
      <CardHeader>
        <CardTitle className="gradient-text text-center text-2xl">Book Your Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Date Selection */}
          <div className="space-y-4">
            <Label>Select Date *</Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => 
                  date < new Date() || !isDateAvailable(date)
                }
                className="rounded-md border border-primary/20"
              />
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && availableSlots.length > 0 && (
            <div className="space-y-4">
              <Label>Select Time *</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    type="button"
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className="text-sm"
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && availableSlots.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No available time slots for this date.
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information or special requests..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !selectedDate || !selectedTime}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};