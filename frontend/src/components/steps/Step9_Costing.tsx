import React, { useState, useEffect } from 'react';
import {
  Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Select, MenuItem, InputLabel, TextField, Box, Switch, Grid, SelectChangeEvent, Tooltip
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useWizardContext, Step9FormData } from '../../context/WizardContext';
import {
  pricingModelsData, PricingModel, complexityOptionsData, ComplexityOption,
  supportLevelsData, SupportLevel, supportDurationsData, SupportDuration, commonPaymentTerms
} from '../../data/costingOptions';
import { commonCurrencies } from '../../data/localizationOptions'; // Re-using this

const Step9_Costing: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step9 || {};

  const [pricingModel, setPricingModel] = useState(stepData.pricingModel || '');
  const [projectComplexity, setProjectComplexity] = useState(stepData.projectComplexity || '');
  const [paymentTerms, setPaymentTerms] = useState(stepData.paymentTerms || '');
  const [otherPaymentTerms, setOtherPaymentTerms] = useState(stepData.otherPaymentTerms || '');
  const [proposalCurrency, setProposalCurrency] = useState(stepData.proposalCurrency || 'USD (US Dollar)');
  const [preferredBudgetRange, setPreferredBudgetRange] = useState(stepData.preferredBudgetRange || '');
  const [ongoingMaintenance, setOngoingMaintenance] = useState(stepData.ongoingMaintenance || false);
  const [supportLevel, setSupportLevel] = useState(stepData.supportLevel || '');
  const [supportDuration, setSupportDuration] = useState(stepData.supportDuration || '');

  useEffect(() => {
    setPricingModel(stepData.pricingModel || '');
    setProjectComplexity(stepData.projectComplexity || '');
    setPaymentTerms(stepData.paymentTerms || '');
    setOtherPaymentTerms(stepData.otherPaymentTerms || '');
    setProposalCurrency(stepData.proposalCurrency || 'USD (US Dollar)');
    setPreferredBudgetRange(stepData.preferredBudgetRange || '');
    setOngoingMaintenance(stepData.ongoingMaintenance || false);
    setSupportLevel(stepData.supportLevel || '');
    setSupportDuration(stepData.supportDuration || '');
  }, [stepData]);

  const updateContext = (updatedFields: Partial<Step9FormData>) => {
    setFormData(prev => ({
      ...prev,
      step9: { ...(prev.step9 || {}), ...updatedFields } as Step9FormData,
    }));
  };

  const createRadioChangeHandler = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: keyof Step9FormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const val = event.target.value;
      setter(val);
      updateContext({ [fieldName]: val });
    };

  const createSelectChangeHandler = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: keyof Step9FormData, otherFieldSetter?: React.Dispatch<React.SetStateAction<string>>, otherFieldName?: keyof Step9FormData) =>
    (event: SelectChangeEvent<string>) => {
      const val = event.target.value;
      setter(val);
      const updates: Partial<Step9FormData> = { [fieldName]: val };
      if (val !== 'Other (Specify)' && otherFieldSetter && otherFieldName) {
        otherFieldSetter('');
        updates[otherFieldName] = '';
      }
      updateContext(updates);
    };

  const createTextChangeHandler = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: keyof Step9FormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const val = event.target.value;
      setter(val);
      updateContext({ [fieldName]: val });
    };

  const handleMaintenanceSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.checked;
    setOngoingMaintenance(val);
    const updates: Partial<Step9FormData> = { ongoingMaintenance: val };
    if (!val) { // Clear support level and duration if maintenance is off
      setSupportLevel('');
      setSupportDuration('');
      updates.supportLevel = '';
      updates.supportDuration = '';
    }
    updateContext(updates);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Costing Parameters</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Pricing Model</FormLabel>
            <RadioGroup value={pricingModel} onChange={createRadioChangeHandler(setPricingModel, 'pricingModel')}>
              {pricingModelsData.map((model: PricingModel) => (
                <FormControlLabel key={model.id} value={model.id} control={<Radio />}
                  label={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                      {model.name}
                      {model.description && (
                        <Tooltip title={model.description} placement="top-start" sx={{ ml: 0.5 }}>
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Project Complexity (Optional Override)</FormLabel>
             <RadioGroup value={projectComplexity} onChange={createRadioChangeHandler(setProjectComplexity, 'projectComplexity')}>
              {complexityOptionsData.map((opt: ComplexityOption) => (
                <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.name} />
              ))}
            </RadioGroup>
            <Typography variant="caption" color="textSecondary">System will internally assign complexity. Use this to fine-tune.</Typography>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl margin="normal" fullWidth>
            <InputLabel id="payment-terms-label">Payment Terms Preference</InputLabel>
            <Select labelId="payment-terms-label" value={paymentTerms}
                    onChange={createSelectChangeHandler(setPaymentTerms, 'paymentTerms', setOtherPaymentTerms, 'otherPaymentTerms')} label="Payment Terms Preference">
              {commonPaymentTerms.map(term => <MenuItem key={term} value={term}>{term}</MenuItem>)}
            </Select>
          </FormControl>
          {paymentTerms === 'Other (Specify)' && (
            <TextField label="Specify Other Payment Terms" fullWidth margin="dense" value={otherPaymentTerms}
                       onChange={createTextChangeHandler(setOtherPaymentTerms, 'otherPaymentTerms')} />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl margin="normal" fullWidth>
            <InputLabel id="proposal-currency-label">Currency for Proposal</InputLabel>
            <Select labelId="proposal-currency-label" value={proposalCurrency}
                    onChange={createSelectChangeHandler(setProposalCurrency, 'proposalCurrency')} label="Currency for Proposal">
              {commonCurrencies.map(curr => <MenuItem key={curr} value={curr}>{curr}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
            <TextField label="Optional - Preferred Budget Range (e.g., $10k-$15k, <$20k)" fullWidth margin="normal" value={preferredBudgetRange}
                       onChange={createTextChangeHandler(setPreferredBudgetRange, 'preferredBudgetRange')} />
        </Grid>
      </Grid>

      <Box mt={3} pt={2} borderTop={1} borderColor="divider">
        <Typography variant="subtitle1" gutterBottom>Ongoing Maintenance & Support</Typography>
        <FormControlLabel control={<Switch checked={ongoingMaintenance} onChange={handleMaintenanceSwitch} />} label="Include Ongoing Maintenance & Support?" />

        {ongoingMaintenance && (
          <Grid container spacing={2} sx={{mt: 1, pl:2}}>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" margin="dense" fullWidth>
                <FormLabel component="legend">Level of Support</FormLabel>
                <RadioGroup value={supportLevel} onChange={createRadioChangeHandler(setSupportLevel, 'supportLevel')}>
                  {supportLevelsData.map((level: SupportLevel) => (
                    <FormControlLabel key={level.id} value={level.id} control={<Radio />} label={level.name} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl margin="dense" fullWidth>
                <InputLabel id="support-duration-label">Desired Support Duration</InputLabel>
                <Select labelId="support-duration-label" value={supportDuration}
                        onChange={createSelectChangeHandler(setSupportDuration, 'supportDuration')} label="Desired Support Duration">
                  {supportDurationsData.map((dur: SupportDuration) => <MenuItem key={dur.id} value={dur.id}>{dur.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Step9_Costing;
