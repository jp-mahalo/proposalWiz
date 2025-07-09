export interface ProjectRole {
  id: string;
  name: string;
  isCustom?: boolean; // To differentiate predefined from user-added roles
}

export const standardRolesData: ProjectRole[] = [
  { id: 'project_manager', name: 'Project Manager' },
  { id: 'business_analyst', name: 'Business Analyst' },
  { id: 'ui_ux_designer', name: 'UI/UX Designer' },
  { id: 'backend_developer', name: 'Backend Developer' },
  { id: 'frontend_developer', name: 'Frontend Developer' },
  { id: 'mobile_app_developer_ios', name: 'Mobile App Developer (iOS)' },
  { id: 'mobile_app_developer_android', name: 'Mobile App Developer (Android)' },
  { id: 'qa_engineer', name: 'Quality Assurance (QA) Engineer' },
  { id: 'devops_engineer', name: 'DevOps Engineer' },
  { id: 'solution_architect', name: 'Solution Architect' },
  { id: 'technical_lead', name: 'Technical Lead' },
  { id: 'data_scientist', name: 'Data Scientist' },
];

export interface TeamLocationPreference {
  id: string;
  name: string;
}

export const teamLocationPreferencesData: TeamLocationPreference[] = [
  { id: 'onshore', name: 'Onshore' },
  { id: 'offshore', name: 'Offshore' },
  { id: 'hybrid', name: 'Hybrid' },
];
