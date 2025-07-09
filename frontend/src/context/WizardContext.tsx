import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export interface Step1FormData {
  applicationType?: 'web' | 'mobile' | 'both';
  mobilePlatforms?: ('ios' | 'android')[];
}

export interface Step2FormData {
  industry?: string;
  otherIndustry?: string;
}

export interface Step3FormData {
  selectedModules: {
    [mainModuleId: string]: string[]; // Key is main module id, value is array of sub-module ids
  };
  otherModulesText?: string;
}

export interface Step4FormData {
  selectedIntegrations: string[]; // Array of selected integration IDs
  otherIntegrationsText?: string;
}

export interface Step5FormData {
  deploymentEnvironment?: string; // ID of the selected environment
  preferredRegion?: string;
}

export interface PhaseDurationData {
  [phaseId: string]: string; // e.g., { discovery_planning: "2-4 weeks" }
}

export interface Step6FormData {
  projectStartDate?: string; // ISO date string
  projectCompletionDate?: string; // ISO date string (optional)
  phaseDurations?: PhaseDurationData;
  // Dependencies will be handled by backend logic based on selected modules or a default flow
}

export interface Step7FormData {
  targetRegions?: string[]; // Array of region IDs
  europeCountries?: string; // Text field for specific European countries
  africaCountries?: string; // Text field for specific African countries
  multiLanguageSupport?: boolean;
  selectedLanguages?: string[]; // Could be text or array of predefined language IDs
  otherLanguage?: string; // If 'Other' is selected for languages
  currencyLocalization?: boolean;
  selectedCurrencies?: string[]; // Could be text or array of predefined currency IDs
  otherCurrency?: string; // If 'Other' is selected for currencies
  timezoneSupport?: boolean;
}

export interface Step8FormData {
  selectedComplianceOptions?: string[]; // Array of compliance option IDs
  otherComplianceText?: string;
}

export interface Step9FormData {
  pricingModel?: string; // ID from pricingModelsData
  projectComplexity?: string; // ID from complexityOptionsData
  paymentTerms?: string; // Could be predefined ID or custom text
  otherPaymentTerms?: string; // If paymentTerms is 'Other'
  proposalCurrency?: string; // e.g., 'USD', 'EUR'
  preferredBudgetRange?: string; // e.g., "50k-75k" or specific value
  ongoingMaintenance?: boolean;
  supportLevel?: string; // ID from supportLevelsData
  supportDuration?: string; // ID from supportDurationsData
}

export interface RoleResourcing {
  roleId: string; // Corresponds to id in standardRolesData or a custom generated one
  roleName?: string; // Especially for custom roles
  quantity: number | string; // Allow string for input flexibility, parse to number later
  fte: number | string; // FTE percentage (e.g., 50 for 50%, 100 for 100%)
  isSelected?: boolean; // For predefined roles, to track if they are included
}
export interface Step10FormData {
  roles: RoleResourcing[]; // For predefined roles
  customRoles: RoleResourcing[]; // For user-added roles
  teamLocationPreference?: string; // ID from teamLocationPreferencesData
}

export interface WizardFormData {
  step1?: Step1FormData;
  step2?: Step2FormData;
  step3?: Step3FormData;
  step4?: Step4FormData;
  step5?: Step5FormData;
  step6?: Step6FormData;
  step7?: Step7FormData;
  step8?: Step8FormData;
  step9?: Step9FormData;
  step10?: Step10FormData;
  // ... and so on for all steps
  [key: string]: any; // Allow other step data
}

interface WizardContextType {
  formData: WizardFormData;
  setFormData: Dispatch<SetStateAction<WizardFormData>>;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  totalSteps: number;
}

export const WizardContext = createContext<WizardContextType | undefined>(undefined);

interface WizardProviderProps {
  children: ReactNode;
}

const TOTAL_WIZARD_STEPS = 11; // 10 steps + 1 review screen

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<WizardFormData>({});
  const [activeStep, setActiveStep] = useState(0);

  return (
    <WizardContext.Provider value={{ formData, setFormData, activeStep, setActiveStep, totalSteps: TOTAL_WIZARD_STEPS }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = () => {
  const context = React.useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizardContext must be used within a WizardProvider');
  }
  return context;
};
