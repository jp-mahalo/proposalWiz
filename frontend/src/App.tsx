import React, { useState } from 'react'; // Added useState
import {
  Container, Box, Button, Stepper, Step, StepLabel, Typography, Paper, CircularProgress, Alert
} from '@mui/material'; // Added CircularProgress, Alert
import WizardStep from './components/WizardStep';
import { WizardProvider, useWizardContext, WizardFormData } from './context/WizardContext';
import { generateProposalPdf, saveDraftProposal } from './services/api'; // Import API functions

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

// Helper function to trigger file download
const downloadFile = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const WizardContent: React.FC = () => {
  const { activeStep, setActiveStep, formData, totalSteps } = useWizardContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleNext = () => {
    setError(null); // Clear error on navigation
    setSuccessMessage(null);
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setError(null); // Clear error on navigation
    setSuccessMessage(null);
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const handleSaveDraft = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      // Type assertion because formData from context is generic 'any' for steps initially
      const response = await saveDraftProposal(formData as WizardFormData);
      console.log("Draft saved response:", response);
      setSuccessMessage(response.message || "Draft saved successfully!");
      // Potentially update context with draft ID if backend returns one:
      // if (response.draftId) { setFormData(prev => ({...prev, draftId: response.draftId})) }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred while saving draft.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateProposal = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      const pdfBlob = await generateProposalPdf(formData as WizardFormData);
      downloadFile(pdfBlob, 'software_proposal.pdf');
      setSuccessMessage("Proposal PDF generated and download started!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred while generating PDF.");
    } finally {
      setIsLoading(false);
    }
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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <WizardStep>
          {getStepContent(activeStep)}
        </WizardStep>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt:3, borderTop: '1px solid #ccc' }}>
          <Button
            color="inherit"
            disabled={activeStep === 0 || isLoading}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button onClick={handleSaveDraft} sx={{ mr: 1 }} disabled={isLoading}>
            {isLoading && activeStep !== totalSteps -1 ? <CircularProgress size={20} sx={{mr:1}}/> : null}
            Save Draft
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext} disabled={activeStep === totalSteps - 1 || isLoading}>
            Next
          </Button>
        </Box>
        {activeStep === totalSteps - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleGenerateProposal} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" sx={{mr:1}} /> : null}
              Generate Proposal
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
