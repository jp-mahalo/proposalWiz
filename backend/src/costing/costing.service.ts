import { Injectable, Logger } from '@nestjs/common';
import {
    ProcessedWizardData,
    ProcessedStep10Data,
    ProcessedRoleResourcing,
    ProcessedStep9Data,
    ProcessedStep6Data,
    ProcessedPhase
} from '../wizard-data/wizard-data-processing.service';
import { GanttPhase } from '../gantt/gantt-chart.service'; // If we use Gantt's calculated days

// Placeholder: Role rates (e.g., per hour)
// In a real app, this would come from config/DB
const DEFAULT_HOURLY_RATE = 75; // A generic rate
const roleHourlyRates: { [roleId: string]: number } = {
  project_manager: 100,
  business_analyst: 90,
  ui_ux_designer: 85,
  backend_developer: 120,
  frontend_developer: 110,
  mobile_app_developer_ios: 125,
  mobile_app_developer_android: 125,
  qa_engineer: 80,
  devops_engineer: 115,
  solution_architect: 150,
  technical_lead: 140,
  data_scientist: 130,
  // Custom roles will use DEFAULT_HOURLY_RATE or need a mechanism to set their rates
};

// Placeholder: Complexity multipliers
const complexityMultipliers: { [complexityId: string]: number } = {
  standard: 1.0,
  medium: 1.2,
  high: 1.5,
  default: 1.0, // Fallback
};

const HOURS_PER_DAY = 8;

export interface CostEstimationBreakdown {
  phaseId: string;
  phaseName: string;
  cost: number;
  effortHours: number;
  rolesBreakdown: Array<{
    roleName: string;
    quantity: number | string;
    fte: number | string;
    effortHours: number;
    cost: number;
  }>;
}
export interface CostEstimationOutput {
  costByPhase: CostEstimationBreakdown[];
  subTotalEstimatedCost: number;
  complexityAdjustmentFactor: number;
  complexityAdjustmentName?: string;
  totalEstimatedCost: number;
  currency?: string; // From Step 9
  notes: string[];
}

@Injectable()
export class CostingService {
  private readonly logger = new Logger(CostingService.name);

  // Helper to parse duration string like "2-4 weeks" or "10 days" into business days
  // This is duplicated from GanttChartService; ideally, it should be in a shared utility.
  private parseDurationToBusinessDays(durationText: string | undefined): number {
    if (!durationText) return 0;
    const weeksMatch = durationText.match(/(\d+)\s*-\s*(\d+)\s*weeks/i);
    if (weeksMatch) {
      const minWeeks = parseInt(weeksMatch[1], 10);
      const maxWeeks = parseInt(weeksMatch[2], 10);
      return Math.ceil((minWeeks + maxWeeks) / 2) * 5; // Average weeks * 5 business days
    }
    const weekMatch = durationText.match(/(\d+)\s*week/i);
    if (weekMatch) return parseInt(weekMatch[1], 10) * 5;
    const daysMatch = durationText.match(/(\d+)\s*day/i);
    if (daysMatch) return parseInt(daysMatch[1], 10);
    this.logger.warn(`Could not parse duration for costing: "${durationText}". Defaulting to 0 days.`);
    return 0;
  }


  public estimateCosts(
    processedData: ProcessedWizardData,
    ganttPhases: GanttPhase[], // Use calculated Gantt phases for durations
  ): CostEstimationOutput {
    this.logger.log('Starting cost estimation...');
    const notes: string[] = [`Assumed ${HOURS_PER_DAY} working hours per day.`];
    const costByPhase: CostEstimationBreakdown[] = [];
    let subTotalEstimatedCost = 0;

    const step9Data = processedData.step9;
    const step10Data = processedData.step10;

    if (!step10Data || (!step10Data.roles?.length && !step10Data.customRoles?.length)) {
      notes.push('No resourcing information provided; cost estimation will be zero.');
      return { costByPhase, subTotalEstimatedCost, totalEstimatedCost: 0, complexityAdjustmentFactor: 1, notes, currency: step9Data?.proposalCurrency };
    }

    const allRoles: ProcessedRoleResourcing[] = [
        ...(step10Data.roles || []),
        ...(step10Data.customRoles || [])
    ];

    // Use phases from Gantt data as they have calculated start/end dates
    // and their order might be more reliable if Gantt service sorts them.
    for (const ganttPhase of ganttPhases) {
        if (ganttPhase.startDate === 'ERROR') { // Skip phases that had errors in Gantt generation
            notes.push(`Skipping cost estimation for phase '${ganttPhase.name}' due to Gantt generation error.`);
            continue;
        }

        // If ganttPhase.calculatedDurationDays is not reliable or always present, re-parse from original duration text
        // const phaseDurationDays = ganttPhase.calculatedDurationDays || this.parseDurationToBusinessDays(ganttPhase.duration);
        // For now, trust ganttPhase.calculatedDurationDays
        const phaseDurationDays = ganttPhase.calculatedDurationDays;

        if (phaseDurationDays === 0) {
            notes.push(`Phase '${ganttPhase.name}' has zero duration; its cost will be zero.`);
        }

        let phaseTotalCost = 0;
        let phaseTotalEffortHours = 0;
        const phaseRolesBreakdown: CostEstimationBreakdown['rolesBreakdown'] = [];

        for (const role of allRoles) {
            const quantity = typeof role.quantity === 'string' ? parseInt(role.quantity, 10) : role.quantity;
            const fte = typeof role.fte === 'string' ? parseInt(role.fte, 10) : role.fte;

            if (isNaN(quantity) || isNaN(fte) || quantity <=0 || fte <=0 ) continue;

            const roleHourlyRate = roleHourlyRates[role.roleId] || DEFAULT_HOURLY_RATE;
            if (role.roleId.startsWith('custom_') && !roleHourlyRates[role.roleId]) {
                notes.push(`Custom role '${role.roleName}' is using default hourly rate of ${DEFAULT_HOURLY_RATE}.`);
            }

            // Effort for this role in this phase
            // FTE is a percentage.
            const roleEffortHoursInPhase = quantity * (fte / 100) * phaseDurationDays * HOURS_PER_DAY;
            const roleCostInPhase = roleEffortHoursInPhase * roleHourlyRate;

            if (roleEffortHoursInPhase > 0) {
                 phaseRolesBreakdown.push({
                    roleName: role.roleName,
                    quantity: role.quantity,
                    fte: role.fte,
                    effortHours: parseFloat(roleEffortHoursInPhase.toFixed(2)),
                    cost: parseFloat(roleCostInPhase.toFixed(2)),
                });
            }

            phaseTotalCost += roleCostInPhase;
            phaseTotalEffortHours += roleEffortHoursInPhase;
        }

        costByPhase.push({
            phaseId: ganttPhase.id,
            phaseName: ganttPhase.name,
            cost: parseFloat(phaseTotalCost.toFixed(2)),
            effortHours: parseFloat(phaseTotalEffortHours.toFixed(2)),
            rolesBreakdown: phaseRolesBreakdown,
        });
        subTotalEstimatedCost += phaseTotalCost;
    }

    const complexityId = step9Data?.projectComplexity || 'default';
    const complexityAdjFactor = complexityMultipliers[complexityId] || complexityMultipliers.default;
    if (complexityId !== 'default' && step9Data?.projectComplexity) {
         notes.push(`Applied complexity adjustment factor of ${complexityAdjFactor} for '${step9Data.projectComplexityName || complexityId}'.`);
    }

    const totalEstimatedCost = subTotalEstimatedCost * complexityAdjFactor;

    this.logger.log(`Subtotal: ${subTotalEstimatedCost.toFixed(2)}, Complexity: ${complexityId} (${complexityAdjFactor}), Total: ${totalEstimatedCost.toFixed(2)}`);

    return {
      costByPhase,
      subTotalEstimatedCost: parseFloat(subTotalEstimatedCost.toFixed(2)),
      complexityAdjustmentFactor: complexityAdjFactor,
      complexityAdjustmentName: step9Data?.projectComplexityName || complexityId,
      totalEstimatedCost: parseFloat(totalEstimatedCost.toFixed(2)),
      currency: step9Data?.proposalCurrency || 'USD',
      notes,
    };
  }
}
