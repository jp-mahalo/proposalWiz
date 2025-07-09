import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useWizardContext, Step3FormData } from '../../context/WizardContext';
import { functionalModulesData, MainModule, SubModule } from '../../data/functionalModules';

const Step3_FunctionalModules: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step3 || { selectedModules: {} };

  // Initialize local state from context or with default empty object
  const [selectedModules, setSelectedModules] = useState<{ [key: string]: string[] }>(
    stepData.selectedModules || {}
  );
  const [otherModulesText, setOtherModulesText] = useState(stepData.otherModulesText || '');

  useEffect(() => {
    setSelectedModules(stepData.selectedModules || {});
    setOtherModulesText(stepData.otherModulesText || '');
  }, [stepData]);

  const handleMainModuleChange = (mainModuleId: string, isChecked: boolean) => {
    const newSelectedModules = { ...selectedModules };
    if (isChecked) {
      // If main module is checked, ensure it has an entry (can be empty array if no submodules selected yet)
      if (!newSelectedModules[mainModuleId]) {
        newSelectedModules[mainModuleId] = [];
      }
    } else {
      // If main module is unchecked, remove it and its submodules
      delete newSelectedModules[mainModuleId];
    }
    setSelectedModules(newSelectedModules);
    updateContext(newSelectedModules, otherModulesText);
  };

  const handleSubModuleChange = (mainModuleId: string, subModuleId: string, isChecked: boolean) => {
    const newSelectedModules = { ...selectedModules };
    // Ensure main module entry exists
    if (!newSelectedModules[mainModuleId]) {
      newSelectedModules[mainModuleId] = [];
    }

    const subModuleSelection = newSelectedModules[mainModuleId];
    if (isChecked) {
      if (!subModuleSelection.includes(subModuleId)) {
        newSelectedModules[mainModuleId] = [...subModuleSelection, subModuleId];
      }
    } else {
      newSelectedModules[mainModuleId] = subModuleSelection.filter(id => id !== subModuleId);
      // Optional: if no submodules are selected, and main module itself isn't a "selectable" item,
      // you might want to remove the mainModuleId key. For now, keep it to indicate main category was interacted with.
    }
    setSelectedModules(newSelectedModules);
    updateContext(newSelectedModules, otherModulesText);
  };

  const handleOtherModulesTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setOtherModulesText(newText);
    updateContext(selectedModules, newText);
  };

  const updateContext = (currentSelectedModules: { [key: string]: string[] }, currentOtherText: string) => {
    setFormData(prev => ({
      ...prev,
      step3: {
        selectedModules: currentSelectedModules,
        otherModulesText: currentOtherText,
      },
    }));
  };

  // Check if a main module is selected (either directly or if any of its submodules are selected)
  const isMainModuleSelected = (mainModuleId: string) => {
    return selectedModules.hasOwnProperty(mainModuleId);
  };

  // Check if a submodule is selected
  const isSubModuleSelected = (mainModuleId: string, subModuleId: string) => {
    return selectedModules[mainModuleId]?.includes(subModuleId) || false;
  };


  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Functional Modules
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Select the core functionalities for the application. Checking a main module will include its general concept.
      </Typography>

      {functionalModulesData.map((mainModule: MainModule) => (
        <Accordion key={mainModule.id} sx={{ my: 1 }} defaultExpanded={isMainModuleSelected(mainModule.id)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${mainModule.id}-content`}
            id={`${mainModule.id}-header`}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isMainModuleSelected(mainModule.id)}
                  onChange={(e) => handleMainModuleChange(mainModule.id, e.target.checked)}
                  onClick={(e) => e.stopPropagation()} // Prevent accordion toggle when clicking checkbox
                />
              }
              label={<Typography variant="subtitle1">{mainModule.name}</Typography>}
              onClick={(e) => e.stopPropagation()} // Prevent accordion toggle when clicking label
            />
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup sx={{ pl: 2 }}> {/* Indent submodules */}
              {mainModule.subModules && mainModule.subModules.map((subModule: SubModule) => (
                <FormControlLabel
                  key={subModule.id}
                  control={
                    <Checkbox
                      checked={isSubModuleSelected(mainModule.id, subModule.id)}
                      onChange={(e) => handleSubModuleChange(mainModule.id, subModule.id, e.target.checked)}
                      disabled={!isMainModuleSelected(mainModule.id)} // Disable if main module not selected
                    />
                  }
                  label={subModule.name}
                />
              ))}
              {!mainModule.subModules && (
                 <Typography variant="caption" color="textSecondary" sx={{ml: 4}}>No specific sub-modules for this category.</Typography>
              )}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box mt={3}>
        <TextField
          label="Other Custom Modules (Specify)"
          fullWidth
          value={otherModulesText}
          onChange={handleOtherModulesTextChange}
          variant="outlined"
          multiline
          minRows={2}
        />
      </Box>
    </div>
  );
};

export default Step3_FunctionalModules;
