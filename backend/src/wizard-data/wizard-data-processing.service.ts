import { Injectable, Logger } from '@nestjs/common';
import { WizardFormDataDto } from './dto/wizard-form-data.dto';
// Import data files to map IDs to names, similar to frontend review screen
import {
    standardRolesData,
    teamLocationPreferencesData
} from '../../../frontend/src/data/resourcingOptions'; // Adjust path as needed
import { deploymentOptionsData } from '../../../frontend/src/data/deploymentOptions';
import { pricingModelsData, complexityOptionsData, supportLevelsData, supportDurationsData } from '../../../frontend/src/data/costingOptions';
import { targetRegionsData } from '../../../frontend/src/data/localizationOptions';
import { functionalModulesData } from '../../../frontend/src/data/functionalModules';
import { thirdPartyIntegrationsData } from '../../../frontend/src/data/thirdPartyIntegrations';
import { complianceOptionsData } from '../../../frontend/src/data/complianceOptions';
import { projectPhasesData } from '../../../frontend/src/data/projectPhases';


// Define interfaces for the processed data structure
// This will be an enriched version of WizardFormDataDto

export interface ProcessedStep1Data {
    applicationType?: string;
    applicationTypeName?: string; // e.g. "Web Application"
    mobilePlatforms?: string[]; // e.g. ["iOS", "Android"]
}

export interface ProcessedStep2Data {
    industry?: string;
    otherIndustry?: string;
}

export interface ProcessedFunctionalModule {
    id: string;
    name: string;
    subModules: { id: string; name: string }[];
}
export interface ProcessedStep3Data {
    selectedModules: ProcessedFunctionalModule[];
    otherModulesText?: string;
}

export interface ProcessedStep4Data {
    selectedIntegrations: { id: string; name: string }[];
    otherIntegrationsText?: string;
}

export interface ProcessedStep5Data {
    deploymentEnvironment?: string;
    deploymentEnvironmentName?: string;
    preferredRegion?: string;
}

export interface ProcessedPhase {
    id: string;
    name: string;
    duration?: string;
}
export interface ProcessedStep6Data {
    projectStartDate?: string;
    projectCompletionDate?: string;
    phaseDurations: ProcessedPhase[];
}

export interface ProcessedStep7Data {
    targetRegions?: { id: string; name: string }[];
    europeCountries?: string;
    africaCountries?: string;
    multiLanguageSupport?: boolean;
    selectedLanguages?: string[];
    otherLanguage?: string;
    currencyLocalization?: boolean;
    selectedCurrencies?: string[];
    otherCurrency?: string;
    timezoneSupport?: boolean;
}

export interface ProcessedStep8Data {
    selectedComplianceOptions?: { id: string; name: string }[];
    otherComplianceText?: string;
}

export interface ProcessedStep9Data {
    pricingModel?: string;
    pricingModelName?: string;
    projectComplexity?: string;
    projectComplexityName?: string;
    paymentTerms?: string;
    otherPaymentTerms?: string;
    proposalCurrency?: string;
    preferredBudgetRange?: string;
    ongoingMaintenance?: boolean;
    supportLevel?: string;
    supportLevelName?: string;
    supportDuration?: string;
    supportDurationName?: string;
}

export interface ProcessedRoleResourcing {
    roleId: string;
    roleName: string;
    quantity: number | string;
    fte: number | string;
}
export interface ProcessedStep10Data {
    roles: ProcessedRoleResourcing[];
    customRoles: ProcessedRoleResourcing[]; // Assuming custom roles already have names
    teamLocationPreference?: string;
    teamLocationPreferenceName?: string;
}

export interface ProcessedWizardData {
    step1?: ProcessedStep1Data;
    step2?: ProcessedStep2Data;
    step3?: ProcessedStep3Data;
    step4?: ProcessedStep4Data;
    step5?: ProcessedStep5Data;
    step6?: ProcessedStep6Data;
    step7?: ProcessedStep7Data;
    step8?: ProcessedStep8Data;
    step9?: ProcessedStep9Data;
    step10?: ProcessedStep10Data;
    // Add any other global/derived properties if needed
}


@Injectable()
export class WizardDataProcessingService {
    private readonly logger = new Logger(WizardDataProcessingService.name);

    constructor() {
        this.logger.log('WizardDataProcessingService initialized. Note: Paths to frontend data files might need adjustment.');
        // Log actual paths being resolved for frontend data to help debug if necessary
        // For example:
        // try {
        //   require.resolve('../../../frontend/src/data/resourcingOptions');
        //   this.logger.log('Frontend data path for resourcingOptions seems resolvable.');
        // } catch (e) {
        //   this.logger.error('Failed to resolve path for resourcingOptions. Check backend/src/wizard-data/wizard-data-processing.service.ts imports.', e.stack);
        // }
    }

    process(wizardData: WizardFormDataDto): ProcessedWizardData {
        this.logger.log('Starting wizard data processing...');
        const processed: ProcessedWizardData = {};

        if (wizardData.step1) {
            const appType = wizardData.step1.applicationType;
            let appTypeName = '';
            if (appType === 'web') appTypeName = 'Web Application';
            else if (appType === 'mobile') appTypeName = 'Mobile Application';
            else if (appType === 'both') appTypeName = 'Both Web & Mobile';

            processed.step1 = {
                applicationType: appType,
                applicationTypeName: appTypeName,
                mobilePlatforms: wizardData.step1.mobilePlatforms?.map(p => p.toUpperCase()), // e.g. iOS, Android
            };
        }

        if (wizardData.step2) {
            processed.step2 = { ...wizardData.step2 };
        }

        if (wizardData.step3) {
            const selectedMainModules = wizardData.step3.selectedModules || {};
            const processedModules: ProcessedFunctionalModule[] = Object.entries(selectedMainModules)
                .map(([mainId, subIds]) => {
                    const mainModuleDef = functionalModulesData.find(m => m.id === mainId);
                    if (!mainModuleDef) return null;
                    return {
                        id: mainId,
                        name: mainModuleDef.name,
                        subModules: (subIds || []).map(subId => {
                            const subModuleDef = mainModuleDef.subModules?.find(sm => sm.id === subId);
                            return { id: subId, name: subModuleDef?.name || subId };
                        }).filter(sm => sm !== null),
                    };
                })
                .filter(m => m !== null) as ProcessedFunctionalModule[];

            processed.step3 = {
                selectedModules: processedModules,
                otherModulesText: wizardData.step3.otherModulesText,
            };
        }

        if (wizardData.step4) {
            processed.step4 = {
                selectedIntegrations: (wizardData.step4.selectedIntegrations || []).map(id => {
                    const integration = thirdPartyIntegrationsData.find(i => i.id === id);
                    return { id, name: integration?.name || id };
                }),
                otherIntegrationsText: wizardData.step4.otherIntegrationsText,
            };
        }

        if (wizardData.step5) {
            const env = wizardData.step5.deploymentEnvironment;
            processed.step5 = {
                deploymentEnvironment: env,
                deploymentEnvironmentName: deploymentOptionsData.find(o => o.id === env)?.name,
                preferredRegion: wizardData.step5.preferredRegion,
            };
        }

        if (wizardData.step6) {
            const phases: ProcessedPhase[] = [];
            if (wizardData.step6.phaseDurations) {
                for (const [id, duration] of Object.entries(wizardData.step6.phaseDurations)) {
                    // Special handling for mobile dev phase based on step1 data
                    if (id === 'development_mobile' && !wizardData.step1?.applicationType?.match(/mobile|both/)) {
                        if (!duration) continue; // Skip if no duration and not mobile project
                    }
                    phases.push({
                        id,
                        name: projectPhasesData.find(p => p.id === id)?.name || id,
                        duration: duration || projectPhasesData.find(p => p.id === id)?.defaultDuration || 'N/A',
                    });
                }
            }
            processed.step6 = {
                projectStartDate: wizardData.step6.projectStartDate,
                projectCompletionDate: wizardData.step6.projectCompletionDate,
                phaseDurations: phases,
            };
        }

        if (wizardData.step7) {
            processed.step7 = {
                ...wizardData.step7,
                targetRegions: (wizardData.step7.targetRegions || []).map(id => {
                    const region = targetRegionsData.find(r => r.id === id);
                    return {id, name: region?.name || id };
                }),
            };
        }

        if (wizardData.step8) {
            processed.step8 = {
                selectedComplianceOptions: (wizardData.step8.selectedComplianceOptions || []).map(id => {
                    const compliance = complianceOptionsData.find(c => c.id === id);
                    return { id, name: compliance?.name || id };
                }),
                otherComplianceText: wizardData.step8.otherComplianceText,
            };
        }

        if (wizardData.step9) {
            processed.step9 = {
                ...wizardData.step9,
                pricingModelName: pricingModelsData.find(m => m.id === wizardData.step9?.pricingModel)?.name,
                projectComplexityName: complexityOptionsData.find(c => c.id === wizardData.step9?.projectComplexity)?.name,
                supportLevelName: supportLevelsData.find(sl => sl.id === wizardData.step9?.supportLevel)?.name,
                supportDurationName: supportDurationsData.find(sd => sd.id === wizardData.step9?.supportDuration)?.name,
            };
        }

        if (wizardData.step10) {
            const processedRoles: ProcessedRoleResourcing[] = (wizardData.step10.roles || [])
                .filter(r => r.isSelected) // Ensure only selected roles are processed
                .map(r => ({
                    ...r,
                    roleName: standardRolesData.find(sr => sr.id === r.roleId)?.name || r.roleName || r.roleId,
                }));

            const processedCustomRoles: ProcessedRoleResourcing[] = (wizardData.step10.customRoles || [])
                .map(cr => ({
                    ...cr,
                    roleName: cr.roleName || 'Unnamed Custom Role', // Ensure name exists
                }));

            processed.step10 = {
                roles: processedRoles,
                customRoles: processedCustomRoles,
                teamLocationPreference: wizardData.step10.teamLocationPreference,
                teamLocationPreferenceName: teamLocationPreferencesData.find(tl => tl.id === wizardData.step10?.teamLocationPreference)?.name,
            };
        }

        this.logger.log('Wizard data processing complete.');
        // this.logger.debug(`Processed Data: ${JSON.stringify(processed, null, 2)}`); // For debugging
        return processed;
    }
}
