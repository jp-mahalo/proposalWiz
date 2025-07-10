import axios from 'axios';
import { WizardFormData } from '../context/WizardContext'; // Adjust path as necessary

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'; // Default backend URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const generateProposalPdf = async (wizardData: WizardFormData): Promise<Blob> => {
  try {
    const response = await apiClient.post('/proposal/generate-document', wizardData, {
      responseType: 'blob', // Important for receiving PDF file
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Try to parse error message if backend sends JSON error for blob response
      // This is tricky because error might not be a blob, but expected response is.
      // For now, just log and rethrow a generic error.
      console.error('Error generating PDF:', error.response.data);
      throw new Error(error.response.data?.message || 'Failed to generate PDF. Server returned an error.');
    } else {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. An unexpected error occurred.');
    }
  }
};

export const saveDraftProposal = async (wizardData: WizardFormData): Promise<any> => {
  try {
    const response = await apiClient.post('/proposal/save-draft', wizardData);
    return response.data; // Expecting JSON response, e.g., { message: "Draft saved", id: "..." }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error saving draft:', error.response.data);
      throw new Error(error.response.data?.message || 'Failed to save draft. Server returned an error.');
    } else {
      console.error('Error saving draft:', error);
      throw new Error('Failed to save draft. An unexpected error occurred.');
    }
  }
};

// Optional: A function to submit data for processing and review (if that endpoint is kept separate)
export const submitWizardDataForReview = async (wizardData: WizardFormData): Promise<any> => {
    try {
      const response = await apiClient.post('/proposal/submit-wizard-data', wizardData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error submitting data:', error.response.data);
        throw new Error(error.response.data?.message || 'Failed to submit data. Server returned an error.');
      } else {
        console.error('Error submitting data:', error);
        throw new Error('Failed to submit data. An unexpected error occurred.');
      }
    }
  };
