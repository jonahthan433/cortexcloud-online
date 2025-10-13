import { BookingWidget } from "@/components/booking/BookingWidget";

const Booking = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full">
        <BookingWidget />
      </div>
    </div>
  );
};

export default Booking;