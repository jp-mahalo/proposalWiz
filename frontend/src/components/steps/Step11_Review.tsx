import React from 'react';
import {
  Typography, Box, Button, Paper, Grid, List, ListItem, ListItemText, Divider, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useWizardContext, WizardFormData } from '../../context/WizardContext';
import {
    standardRolesData,
    teamLocationPreferencesData
} from '../../data/resourcingOptions'; // For role names
import { deploymentOptionsData } from '../../data/deploymentOptions'; // For env names
import { pricingModelsData, complexityOptionsData, supportLevelsData, supportDurationsData } from '../../data/costingOptions'; // For names
import { targetRegionsData } from '../../data/localizationOptions'; // For region names
import { functionalModulesData } from '../../data/functionalModules'; // For module names
import { thirdPartyIntegrationsData } from '../../data/thirdPartyIntegrations'; // For integration names
import { complianceOptionsData } from '../../data/complianceOptions'; // For compliance names
import { projectPhasesData } from '../../data/projectPhases'; // For phase names


const SectionTitle: React.FC<{ title: string; step: number; onEdit: (step: number) => void }> = ({ title, step, onEdit }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
    <Typography variant="h6" component="h3">{title}</Typography>
    <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => onEdit(step)}>
      Edit
    </Button>
  </Box>
);

const DataItem: React.FC<{ label: string; value?: string | string[] | boolean | number | null }> = ({ label, value }) => {
  const displayValue = Array.isArray(value) ? value.join(', ') : (typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value ?? 'N/A'));
  if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || value === '') {
    return null; // Don't render if value is not set, empty array, or empty string
  }
  return (
    <ListItem sx={{ py: 0.5 }}>
      <ListItemText primary={label} secondary={displayValue} />
    </ListItem>
  );
};

const Step11_Review: React.FC = () => {
  const { formData, setActiveStep } = useWizardContext();

  const handleEdit = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const {
    step1, step2, step3, step4, step5, step6, step7, step8, step9, step10
  } = formData;

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>Review Your Proposal Details</Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Please review all the information you've provided. Click "Edit" to make changes to any section.
      </Typography>

      {/* Step 1: Application Type */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Project Scope - Application Type" step={0} onEdit={handleEdit} />
        <List dense>
          <DataItem label="Application Type" value={step1?.applicationType} />
          {step1?.mobilePlatforms && step1.mobilePlatforms.length > 0 && (
            <DataItem label="Mobile Platforms" value={step1.mobilePlatforms.join(', ')} />
          )}
        </List>
      </Paper>

      {/* Step 2: Industry */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Project Scope - Industry" step={1} onEdit={handleEdit} />
        <List dense>
          <DataItem label="Industry" value={step2?.industry} />
          {step2?.industry === 'Other' && <DataItem label="Other Industry" value={step2?.otherIndustry} />}
        </List>
      </Paper>

      {/* Step 3: Functional Modules */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Functional Modules" step={2} onEdit={handleEdit} />
        {step3?.selectedModules && Object.keys(step3.selectedModules).length > 0 ? (
          Object.entries(step3.selectedModules).map(([mainModuleId, subModuleIds]) => {
            const mainModule = functionalModulesData.find(m => m.id === mainModuleId);
            return (
              <Box key={mainModuleId} mb={1}>
                <Typography variant="subtitle2">{mainModule?.name || mainModuleId}</Typography>
                {subModuleIds.length > 0 ? (
                  <List dense sx={{pl:2}}>
                    {subModuleIds.map(subId => {
                       const subModule = mainModule?.subModules?.find(sm => sm.id === subId);
                       return <ListItemText key={subId} secondary={subModule?.name || subId} sx={{py:0}} />;
                    })}
                  </List>
                ) : ( <Typography variant="caption" sx={{pl:2, display:'block'}}>General category selected.</Typography>)}
              </Box>
            );
          })
        ) : (<DataItem label="Selected Modules" value="None" />) }
        <DataItem label="Other Custom Modules" value={step3?.otherModulesText} />
      </Paper>

      {/* Step 4: Third-Party Integrations */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Third-Party Integrations" step={3} onEdit={handleEdit} />
        <List dense>
            {(step4?.selectedIntegrations && step4.selectedIntegrations.length > 0) ? step4.selectedIntegrations.map(id => {
                const integration = thirdPartyIntegrationsData.find(i => i.id === id);
                return <ListItemText key={id} primary={integration?.name || id} sx={{py:0}} />;
            }) : <DataItem label="Selected Integrations" value="None" />}
        </List>
        <DataItem label="Other Integrations" value={step4?.otherIntegrationsText} />
      </Paper>

      {/* Step 5: Deployment Environment */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Deployment Environment" step={4} onEdit={handleEdit} />
        <List dense>
          <DataItem label="Environment" value={deploymentOptionsData.find(o=>o.id === step5?.deploymentEnvironment)?.name} />
          <DataItem label="Preferred Region" value={step5?.preferredRegion} />
        </List>
      </Paper>

      {/* Step 6: Timelines */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Timelines & Project Phases" step={5} onEdit={handleEdit} />
        <List dense>
          <DataItem label="Desired Start Date" value={step6?.projectStartDate} />
          <DataItem label="Desired Completion Date" value={step6?.projectCompletionDate} />
        </List>
        {step6?.phaseDurations && Object.keys(step6.phaseDurations).length > 0 && (
            <Box mt={1}>
                <Typography variant="subtitle2">Phase Durations:</Typography>
                <List dense sx={{pl:2}}>
                {Object.entries(step6.phaseDurations).map(([phaseId, duration]) => {
                    const phase = projectPhasesData.find(p => p.id === phaseId);
                    if (!duration && phase?.id === 'development_mobile' && !formData.step1?.applicationType?.match(/mobile|both/)) {
                        return null; // Skip mobile dev if not applicable and duration is empty
                    }
                    return <ListItemText key={phaseId} primary={phase?.name || phaseId} secondary={duration || 'N/A'} sx={{py:0}}/>;
                })}
                </List>
            </Box>
        )}
      </Paper>

      {/* Step 7: Localization */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Target Region & Localization" step={6} onEdit={handleEdit} />
        <List dense>
          <DataItem label="Target Regions" value={step7?.targetRegions?.map(id => targetRegionsData.find(r=>r.id===id)?.name || id)} />
          <DataItem label="European Countries" value={step7?.europeCountries} />
          <DataItem label="African Countries" value={step7?.africaCountries} />
          <DataItem label="Multi-language Support" value={step7?.multiLanguageSupport} />
          {step7?.multiLanguageSupport && <>
            <DataItem label="Selected Languages" value={step7?.selectedLanguages} />
            <DataItem label="Other Language(s)" value={step7?.otherLanguage} />
          </>}
          <DataItem label="Currency Localization" value={step7?.currencyLocalization} />
          {step7?.currencyLocalization && <>
            <DataItem label="Selected Currencies" value={step7?.selectedCurrencies} />
            <DataItem label="Other Currenc(y/ies)" value={step7?.otherCurrency} />
          </>}
          <DataItem label="Timezone Support" value={step7?.timezoneSupport} />
        </List>
      </Paper>

      {/* Step 8: Compliance */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Regulatory Compliance" step={7} onEdit={handleEdit} />
        <List dense>
             {(step8?.selectedComplianceOptions && step8.selectedComplianceOptions.length > 0) ? step8.selectedComplianceOptions.map(id => {
                const compliance = complianceOptionsData.find(c => c.id === id);
                return <ListItemText key={id} primary={compliance?.name || id} sx={{py:0}} />;
            }) : <DataItem label="Selected Compliance" value="None" />}
        </List>
        <DataItem label="Other Regulations" value={step8?.otherComplianceText} />
      </Paper>

      {/* Step 9: Costing */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Costing Parameters" step={8} onEdit={handleEdit} />
        <List dense>
          <DataItem label="Pricing Model" value={pricingModelsData.find(m=>m.id === step9?.pricingModel)?.name} />
          <DataItem label="Project Complexity Override" value={complexityOptionsData.find(c=>c.id === step9?.projectComplexity)?.name} />
          <DataItem label="Payment Terms" value={step9?.paymentTerms === 'Other (Specify)' ? step9?.otherPaymentTerms : step9?.paymentTerms} />
          <DataItem label="Proposal Currency" value={step9?.proposalCurrency} />
          <DataItem label="Preferred Budget Range" value={step9?.preferredBudgetRange} />
          <DataItem label="Ongoing Maintenance & Support" value={step9?.ongoingMaintenance} />
          {step9?.ongoingMaintenance && <>
            <DataItem label="Support Level" value={supportLevelsData.find(sl=>sl.id === step9?.supportLevel)?.name} />
            <DataItem label="Support Duration" value={supportDurationsData.find(sd=>sd.id === step9?.supportDuration)?.name} />
          </>}
        </List>
      </Paper>

      {/* Step 10: Resourcing */}
      <Paper elevation={2} sx={{ p: 2, my: 2 }}>
        <SectionTitle title="Resourcing Requirements" step={9} onEdit={handleEdit} />
        <Typography variant="subtitle2" sx={{mt:1}}>Standard Roles:</Typography>
        {step10?.roles && step10.roles.length > 0 ? (
            <List dense sx={{pl:2}}>
            {step10.roles.filter(r => r.isSelected).map(role => (
                <ListItemText key={role.roleId} primary={`${role.roleName || standardRolesData.find(sr => sr.id === role.roleId)?.name}: Quantity ${role.quantity || 'N/A'}, FTE ${role.fte || 'N/A'}%`} sx={{py:0}}/>
            ))}
            </List>
        ) : (<Typography variant="caption" sx={{pl:2, display:'block'}}>No standard roles selected.</Typography>)}

        <Typography variant="subtitle2" sx={{mt:1}}>Custom Roles:</Typography>
        {step10?.customRoles && step10.customRoles.length > 0 ? (
            <List dense sx={{pl:2}}>
            {step10.customRoles.map((role, index) => (
                <ListItemText key={index} primary={`${role.roleName || 'Unnamed Role'}: Quantity ${role.quantity || 'N/A'}, FTE ${role.fte || 'N/A'}%`} sx={{py:0}}/>
            ))}
            </List>
        ) : (<Typography variant="caption" sx={{pl:2, display:'block'}}>No custom roles added.</Typography>)}
        <List dense>
            <DataItem label="Team Location Preference" value={teamLocationPreferencesData.find(tl=>tl.id === step10?.teamLocationPreference)?.name} />
        </List>
      </Paper>

    </Box>
  );
};

export default Step11_Review;
