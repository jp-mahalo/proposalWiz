import { Injectable, Logger } from '@nestjs/common';
import { ProcessedStep6Data, ProcessedPhase } from '../wizard-data/wizard-data-processing.service';
// We need the dependency data. For now, hardcode or import from a backend copy.
// Let's assume we'll copy/adapt phaseDependencies from frontend/src/data/projectPhases.ts
// For this task, I will define it directly in this service for simplicity.

// Helper to add days to a date. Ignores weekends for simplicity if converting weeks.
// For more robust date math, a library like date-fns is recommended.
function addBusinessDays(startDate: Date, days: number): Date {
  const date = new Date(startDate.valueOf());
  let addedDays = 0;
  while (addedDays < days) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay(); // Sunday = 0, Saturday = 6
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  return date;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export interface GanttPhase extends ProcessedPhase {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  calculatedDurationDays: number;
}

// Simplified phase dependencies structure for backend use
const backendPhaseDependencies: { [phaseId: string]: string[] } = {
    design_ux_ui: ['discovery_planning'],
    development_backend: ['design_ux_ui'],
    development_frontend: ['development_backend'],
    development_mobile: ['design_ux_ui'],
    testing_qa: ['development_frontend', 'development_mobile', 'development_backend'], // Depends on what's built
    deployment: ['testing_qa'],
    uat: ['deployment'],
};


@Injectable()
export class GanttChartService {
  private readonly logger = new Logger(GanttChartService.name);

  // Parses duration strings like "2-4 weeks", "10 days" into an estimated number of business days.
  private parseDurationToBusinessDays(durationText: string): number {
    if (!durationText) return 0;

    const weeksMatch = durationText.match(/(\d+)\s*-\s*(\d+)\s*weeks/i);
    if (weeksMatch) {
      const minWeeks = parseInt(weeksMatch[1], 10);
      const maxWeeks = parseInt(weeksMatch[2], 10);
      return Math.ceil((minWeeks + maxWeeks) / 2) * 5; // Average weeks * 5 business days
    }

    const weekMatch = durationText.match(/(\d+)\s*week/i); // Single week or X weeks
    if (weekMatch) {
      return parseInt(weekMatch[1], 10) * 5; // Weeks * 5 business days
    }

    const daysMatch = durationText.match(/(\d+)\s*days/i);
    if (daysMatch) {
      return parseInt(daysMatch[1], 10); // Assuming these are business days already
    }

    this.logger.warn(`Could not parse duration: "${durationText}". Defaulting to 0 days.`);
    return 0; // Default if unparseable
  }

  public generateGanttData(step6Data: ProcessedStep6Data | undefined, isMobileProject: boolean): GanttPhase[] {
    if (!step6Data || !step6Data.projectStartDate || !step6Data.phaseDurations) {
      this.logger.warn('Insufficient data to generate Gantt chart.');
      return [];
    }

    const projectStartDate = new Date(step6Data.projectStartDate);
    if (isNaN(projectStartDate.getTime())) {
        this.logger.error(`Invalid project start date: ${step6Data.projectStartDate}`);
        return [];
    }

    const ganttPhases: GanttPhase[] = [];
    const phaseEndDates: { [phaseId: string]: Date } = {};

    // Sort phases based on dependencies (simple topological sort idea)
    // For this basic version, we process them in the order they are defined,
    // ensuring dependencies are met.
    const phasesToProcess = [...step6Data.phaseDurations];

    // Filter out mobile development if not a mobile project
    if (!isMobileProject) {
        const mobileDevIndex = phasesToProcess.findIndex(p => p.id === 'development_mobile');
        if (mobileDevIndex > -1) {
            phasesToProcess.splice(mobileDevIndex, 1);
        }
    }

    // A more robust solution would use a proper topological sort or iterative processing.
    // For now, iterate multiple times or ensure `projectPhasesData` is somewhat ordered.
    // This simple loop assumes dependencies are met by processing order or will eventually be.
    let processedCount = 0;
    const maxIterations = phasesToProcess.length * phasesToProcess.length; // Safety break
    let iterations = 0;

    while (processedCount < phasesToProcess.length && iterations < maxIterations) {
        iterations++;
        for (const phase of phasesToProcess) {
            if (phaseEndDates[phase.id]) continue; // Already processed

            const dependencies = backendPhaseDependencies[phase.id] || [];
            let canStart = true;
            let currentPhaseStartDate = new Date(projectStartDate.valueOf()); // Default to project start

            if (dependencies.length > 0) {
                let maxDependencyEndDate = new Date(0); // Epoch
                for (const depId of dependencies) {
                    // If a dependency is mobile dev but it's not a mobile project, ignore it
                    if (depId === 'development_mobile' && !isMobileProject && !phasesToProcess.find(p=>p.id === depId)) {
                        continue;
                    }

                    if (!phaseEndDates[depId]) {
                        canStart = false; // Dependency not yet processed
                        break;
                    }
                    if (phaseEndDates[depId] > maxDependencyEndDate) {
                        maxDependencyEndDate = phaseEndDates[depId];
                    }
                }
                if (canStart && maxDependencyEndDate > new Date(0)) {
                    // Start after the latest dependency ends. Add 1 day to start on the next business day.
                    currentPhaseStartDate = addBusinessDays(maxDependencyEndDate, 1);
                }
            }

            if (canStart) {
                const calculatedDurationDays = this.parseDurationToBusinessDays(phase.duration || '0 days');
                const phaseEndDate = addBusinessDays(currentPhaseStartDate, Math.max(1, calculatedDurationDays) -1 ); // Duration includes start day

                ganttPhases.push({
                    ...phase,
                    startDate: formatDate(currentPhaseStartDate),
                    endDate: formatDate(phaseEndDate),
                    calculatedDurationDays,
                });
                phaseEndDates[phase.id] = phaseEndDate;
                processedCount++;
            }
        }
         if (iterations >= maxIterations && processedCount < phasesToProcess.length) {
            this.logger.error("Could not resolve all phase dependencies for Gantt chart, check for circular dependencies or missing phases.");
            // Add remaining phases without proper start dates to indicate issues
            phasesToProcess.forEach(p => {
                if (!phaseEndDates[p.id]) {
                    ganttPhases.push({ ...p, startDate: 'ERROR', endDate: 'ERROR', calculatedDurationDays: 0 });
                }
            });
            break;
        }
    }

    // Sort by start date for final output
    ganttPhases.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    this.logger.log('Gantt data generated.');
    return ganttPhases;
  }
}
