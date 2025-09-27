import { Button } from "@/components/ui/button";
import cortexLogo from "@/assets/cortex-logo.jpg";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={cortexLogo} 
              alt="CortexCloud" 
              className="h-10 w-auto brightness-110 contrast-110"
              decoding="async"
              fetchPriority="high"
            />
            <div className="hidden md:flex items-center space-x-8 ml-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                Book a Call
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button variant="hero" className="glow" asChild>
              <a href="#pricing">Start Free Trial</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}