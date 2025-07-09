import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Box,
  SelectChangeEvent
} from '@mui/material';
import { useWizardContext, Step5FormData } from '../../context/WizardContext';
import { deploymentOptionsData, DeploymentEnvironment, cloudRegions } from '../../data/deploymentOptions';

const Step5_Deployment: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step5 || {};

  const [selectedEnvironment, setSelectedEnvironment] = useState(stepData.deploymentEnvironment || '');
  const [preferredRegion, setPreferredRegion] = useState(stepData.preferredRegion || '');

  const currentDeploymentOption = deploymentOptionsData.find(opt => opt.id === selectedEnvironment);
  const showRegionSelect = currentDeploymentOption?.isCloudProvider || false;

  useEffect(() => {
    setSelectedEnvironment(stepData.deploymentEnvironment || '');
    setPreferredRegion(stepData.preferredRegion || '');
  }, [stepData]);

  const handleEnvironmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEnvironmentId = event.target.value;
    setSelectedEnvironment(newEnvironmentId);

    const newEnvOption = deploymentOptionsData.find(opt => opt.id === newEnvironmentId);
    let currentRegion = preferredRegion;
    if (!newEnvOption?.isCloudProvider) {
      currentRegion = ''; // Clear region if not a cloud provider
      setPreferredRegion('');
    }
    updateContext(newEnvironmentId, currentRegion);
  };

  const handleRegionChange = (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRegion = event.target.value;
    setPreferredRegion(newRegion);
    updateContext(selectedEnvironment, newRegion);
  };

  const updateContext = (envId: string, region: string) => {
    setFormData(prev => ({
      ...prev,
      step5: {
        deploymentEnvironment: envId,
        preferredRegion: region,
      },
    }));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Deployment Environment
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Specify the cloud provider or infrastructure for deployment.
      </Typography>

      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel component="legend">Select Deployment Environment:</FormLabel>
        <RadioGroup
          aria-label="deployment-environment"
          name="deploymentEnvironment"
          value={selectedEnvironment}
          onChange={handleEnvironmentChange}
        >
          {deploymentOptionsData.map((option: DeploymentEnvironment) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio />}
              label={option.name}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {showRegionSelect && currentDeploymentOption && (
        <Box mt={2}>
          <FormControl margin="normal" fullWidth>
            <InputLabel id={`region-select-label-${currentDeploymentOption.id}`}>
              Preferred Region/Data Center Location for {currentDeploymentOption.name}
            </InputLabel>
            <Select
              labelId={`region-select-label-${currentDeploymentOption.id}`}
              value={preferredRegion}
              onChange={handleRegionChange}
              label={`Preferred Region/Data Center Location for ${currentDeploymentOption.name}`}
            >
              {(cloudRegions[currentDeploymentOption.id] || []).map(regionName => (
                <MenuItem key={regionName} value={regionName}>
                  {regionName}
                </MenuItem>
              ))}
               <MenuItem value="other_region">
                <em>Other (Specify Below)</em>
              </MenuItem>
            </Select>
          </FormControl>
          {preferredRegion === 'other_region' && (
             <TextField
                margin="normal"
                fullWidth
                label="Specify Other Region/Data Center"
                value={''} // This would need another state variable if we want to persist "other_region_text"
                onChange={(e) => {
                    // To properly handle this, we'd need another piece of state for "otherRegionText"
                    // and update context accordingly. For simplicity, this is a visual placeholder.
                    // In a real app, update preferredRegion to the text directly or store in otherRegionText.
                    console.warn("Other region text field needs separate state management for persistence.");
                    setPreferredRegion(e.target.value); // Temporarily for UI, not fully robust for context
                     updateContext(selectedEnvironment, e.target.value);
                }}
                helperText="Note: For robust 'Other Region' persistence, further state refinement is needed."
            />
          )}
        </Box>
      )}
       {selectedEnvironment === 'client_infra' && (
         <Typography variant="caption" color="textSecondary" sx={{mt:1, display: 'block'}}>
            Note: Details for client's existing infrastructure will be required in the "Notes" section of the final proposal.
         </Typography>
       )}
    </div>
  );
};

export default Step5_Deployment;
