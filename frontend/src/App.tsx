import React from 'react';
import { Container, Box, Button, Stepper, Step, StepLabel, Typography, Paper } from '@mui/material';
import WizardStep from './components/WizardStep'; // General component for each step's content
import { WizardProvider, useWizardContext } from './context/WizardContext';

// Import step components
import Step1_AppType from './components/steps/Step1_AppType';
import Step2_Industry from './components/steps/Step2_Industry';
import Step3_FunctionalModules from './components/steps/Step3_FunctionalModules';
import Step4_Integrations from './components/steps/Step4_Integrations';
import Step5_Deployment from './components/steps/Step5_Deployment';
import Step6_Timelines from './components/steps/Step6_Timelines';
import Step7_Localization from './components/steps/Step7_Localization';
import Step8_Compliance from './components/steps/Step8_Compliance';
import Step9_Costing from './components/steps/Step9_Costing';
import Step10_Resourcing from './components/steps/Step10_Resourcing';
import Step11_Review from './components/steps/Step11_Review';

const stepLabels = [
  'App Type', 'Industry', 'Modules', 'Integrations', 'Deployment',
  'Timelines', 'Localization', 'Compliance', 'Costing', 'Resourcing', 'Review'
];

const WizardContent: React.FC = () => {
  const { activeStep, setActiveStep, formData, totalSteps } = useWizardContext();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const handleSaveDraft = () => {
    // Placeholder for save draft functionality
    console.log("Draft saved:", formData);
    alert("Draft Saved (check console)!");
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0: return <Step1_AppType />;
      case 1: return <Step2_Industry />;
      case 2: return <Step3_FunctionalModules />;
      case 3: return <Step4_Integrations />;
      case 4: return <Step5_Deployment />;
      case 5: return <Step6_Timelines />;
      case 6: return <Step7_Localization />;
      case 7: return <Step8_Compliance />;
      case 8: return <Step9_Costing />;
      case 9: return <Step10_Resourcing />;
      case 10: return <Step11_Review />;
      default: return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ my: 4, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Software Proposal Generator
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }} alternativeLabel>
          {stepLabels.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <WizardStep>
          {getStepContent(activeStep)}
        </WizardStep>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt:3, borderTop: '1px solid #ccc' }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button onClick={handleSaveDraft} sx={{ mr: 1 }}>
            Save Draft
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext} disabled={activeStep === totalSteps - 1}>
            Next
          </Button>
        </Box>
        {activeStep === totalSteps - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary">
              Generate Proposal (Placeholder)
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

const App: React.FC = () => {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
};

export default App;
