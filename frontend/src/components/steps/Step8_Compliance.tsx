import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  FormGroup,
  Box,
  Grid,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useWizardContext, Step8FormData } from '../../context/WizardContext';
import { complianceOptionsData, ComplianceOption } from '../../data/complianceOptions';

const Step8_Compliance: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step8 || { selectedComplianceOptions: [] };

  const [selectedCompliance, setSelectedCompliance] = useState<string[]>(
    stepData.selectedComplianceOptions || []
  );
  const [otherComplianceText, setOtherComplianceText] = useState(stepData.otherComplianceText || '');

  useEffect(() => {
    setSelectedCompliance(stepData.selectedComplianceOptions || []);
    setOtherComplianceText(stepData.otherComplianceText || '');
  }, [stepData]);

  const handleComplianceChange = (complianceId: string, isChecked: boolean) => {
    let newSelectedCompliance: string[];
    if (isChecked) {
      newSelectedCompliance = [...selectedCompliance, complianceId];
    } else {
      newSelectedCompliance = selectedCompliance.filter(id => id !== complianceId);
    }
    setSelectedCompliance(newSelectedCompliance);
    updateContext(newSelectedCompliance, otherComplianceText);
  };

  const handleOtherComplianceTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setOtherComplianceText(newText);
    updateContext(selectedCompliance, newText);
  };

  const updateContext = (currentSelectedCompliance: string[], currentOtherText: string) => {
    setFormData(prev => ({
      ...prev,
      step8: {
        selectedComplianceOptions: currentSelectedCompliance,
        otherComplianceText: currentOtherText,
      },
    }));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Regulatory Compliance
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Select relevant compliance standards for the application. Hover over the info icon for details.
      </Typography>

      <FormGroup sx={{mt: 2}}>
        <Grid container spacing={1}>
          {complianceOptionsData.map((option: ComplianceOption) => (
            <Grid item xs={12} sm={12} md={6} key={option.id}> {/* Adjusted grid for more space */}
              <Box display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCompliance.includes(option.id)}
                      onChange={(e) => handleComplianceChange(option.id, e.target.checked)}
                      name={option.id}
                    />
                  }
                  label={option.name}
                  sx={{ flexGrow: 1 }}
                />
                {option.description && (
                  <Tooltip title={option.description} placement="top-start">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </FormGroup>

      <Box mt={3}>
        <TextField
          label="Other Regulations (Specify)"
          fullWidth
          value={otherComplianceText}
          onChange={handleOtherComplianceTextChange}
          variant="outlined"
          multiline
          minRows={2}
        />
      </Box>
    </div>
  );
};

export default Step8_Compliance;
