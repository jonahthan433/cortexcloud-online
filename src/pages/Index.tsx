import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { Suspense, lazy } from "react";

const FeaturesSection = lazy(() =>
  import("@/components/sections/FeaturesSection").then((m) => ({ default: m.FeaturesSection }))
);
const PlatformCapabilitiesSection = lazy(() =>
  import("@/components/sections/PlatformCapabilitiesSection").then((m) => ({ default: m.PlatformCapabilitiesSection }))
);
const TestimonialsSection = lazy(() =>
  import("@/components/sections/TestimonialsSection").then((m) => ({ default: m.TestimonialsSection }))
);
const PricingSection = lazy(() =>
  import("@/components/sections/PricingSection").then((m) => ({ default: m.PricingSection }))
);
const FAQSection = lazy(() =>
  import("@/components/sections/FAQSection").then((m) => ({ default: m.FAQSection }))
);
const FooterSection = lazy(() =>
  import("@/components/sections/FooterSection").then((m) => ({ default: m.FooterSection }))
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <FeaturesSection />
        </Suspense>
        <Suspense fallback={null}>
          <PlatformCapabilitiesSection />
        </Suspense>
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={null}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <FooterSection />
      </Suspense>
    </div>
  );
};

export default Index;
