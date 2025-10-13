import { AvailabilityManager } from "@/components/admin/AvailabilityManager";
import { BookingManager } from "@/components/admin/BookingManager";
import { EmbedCode } from "@/components/booking/EmbedCode";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your booking system settings
          </p>
        </div>
        
        <div className="space-y-8">
          <BookingManager />
          <AvailabilityManager />
          <EmbedCode />
        </div>
      </div>
    </div>
  );
};

export default Admin;