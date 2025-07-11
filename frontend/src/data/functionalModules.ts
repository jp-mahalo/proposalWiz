export interface SubModule {
  id: string;
  name: string;
}

export interface MainModule {
  id: string;
  name: string;
  subModules?: SubModule[];
}

export const functionalModulesData: MainModule[] = [
  {
    id: 'userManagement',
    name: 'User Management',
    subModules: [
      { id: 'authentication', name: 'Authentication (Email/Password, Social Login, SSO)' },
      { id: 'rbac', name: 'Role-Based Access Control (RBAC)' },
      { id: 'userProfiles', name: 'User Profiles' },
      { id: 'userOnboardingOffboarding', name: 'User Onboarding/Offboarding' },
    ],
  },
  {
    id: 'communication',
    name: 'Communication',
    subModules: [
      { id: 'chat', name: 'Chat (1-on-1, Group, Real-time)' },
      { id: 'emailSending', name: 'Email Sending (Transactional, Marketing)' },
      { id: 'inAppNotifications', name: 'In-App Notifications' },
      { id: 'pushNotifications', name: 'Push Notifications (for mobile)' },
      { id: 'smsNotifications', name: 'SMS Notifications' },
      { id: 'teleconferenceIntegration', name: 'Teleconference Integration (e.g., Zoom, Google Meet)' },
    ],
  },
  {
    id: 'dataContentManagement',
    name: 'Data & Content Management',
    subModules: [
      { id: 'dashboard', name: 'Dashboard (Analytics, Reporting)' },
      { id: 'cms', name: 'Content Management System (CMS)' },
      { id: 'documentManagement', name: 'Document Management' },
      { id: 'mediaManagement', name: 'Media Management (Images, Videos)' },
    ],
  },
  {
    id: 'businessOperations',
    name: 'Business Operations',
    subModules: [
      { id: 'inventoryManagement', name: 'Inventory Management' },
      { id: 'invoicing', name: 'Invoicing' },
      { id: 'billingPayments', name: 'Billing & Payments (Subscription, One-time)' },
      { id: 'orderManagement', name: 'Order Management' },
      { id: 'crm', name: 'Customer Relationship Management (CRM)' },
      { id: 'reportingAnalytics', name: 'Reporting & Analytics' },
    ],
  },
  {
    id: 'schedulingPlanning',
    name: 'Scheduling & Planning',
    subModules: [
      { id: 'appointmentsBooking', name: 'Appointments Booking' },
      { id: 'calendaring', name: 'Calendaring (Personal, Shared)' },
      { id: 'projectTimelinesGantt', name: 'Project Timelines using Gantt Charts' },
      { id: 'resourceScheduling', name: 'Resource Scheduling' },
    ],
  },
  {
    id: 'advancedSpecific',
    name: 'Advanced/Specific',
    subModules: [
      { id: 'geolocationMaps', name: 'Geolocation/Maps Integration' },
      { id: 'ecommerceFeatures', name: 'E-commerce Features (Product Catalog, Shopping Cart, Checkout)' },
      { id: 'searchFunctionality', name: 'Search Functionality (Basic, Advanced, Faceted)' },
      { id: 'multiLanguageSupport', name: 'Multi-language Support' },
      { id: 'adminPanel', name: 'Admin Panel' },
      { id: 'auditLogs', name: 'Audit Logs' },
    ],
  },
];
