export interface ProjectPhase {
  id: string;
  name: string;
  defaultDuration?: string; // e.g., "2-4 weeks"
}

export const projectPhasesData: ProjectPhase[] = [
  { id: 'discovery_planning', name: 'Discovery & Planning', defaultDuration: '2-4 weeks' },
  { id: 'design_ux_ui', name: 'Design (UI/UX)', defaultDuration: '3-6 weeks' },
  { id: 'development_backend', name: 'Development (Backend)', defaultDuration: 'X weeks' }, // X, Y, Z to indicate variability
  { id: 'development_frontend', name: 'Development (Frontend)', defaultDuration: 'Y weeks' },
  { id: 'development_mobile', name: 'Mobile App Development (if applicable)', defaultDuration: 'Z weeks' },
  { id: 'testing_qa', name: 'Testing & QA', defaultDuration: '2-4 weeks' },
  { id: 'deployment', name: 'Deployment', defaultDuration: '1-2 weeks' },
  { id: 'uat', name: 'User Acceptance Testing (UAT)', defaultDuration: '1-2 weeks' },
];

// For simplicity, we'll assume a default order for now.
// Dependencies can be more explicitly defined later if needed for Gantt generation.
// Example: 'development_frontend': ['development_backend'] means frontend depends on backend.
export const phaseDependencies: { [phaseId: string]: string[] } = {
  design_ux_ui: ['discovery_planning'],
  development_backend: ['design_ux_ui'],
  development_frontend: ['development_backend'], // Or could be parallel with backend to some extent
  development_mobile: ['design_ux_ui'], // Or parallel with backend/frontend
  testing_qa: ['development_frontend', 'development_mobile'], // Depends on what's being built
  deployment: ['testing_qa'],
  uat: ['deployment'],
};
