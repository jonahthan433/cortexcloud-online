import { Sparkles, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6">
      <div className="container mx-auto text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 glass-effect px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8 border border-primary/20">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse-glow" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              AI-Powered Business Automation
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight px-2">
            <span className="gradient-text">CORTEX</span>
            <span className="text-foreground">CLOUD</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-2">
            The Ultimate All-in-One Business Growth Platform
          </p>
          
          <p className="text-base sm:text-lg text-muted-foreground/80 mb-8 sm:mb-12 max-w-2xl mx-auto px-2 leading-relaxed">
            Transform your business with 24/7 automation, comprehensive CRM, 
            website building, course creation, and unified communications. 
            Everything you need to scale your business.
          </p>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16 px-4">
            <Button size="lg" variant="hero" className="glow w-full sm:w-auto touch-manipulation" asChild>
              <a href="#pricing">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Start Free Trial
              </a>
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground px-4">
            <div className="flex items-center space-x-1 sm:space-x-2 glass-effect px-3 sm:px-4 py-2 rounded-full border border-white/10">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>Smart Automation</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 glass-effect px-3 sm:px-4 py-2 rounded-full border border-white/10">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>Global Integration</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 glass-effect px-3 sm:px-4 py-2 rounded-full border border-white/10">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}