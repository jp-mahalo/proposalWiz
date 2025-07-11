export interface PricingModel {
  id: string;
  name: string;
  description?: string;
}

export const pricingModelsData: PricingModel[] = [
  { id: 'fixed_price', name: 'Fixed Price (Lump Sum)', description: 'Requires detailed scope, less flexible.' },
  { id: 'time_material', name: 'Time & Material (Hourly/Daily Rates)', description: 'More flexible, less upfront certainty.' },
  { id: 'hybrid', name: 'Hybrid (Fixed price for phases, T&M for ongoing support)', description: 'Balanced approach.' },
];

export interface ComplexityOption {
  id: string;
  name: string;
}

export const complexityOptionsData: ComplexityOption[] = [
  { id: 'standard', name: 'Standard' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
];

export interface SupportLevel {
  id: string;
  name: string;
}

export const supportLevelsData: SupportLevel[] = [
  { id: 'basic', name: 'Basic Support' },
  { id: 'standard', name: 'Standard Support' },
  { id: 'premium', name: 'Premium Support' },
];

export interface SupportDuration {
  id: string;
  name: string;
}

export const supportDurationsData: SupportDuration[] = [
  { id: '3_months', name: '3 Months' },
  { id: '6_months', name: '6 Months' },
  { id: '1_year', name: '1 Year' },
  { id: 'ongoing', name: 'Ongoing (Annual Contract)' },
];

// Re-using commonCurrencies from localizationOptions.ts for consistency.
// If not already imported where needed, ensure it's accessible.
// For payment terms, we might offer a few predefined ones or just a text field.
export const commonPaymentTerms: string[] = [
    "30% Upfront, 40% Milestones, 30% Completion",
    "50% Upfront, 50% Completion",
    "Monthly Installments",
    "Per Milestone",
    "Other (Specify)"
];
