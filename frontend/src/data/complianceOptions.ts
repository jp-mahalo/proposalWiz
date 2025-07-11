export interface ComplianceOption {
  id: string;
  name: string;
  description?: string; // Optional: For tooltips or future info icons
}

export const complianceOptionsData: ComplianceOption[] = [
  {
    id: 'gdpr',
    name: 'GDPR (General Data Protection Regulation)',
    description: 'For protecting data and privacy of individuals in the European Union and European Economic Area.'
  },
  {
    id: 'iso27001',
    name: 'ISO 27001 (Information Security Management)',
    description: 'International standard for managing information security.'
  },
  {
    id: 'hipaa',
    name: 'HIPAA (Health Insurance Portability and Accountability Act)',
    description: 'For protecting sensitive patient health information in the US.'
  },
  {
    id: 'ccpa',
    name: 'CCPA (California Consumer Privacy Act)',
    description: 'For enhancing privacy rights and consumer protection for residents of California.'
  },
  {
    id: 'pci_dss',
    name: 'PCI DSS (Payment Card Industry Data Security Standard)',
    description: 'For organizations that handle branded credit cards from the major card schemes.'
  },
  {
    id: 'soc2',
    name: 'SOC 2 (Service Organization Control 2)',
    description: 'For service providers storing customer data in the cloud, based on Trust Services Criteria.'
  },
];
