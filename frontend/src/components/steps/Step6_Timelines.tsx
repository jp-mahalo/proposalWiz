import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Grid,
  Box,
  FormLabel
} from '@mui/material';
import { useWizardContext, Step6FormData, PhaseDurationData } from '../../context/WizardContext';
import { projectPhasesData, ProjectPhase } from '../../data/projectPhases';

const Step6_Timelines: React.FC = () => {
  const { formData, setFormData } = useWizardContext();
  const stepData = formData.step6 || {};

  const [projectStartDate, setProjectStartDate] = useState(stepData.projectStartDate || '');
  const [projectCompletionDate, setProjectCompletionDate] = useState(stepData.projectCompletionDate || '');

  const initialDurations = projectPhasesData.reduce((acc, phase) => {
    acc[phase.id] = stepData.phaseDurations?.[phase.id] || phase.defaultDuration || '';
    return acc;
  }, {} as PhaseDurationData);
  const [phaseDurations, setPhaseDurations] = useState<PhaseDurationData>(initialDurations);

  useEffect(() => {
    setProjectStartDate(stepData.projectStartDate || '');
    setProjectCompletionDate(stepData.projectCompletionDate || '');
    const currentDurations = projectPhasesData.reduce((acc, phase) => {
      acc[phase.id] = stepData.phaseDurations?.[phase.id] || phase.defaultDuration || '';
      return acc;
    }, {} as PhaseDurationData);
    setPhaseDurations(currentDurations);
  }, [stepData]);

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: keyof Pick<Step6FormData, 'projectStartDate' | 'projectCompletionDate'>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setter(newDate);
    updateContext({ [fieldName]: newDate });
  };

  const handleDurationChange = (phaseId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = event.target.value;
    const updatedDurations = { ...phaseDurations, [phaseId]: newDuration };
    setPhaseDurations(updatedDurations);
    updateContext({ phaseDurations: updatedDurations });
  };

  const updateContext = (updatedFields: Partial<Step6FormData>) => {
    setFormData(prev => ({
      ...prev,
      step6: {
        ...(prev.step6 || {}),
        ...updatedFields,
      } as Step6FormData, // Added type assertion
    }));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Timelines & Project Phases
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Provide desired dates and estimated durations for project phases. This will help in generating a preliminary Gantt chart.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Desired Project Start Date"
            type="date"
            fullWidth
            value={projectStartDate}
            onChange={handleDateChange(setProjectStartDate, 'projectStartDate')}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Desired Project Completion Date (Optional)"
            type="date"
            fullWidth
            value={projectCompletionDate}
            onChange={handleDateChange(setProjectCompletionDate, 'projectCompletionDate')}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <FormLabel component="legend" sx={{ mb:1 }}>Estimated Duration for Each Phase:</FormLabel>
        <Grid container spacing={2}>
          {projectPhasesData.map((phase: ProjectPhase) => (
            <Grid item xs={12} sm={6} md={4} key={phase.id}>
              <TextField
                label={phase.name}
                value={phaseDurations[phase.id] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDurationChange(phase.id, e)}
                fullWidth
                variant="outlined"
                helperText={phase.id === 'development_mobile' && !formData.step1?.applicationType?.match(/mobile|both/) ? 'N/A (No mobile app selected)' : ''}
                disabled={phase.id === 'development_mobile' && !formData.step1?.applicationType?.match(/mobile|both/)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Step6_Timelines;
