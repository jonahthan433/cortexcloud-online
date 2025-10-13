import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Emma J.",
    role: "Retail Business Owner",
    company: "Local Retail Store",
    content: "As a small business owner, I was drowning in admin work until I started using this software. It streamlined my operations so seamlessly that I now have more time to focus on growth. It's a game-changer for efficiency!",
    rating: 5,
    avatar: "EJ"
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    company: "TechStart Inc",
    content: "The automation workflows and CRM integration have transformed our lead generation process. We've seen a 300% increase in qualified leads and our sales team is finally organized.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Sarah Rodriguez",
    role: "Business Owner",
    company: "Digital Solutions Co",
    content: "The WhatsApp integration and social media scheduler alone have revolutionized how we communicate with clients. The 24/7 automation saves us 20+ hours per week.",
    rating: 5,
    avatar: "SR"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Trusted by Growing Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how CortexCloud is helping businesses automate their growth and scale efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 border-cortex-cyan/20 hover:border-cortex-cyan/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-cortex-cyan text-cortex-cyan" />
                  ))}
                </div>
                
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};