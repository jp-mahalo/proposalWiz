import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent
} from '@mui/material';
import { useWizardContext, Step2FormData } from '../../context/WizardContext';

const industries = [
  "Healthcare", "Finance", "Retail & E-commerce", "Education",
  "Manufacturing", "Logistics & Supply Chain", "Real Estate",
  "Hospitality", "Government", "Automotive", "Media & Entertainment",
  "Other"
];

const Step2_Industry: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step2 || {};

  const [selectedIndustry, setSelectedIndustry] = useState(stepData.industry || '');
  const [otherIndustryText, setOtherIndustryText] = useState(stepData.otherIndustry || '');

  useEffect(() => {
    // Pre-fill if coming back to this step
    setSelectedIndustry(stepData.industry || '');
    setOtherIndustryText(stepData.otherIndustry || '');
  }, [stepData]);

  const handleIndustryChange = (event: SelectChangeEvent<string>) => {
    const newIndustry = event.target.value;
    setSelectedIndustry(newIndustry);
    let currentOtherText = otherIndustryText;
    if (newIndustry !== 'Other') {
      currentOtherText = ''; // Clear other text if a predefined industry is selected
      setOtherIndustryText('');
    }
    setFormData((prev) => ({
      ...prev,
      step2: { ...prev.step2, industry: newIndustry, otherIndustry: currentOtherText },
    }));
  };

  const handleOtherIndustryTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOtherText = event.target.value;
    setOtherIndustryText(newOtherText);
    setFormData((prev) => ({
      ...prev,
      step2: { ...prev.step2, industry: selectedIndustry, otherIndustry: newOtherText },
    }));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Project Scope - Industry
      </Typography>
      <FormControl margin="normal" fullWidth>
        <InputLabel id="industry-select-label">Select Industry</InputLabel>
        <Select
          labelId="industry-select-label"
          id="industry-select"
          value={selectedIndustry}
          onChange={handleIndustryChange}
          label="Select Industry"
        >
          {industries.map((industry) => (
            <MenuItem key={industry} value={industry}>
              {industry}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedIndustry === 'Other' && (
        <FormControl margin="normal" fullWidth>
          <TextField
            label="Specify Other Industry"
            value={otherIndustryText}
            onChange={handleOtherIndustryTextChange}
            variant="outlined"
          />
        </FormControl>
      )}
    </div>
  );
};

export default Step2_Industry;
