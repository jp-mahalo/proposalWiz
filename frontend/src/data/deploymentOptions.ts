export interface DeploymentEnvironment {
  id: string;
  name: string;
  isCloudProvider: boolean; // To determine if region input is needed
}

export const deploymentOptionsData: DeploymentEnvironment[] = [
  { id: 'aws', name: 'AWS (Amazon Web Services)', isCloudProvider: true },
  { id: 'gcp', name: 'GCP (Google Cloud Platform)', isCloudProvider: true },
  { id: 'azure', name: 'Azure (Microsoft Azure)', isCloudProvider: true },
  { id: 'on_premise', name: 'On-Premise', isCloudProvider: false },
  { id: 'hybrid_cloud', name: 'Hybrid Cloud', isCloudProvider: false }, // Or true if region might be relevant for the cloud part
  { id: 'client_infra', name: 'Client\'s Existing Infrastructure', isCloudProvider: false },
];

// Basic list of example regions - this could be much more extensive
// and potentially dynamic based on selected provider in a real app.
export const cloudRegions: { [providerId: string]: string[] } = {
  aws: ['us-east-1 (N. Virginia)', 'us-west-2 (Oregon)', 'eu-west-1 (Ireland)', 'ap-south-1 (Mumbai)', 'ap-southeast-2 (Sydney)'],
  gcp: ['us-central1 (Iowa)', 'europe-west1 (Belgium)', 'asia-south1 (Mumbai)', 'australia-southeast1 (Sydney)'],
  azure: ['East US', 'West Europe', 'Southeast Asia', 'Australia East'],
};
