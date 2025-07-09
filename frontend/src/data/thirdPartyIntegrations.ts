export interface Integration {
  id: string;
  name: string;
}

export const thirdPartyIntegrationsData: Integration[] = [
  { id: 'whatsapp', name: 'WhatsApp API' },
  { id: 'twilio', name: 'Twilio (SMS, Voice)' },
  { id: 'sendgrid', name: 'SendGrid (Email)' },
  { id: 'stripe', name: 'Payment Gateway: Stripe' },
  { id: 'paypal', name: 'Payment Gateway: PayPal' },
  { id: 'razorpay', name: 'Payment Gateway: Razorpay' },
  { id: 'payu', name: 'Payment Gateway: PayU' },
  { id: 'salesforce', name: 'CRM: Salesforce' },
  { id: 'hubspot', name: 'CRM: HubSpot' },
  { id: 'sap', name: 'ERP: SAP' },
  { id: 'oracle_erp', name: 'ERP: Oracle' },
  { id: 'quickbooks', name: 'Accounting: QuickBooks' },
  { id: 'xero', name: 'Accounting: Xero' },
  { id: 'mailchimp', name: 'Marketing: Mailchimp' },
  { id: 'google_analytics', name: 'Analytics: Google Analytics' },
  { id: 'mixpanel', name: 'Analytics: Mixpanel' },
  { id: 'facebook_api', name: 'Social Media: Facebook API' },
  { id: 'twitter_api', name: 'Social Media: Twitter API' },
  { id: 'linkedin_api', name: 'Social Media: LinkedIn API' },
  { id: 'google_drive', name: 'Cloud Storage: Google Drive' },
  { id: 'dropbox', name: 'Cloud Storage: Dropbox' },
  { id: 'zoom_api', name: 'Video Conferencing: Zoom API' },
  { id: 'agora_api', name: 'Video Conferencing: Agora API' },
  { id: 'generic_sms_gateway', name: 'SMS Gateways (local/specific)' },
];
