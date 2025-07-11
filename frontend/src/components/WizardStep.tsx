import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

interface WizardStepProps {
  children: ReactNode;
}

const WizardStep: React.FC<WizardStepProps> = ({ children }) => {
  return (
    <Box sx={{ p: 2, minHeight: '300px' }}> {/* Min height to give some space */}
      {children}
    </Box>
  );
};

export default WizardStep;
