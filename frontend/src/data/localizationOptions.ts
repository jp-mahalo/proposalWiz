export interface Region {
  id: string;
  name: string;
  needsCountrySpecification?: boolean; // e.g., for Europe, Africa
}

export const targetRegionsData: Region[] = [
  { id: 'india', name: 'India' },
  { id: 'us', name: 'United States (US)' },
  { id: 'europe', name: 'Europe', needsCountrySpecification: true },
  { id: 'africa', name: 'Africa', needsCountrySpecification: true },
  { id: 'apac_ex_india', name: 'Asia Pacific (Excluding India)' },
  { id: 'middle_east', name: 'Middle East' },
  { id: 'south_america', name: 'South America' },
  { id: 'canada', name: 'Canada' },
  { id: 'australia_nz', name: 'Australia/New Zealand' },
  { id: 'global', name: 'Global' },
];

// Example languages - can be expanded
export const commonLanguages: string[] = [
  'English', 'Spanish', 'French', 'German', 'Chinese (Mandarin)', 'Hindi', 'Arabic', 'Portuguese', 'Russian', 'Japanese', 'Other'
];

// Example currencies - can be expanded
export const commonCurrencies: string[] = [
  'USD (US Dollar)', 'EUR (Euro)', 'GBP (British Pound)', 'INR (Indian Rupee)',
  'CAD (Canadian Dollar)', 'AUD (Australian Dollar)', 'JPY (Japanese Yen)', 'CNY (Chinese Yuan)', 'Other'
];
