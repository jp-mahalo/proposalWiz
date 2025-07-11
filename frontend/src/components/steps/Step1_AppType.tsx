import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { useWizardContext, Step1FormData } from '../../context/WizardContext';

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

const mobilePlatformOptions = ['iOS', 'Android'];

const Step1_AppType: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step1 || {};

  const [applicationType, setApplicationType] = useState(stepData.applicationType || '');
  const [mobilePlatforms, setMobilePlatforms] = useState<string[]>(stepData.mobilePlatforms || []);

  useEffect(() => {
    // Pre-fill if coming back to this step
    setApplicationType(stepData.applicationType || '');
    setMobilePlatforms(stepData.mobilePlatforms || []);
  }, [stepData]);


  const handleAppTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAppType = event.target.value as Step1FormData['applicationType'];
    setApplicationType(newAppType);
    let updatedMobilePlatforms = mobilePlatforms;
    if (newAppType === 'web') {
      updatedMobilePlatforms = []; // Clear mobile platforms if web is selected
      setMobilePlatforms([]);
    }
    setFormData((prev) => ({
      ...prev,
      step1: { ...prev.step1, applicationType: newAppType, mobilePlatforms: updatedMobilePlatforms },
    }));
  };

  const handleMobilePlatformsChange = (event: SelectChangeEvent<typeof mobilePlatforms>) => {
    const {
      target: { value },
    } = event;
    const newMobilePlatforms = typeof value === 'string' ? value.split(',') : value;
    setMobilePlatforms(newMobilePlatforms);
    setFormData((prev) => ({
      ...prev,
      step1: { ...prev.step1, applicationType, mobilePlatforms: newMobilePlatforms as ('ios'|'android')[] },
    }));
  };

  const showMobilePlatformsSelect = applicationType === 'mobile' || applicationType === 'both';

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Project Scope - Application Type
      </Typography>
      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel component="legend">Select Application Type:</FormLabel>
        <RadioGroup
          aria-label="application-type"
          name="applicationType"
          value={applicationType}
          onChange={handleAppTypeChange}
        >
          <FormControlLabel value="web" control={<Radio />} label="Web Application" />
          <FormControlLabel value="mobile" control={<Radio />} label="Mobile Application" />
          <FormControlLabel value="both" control={<Radio />} label="Both Web & Mobile" />
        </RadioGroup>
      </FormControl>

      {showMobilePlatformsSelect && (
        <FormControl margin="normal" fullWidth>
          <InputLabel id="mobile-platforms-select-label">Specify Mobile Platforms</InputLabel>
          <Select
            labelId="mobile-platforms-select-label"
            id="mobile-platforms-select"
            multiple
            value={mobilePlatforms}
            onChange={handleMobilePlatformsChange}
            input={<OutlinedInput label="Specify Mobile Platforms" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {mobilePlatformOptions.map((platform) => (
              <MenuItem key={platform} value={platform.toLowerCase()}>
                <Checkbox checked={mobilePlatforms.indexOf(platform.toLowerCase()) > -1} />
                <ListItemText primary={platform} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default Step1_AppType;
