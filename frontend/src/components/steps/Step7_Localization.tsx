import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  FormGroup,
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  ListItemText,
  SelectChangeEvent,
  Switch
} from '@mui/material';
import { useWizardContext, Step7FormData } from '../../context/WizardContext';
import { targetRegionsData, Region, commonLanguages, commonCurrencies } from '../../data/localizationOptions';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const Step7_Localization: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step7 || { targetRegions: [] };

  const [targetRegions, setTargetRegions] = useState<string[]>(stepData.targetRegions || []);
  const [europeCountries, setEuropeCountries] = useState(stepData.europeCountries || '');
  const [africaCountries, setAfricaCountries] = useState(stepData.africaCountries || '');
  const [multiLanguageSupport, setMultiLanguageSupport] = useState(stepData.multiLanguageSupport || false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(stepData.selectedLanguages || []);
  const [otherLanguage, setOtherLanguage] = useState(stepData.otherLanguage || '');
  const [currencyLocalization, setCurrencyLocalization] = useState(stepData.currencyLocalization || false);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(stepData.selectedCurrencies || []);
  const [otherCurrency, setOtherCurrency] = useState(stepData.otherCurrency || '');
  const [timezoneSupport, setTimezoneSupport] = useState(stepData.timezoneSupport || false);

  useEffect(() => {
    setTargetRegions(stepData.targetRegions || []);
    setEuropeCountries(stepData.europeCountries || '');
    setAfricaCountries(stepData.africaCountries || '');
    setMultiLanguageSupport(stepData.multiLanguageSupport || false);
    setSelectedLanguages(stepData.selectedLanguages || []);
    setOtherLanguage(stepData.otherLanguage || '');
    setCurrencyLocalization(stepData.currencyLocalization || false);
    setSelectedCurrencies(stepData.selectedCurrencies || []);
    setOtherCurrency(stepData.otherCurrency || '');
    setTimezoneSupport(stepData.timezoneSupport || false);
  }, [stepData]);

  const updateContext = (updatedFields: Partial<Step7FormData>) => {
    setFormData(prev => ({
      ...prev,
      step7: {
        ...(prev.step7 || { targetRegions: [] }), // Ensure targetRegions default
        ...updatedFields,
      } as Step7FormData,
    }));
  };

  const handleRegionChange = (regionId: string, isChecked: boolean) => {
    let newSelectedRegions: string[];
    if (isChecked) {
      newSelectedRegions = [...targetRegions, regionId];
    } else {
      newSelectedRegions = targetRegions.filter(id => id !== regionId);
    }
    setTargetRegions(newSelectedRegions);
    const updates: Partial<Step7FormData> = { targetRegions: newSelectedRegions };
    if (!newSelectedRegions.includes('europe')) updates.europeCountries = '';
    if (!newSelectedRegions.includes('africa')) updates.africaCountries = '';
    updateContext(updates);
  };

  const createTextHandler = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: keyof Step7FormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setter(newValue);
    updateContext({ [fieldName]: newValue });
  };

  const createSwitchHandler = (setter: React.Dispatch<React.SetStateAction<boolean>>, fieldName: keyof Step7FormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setter(newValue);
    const updates: Partial<Step7FormData> = { [fieldName]: newValue };
    if (fieldName === 'multiLanguageSupport' && !newValue) {
        updates.selectedLanguages = [];
        updates.otherLanguage = '';
        setSelectedLanguages([]);
        setOtherLanguage('');
    }
    if (fieldName === 'currencyLocalization' && !newValue) {
        updates.selectedCurrencies = [];
        updates.otherCurrency = '';
        setSelectedCurrencies([]);
        setOtherCurrency('');
    }
    updateContext(updates);
  };

  const createMultiSelectHandler = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: keyof Pick<Step7FormData, 'selectedLanguages' | 'selectedCurrencies'>,
    otherSetter: React.Dispatch<React.SetStateAction<string>>,
    otherFieldName: keyof Pick<Step7FormData, 'otherLanguage' | 'otherCurrency'>
  ) => (event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    const newValues = typeof value === 'string' ? value.split(',') : value;
    setter(newValues);
    const updates: Partial<Step7FormData> = { [fieldName]: newValues };
    if (!newValues.includes('Other')) {
        updates[otherFieldName] = '';
        otherSetter('');
    }
    updateContext(updates);
  };


  const showEuropeCountries = targetRegions.includes('europe');
  const showAfricaCountries = targetRegions.includes('africa');
  const showConditionalOptions = targetRegions.length > 0 || targetRegions.includes('global');

  return (
    <div>
      <Typography variant="h6" gutterBottom>Target Region & Localization</Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Identify primary geographic regions and localization needs.
      </Typography>

      <FormGroup sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Primary Target Regions:</Typography>
        <Grid container spacing={1}>
          {targetRegionsData.map((region: Region) => (
            <Grid item xs={12} sm={6} md={4} key={region.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={targetRegions.includes(region.id)}
                    onChange={(e) => handleRegionChange(region.id, e.target.checked)}
                  />
                }
                label={region.name}
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>

      {showEuropeCountries && (
        <TextField sx={{mt:2}} label="Specify European Countries/Regions" fullWidth value={europeCountries} onChange={createTextHandler(setEuropeCountries, 'europeCountries')} variant="outlined" helperText="e.g., Germany, France, UK" />
      )}
      {showAfricaCountries && (
        <TextField sx={{mt:2}} label="Specify African Countries/Regions" fullWidth value={africaCountries} onChange={createTextHandler(setAfricaCountries, 'africaCountries')} variant="outlined" helperText="e.g., Nigeria, Kenya, South Africa" />
      )}

      {showConditionalOptions && (
        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>Localization Requirements:</Typography>
          <FormGroup>
            <FormControlLabel control={<Switch checked={multiLanguageSupport} onChange={createSwitchHandler(setMultiLanguageSupport, 'multiLanguageSupport')} />} label="Multi-language Support Required?" />
            {multiLanguageSupport && (
              <Box sx={{ pl: 4, mt:1, mb:1 }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="languages-select-label">Select Languages</InputLabel>
                  <Select
                    labelId="languages-select-label"
                    multiple
                    value={selectedLanguages}
                    onChange={createMultiSelectHandler(setSelectedLanguages, 'selectedLanguages', setOtherLanguage, 'otherLanguage')}
                    input={<OutlinedInput label="Select Languages" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {commonLanguages.map(lang => <MenuItem key={lang} value={lang}><Checkbox checked={selectedLanguages.includes(lang)} /><ListItemText primary={lang} /></MenuItem>)}
                  </Select>
                </FormControl>
                {selectedLanguages.includes('Other') && (
                  <TextField margin="dense" label="Specify Other Language(s)" fullWidth value={otherLanguage} onChange={createTextHandler(setOtherLanguage, 'otherLanguage')} />
                )}
              </Box>
            )}

            <FormControlLabel control={<Switch checked={currencyLocalization} onChange={createSwitchHandler(setCurrencyLocalization, 'currencyLocalization')} />} label="Currency Localization Required?" />
             {currencyLocalization && (
              <Box sx={{ pl: 4, mt:1, mb:1 }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="currencies-select-label">Select Currencies</InputLabel>
                  <Select
                    labelId="currencies-select-label"
                    multiple
                    value={selectedCurrencies}
                    onChange={createMultiSelectHandler(setSelectedCurrencies, 'selectedCurrencies', setOtherCurrency, 'otherCurrency')}
                    input={<OutlinedInput label="Select Currencies" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {commonCurrencies.map(curr => <MenuItem key={curr} value={curr}><Checkbox checked={selectedCurrencies.includes(curr)} /><ListItemText primary={curr} /></MenuItem>)}
                  </Select>
                </FormControl>
                {selectedCurrencies.includes('Other') && (
                  <TextField margin="dense" label="Specify Other Currenc(y/ies)" fullWidth value={otherCurrency} onChange={createTextHandler(setOtherCurrency, 'otherCurrency')} />
                )}
              </Box>
            )}
            <FormControlLabel control={<Switch checked={timezoneSupport} onChange={createSwitchHandler(setTimezoneSupport, 'timezoneSupport')} />} label="Timezone Support Required?" />
          </FormGroup>
        </Box>
      )}
    </div>
  );
};

export default Step7_Localization;
