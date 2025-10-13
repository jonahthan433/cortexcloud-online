import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "What is CortexCloud and how does it work?",
    answer: "CortexCloud is an all-in-one business growth platform that combines CRM, marketing automation, communication tools, and analytics. It works by centralizing all your business processes into one intuitive dashboard, allowing you to capture leads, nurture them through automated workflows, and convert them into customers."
  },
  {
    question: "Do I need technical skills to use CortexCloud?",
    answer: "Not at all! CortexCloud is designed for business owners and teams without technical backgrounds. Our drag-and-drop interface, pre-built templates, and guided setup make it easy to get started. Most users are up and running within minutes."
  },
  {
    question: "Can I integrate CortexCloud with my existing tools?",
    answer: "Yes! CortexCloud integrates with 1000+ popular business tools including Google Workspace, Microsoft 365, Shopify, WordPress, Zapier, and many more. Our API also allows custom integrations for specific business needs."
  },
  {
    question: "What communication channels does CortexCloud support?",
    answer: "CortexCloud supports email, WhatsApp Business, SMS, Facebook Messenger, Instagram DMs, and more. All messages appear in one unified inbox, making it easy to manage all customer communications from a single place."
  },
  {
    question: "Is my data secure with CortexCloud?",
    answer: "Absolutely. We use enterprise-grade security including SSL encryption, regular security audits, GDPR compliance, and secure data centers. Your business data is protected with the same security standards used by major financial institutions."
  },
  {
    question: "Can I try CortexCloud before purchasing?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can explore all capabilities and see how CortexCloud fits your business needs before making any commitment."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We provide 24/7 customer support via live chat, email, and phone. Plus, you get access to our knowledge base, video tutorials, webinars, and a dedicated customer success manager for higher-tier plans."
  },
  {
    question: "Can I customize workflows and automation?",
    answer: "Definitely! CortexCloud offers powerful workflow automation with conditional logic, triggers, and actions. You can create custom automation for lead nurturing, follow-ups, appointment scheduling, payment processing, and much more."
  },
  {
    question: "Is CortexCloud suitable for teams?",
    answer: "Yes! CortexCloud supports team collaboration with user roles, permissions, shared pipelines, and team analytics. You can assign leads, track team performance, and ensure everyone stays aligned on your business goals."
  },
  {
    question: "What happens if I need to cancel my subscription?",
    answer: "You can cancel anytime with no long-term contracts. Your data remains accessible during your billing period, and we provide easy data export options. We also offer a 30-day money-back guarantee if you're not satisfied."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-card">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Everything you need to know about CortexCloud. Can't find what you're looking for? 
            <span className="text-cortex-cyan hover:underline cursor-pointer ml-1">Contact our support team</span>.
          </p>
        </div>

        <div className="bg-card/30 rounded-2xl border border-cortex-cyan/10 p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-cortex-cyan/10"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-cortex-cyan transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              Contact Support
            </button>
            <Link 
              to="/ai-mentorship" 
              className="px-6 py-3 border border-cortex-cyan/30 text-cortex-cyan rounded-lg font-medium hover:bg-cortex-cyan/10 transition-colors inline-block text-center"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};