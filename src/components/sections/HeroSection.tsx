import { Sparkles, Zap, Globe, Calendar } from "lucide-react";
import { EmailCapture } from "@/components/EmailCapture";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-6">
      <div className="container mx-auto text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 glass-effect px-4 py-2 rounded-full mb-8 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Business Automation
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="gradient-text">CORTEX</span>
            <span className="text-foreground">CLOUD</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
            The Ultimate All-in-One Business Growth Platform
          </p>
          
          <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
            Transform your business with 24/7 automation, comprehensive CRM, 
            website building, course creation, and unified communications. 
            Everything you need to scale your business.
          </p>

          {/* CTA Section */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-16">
            <EmailCapture />
            <Button variant="outline" size="lg" asChild>
              <Link to="/ai-mentorship">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Demo
              </Link>
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full border border-white/10">
              <Zap className="h-4 w-4 text-primary" />
              <span>Smart Automation</span>
            </div>
            <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full border border-white/10">
              <Globe className="h-4 w-4 text-primary" />
              <span>Global Integration</span>
            </div>
            <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full border border-white/10">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}