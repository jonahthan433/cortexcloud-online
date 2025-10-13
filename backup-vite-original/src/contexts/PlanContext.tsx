import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PlanType = 'initiate' | 'elevate' | 'custom';

export interface PlanFeatures {
  initiate: string[];
  elevate: string[];
  custom: string[];
}

export interface PlanLimits {
  initiate: {
    maxSeats: number;
    maxContacts: number;
    maxAutomations: number;
    hasAI: boolean;
    hasAffiliateProgram: boolean;
    hasWhiteLabel: boolean;
    customIntegrations: boolean;
  };
  elevate: {
    maxSeats: number;
    maxContacts: number;
    maxAutomations: number;
    hasAI: boolean;
    hasAffiliateProgram: boolean;
    hasWhiteLabel: boolean;
    customIntegrations: boolean;
  };
  custom: {
    maxSeats: number;
    maxContacts: number;
    maxAutomations: number;
    hasAI: boolean;
    hasAffiliateProgram: boolean;
    hasWhiteLabel: boolean;
    customIntegrations: boolean;
  };
}

export interface PlanContextType {
  currentPlan: PlanType;
  setCurrentPlan: (plan: PlanType) => void;
  planLimits: PlanLimits;
  hasFeature: (feature: keyof PlanLimits['initiate']) => boolean;
  upgradePrompt: (feature: string) => void;
}

const planFeatures: PlanFeatures = {
  initiate: [
    'Business Setup & Integration',
    'CRM & Pipeline Management',
    'Website Builder',
    'Course Builder',
    'Automation Builder (Basic)',
    'All-In-One Conversations',
    'Task Management',
    'Calendar Management',
    '24/7 Support'
  ],
  elevate: [
    'Everything in Initiate',
    'Unlimited Seats & Contacts',
    'AI-Automation Integration',
    'Lead Intake Automations',
    'Sales & Marketing Automations',
    'Website Integration & Hosting',
    'WhatsApp & Slack Integration',
    'Automatic SEO Optimization',
    'Affiliate Program & Management',
    'Memberships, Community & App Builder'
  ],
  custom: [
    'Everything in Elevate',
    'Agency Automations',
    'Agency Sales & Marketing Drips',
    'Agency Lead Intake & Distribution',
    'Agency Qualifying Forms & Surveys',
    'Agency Calendar Setup',
    'Access to Resellers License',
    'Dedicated Account Manager',
    'Custom Integrations',
    'White-label Options'
  ]
};

const planLimits: PlanLimits = {
  initiate: {
    maxSeats: 3,
    maxContacts: 500,
    maxAutomations: 5,
    hasAI: false,
    hasAffiliateProgram: false,
    hasWhiteLabel: false,
    customIntegrations: false,
  },
  elevate: {
    maxSeats: -1, // unlimited
    maxContacts: -1, // unlimited
    maxAutomations: 20,
    hasAI: true,
    hasAffiliateProgram: true,
    hasWhiteLabel: false,
    customIntegrations: false,
  },
  custom: {
    maxSeats: -1, // unlimited
    maxContacts: -1, // unlimited
    maxAutomations: -1, // unlimited
    hasAI: true,
    hasAffiliateProgram: true,
    hasWhiteLabel: true,
    customIntegrations: true,
  }
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: ReactNode;
}

export const PlanProvider: React.FC<PlanProviderProps> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('initiate'); // Default to initiate

  const hasFeature = (feature: keyof PlanLimits['initiate']): boolean => {
    return Boolean(planLimits[currentPlan][feature]);
  };

  const upgradePrompt = (feature: string) => {
    // This would typically show a modal or navigate to pricing
    console.log(`Upgrade to access ${feature}`);
    alert(`This feature "${feature}" requires an upgrade. Please visit the pricing page to upgrade your plan.`);
  };

  const value: PlanContextType = {
    currentPlan,
    setCurrentPlan,
    planLimits,
    hasFeature,
    upgradePrompt,
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
