import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  FormGroup,
  Box,
  Grid
} from '@mui/material';
import { useWizardContext, Step4FormData } from '../../context/WizardContext';
import { thirdPartyIntegrationsData, Integration } from '../../data/thirdPartyIntegrations';

const Step4_Integrations: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step4 || { selectedIntegrations: [] };

  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    stepData.selectedIntegrations || []
  );
  const [otherIntegrationsText, setOtherIntegrationsText] = useState(stepData.otherIntegrationsText || '');

  useEffect(() => {
    setSelectedIntegrations(stepData.selectedIntegrations || []);
    setOtherIntegrationsText(stepData.otherIntegrationsText || '');
  }, [stepData]);

  const handleIntegrationChange = (integrationId: string, isChecked: boolean) => {
    let newSelectedIntegrations: string[];
    if (isChecked) {
      newSelectedIntegrations = [...selectedIntegrations, integrationId];
    } else {
      newSelectedIntegrations = selectedIntegrations.filter(id => id !== integrationId);
    }
    setSelectedIntegrations(newSelectedIntegrations);
    updateContext(newSelectedIntegrations, otherIntegrationsText);
  };

  const handleOtherIntegrationsTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setOtherIntegrationsText(newText);
    updateContext(selectedIntegrations, newText);
  };

  const updateContext = (currentSelectedIntegrations: string[], currentOtherText: string) => {
    setFormData(prev => ({
      ...prev,
      step4: {
        selectedIntegrations: currentSelectedIntegrations,
        otherIntegrationsText: currentOtherText,
      },
    }));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Third-Party Integrations
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Identify external services the application needs to connect with.
      </Typography>

      <FormGroup>
        <Grid container spacing={1}>
          {thirdPartyIntegrationsData.map((integration: Integration) => (
            <Grid item xs={12} sm={6} md={4} key={integration.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedIntegrations.includes(integration.id)}
                    onChange={(e) => handleIntegrationChange(integration.id, e.target.checked)}
                    name={integration.id}
                  />
                }
                label={integration.name}
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>

      <Box mt={3}>
        <TextField
          label="Other Integrations (Specify)"
          fullWidth
          value={otherIntegrationsText}
          onChange={handleOtherIntegrationsTextChange}
          variant="outlined"
          multiline
          minRows={2}
        />
      </Box>
    </div>
  );
};

export default Step4_Integrations;
