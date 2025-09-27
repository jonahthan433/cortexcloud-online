import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PlatformCapabilitiesSection } from "@/components/sections/PlatformCapabilitiesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { BookingWidget } from "@/components/booking/BookingWidget";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PlatformCapabilitiesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
              Book a Call
            </h2>
            <BookingWidget />
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
