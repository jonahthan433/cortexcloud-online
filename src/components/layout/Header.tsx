import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import cortexLogo from "@/assets/cortex-logo.jpg";

export function Header() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={cortexLogo} 
                alt="CortexCloud" 
                className="h-10 w-auto brightness-110 contrast-110"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-8 ml-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <Link to="/booking" className="text-muted-foreground hover:text-primary transition-colors">
                Book a Call
              </Link>
                  {user && (
                    <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                  )}
              <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                Admin
              </Link>
            </div>
          </div>
          
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="hidden md:inline-flex" asChild>
                  <Link to="/admin">Admin</Link>
                </Button>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground hidden md:inline">
                      {user.name || user.email}
                    </span>
                    <Button variant="outline" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" asChild>
                      <Link to="/auth/login">Sign In</Link>
                    </Button>
                    <Button variant="hero" className="glow" asChild>
                      <a href="#pricing">Start Free Trial</a>
                    </Button>
                  </div>
                )}
              </div>
        </div>
      </div>
    </header>
  );
}