import { Module } from '@nestjs/common';
import { WizardDataProcessingService } from './wizard-data-processing.service';

@Module({
  providers: [WizardDataProcessingService],
  exports: [WizardDataProcessingService], // Export if other modules need to inject it directly
})
export class WizardDataModule {}
