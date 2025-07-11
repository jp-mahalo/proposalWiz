import { Controller, Post, Body, HttpCode, HttpStatus, Logger, Get, Res } from '@nestjs/common';
import { Response } from 'express'; // Import Response from express
import { ProposalService } from './proposal.service';
import { WizardFormDataDto } from '../wizard-data/dto/wizard-form-data.dto';

@Controller('proposal')
export class ProposalController {
  private readonly logger = new Logger(ProposalController.name);

  constructor(private readonly proposalService: ProposalService) {}

  // This endpoint might not be strictly necessary if generate-document does it all
  // But useful for debugging the processing step.
  @Post('submit-wizard-data')
  @HttpCode(HttpStatus.OK)
  async submitWizardData(@Body() wizardData: WizardFormDataDto): Promise<any> {
    this.logger.log('Received POST request on /proposal/submit-wizard-data (for processing review)');
    if (!wizardData) {
        this.logger.warn('Received empty wizard data.');
        return { message: 'No data received.', timestamp: new Date().toISOString() };
    }
    return this.proposalService.processAndValidateWizardData(wizardData);
  }

  @Post('generate-document')
  async generateDocument(@Body() wizardData: WizardFormDataDto, @Res() res: Response): Promise<void> {
    this.logger.log('Received POST request on /proposal/generate-document');
    const processedData = await this.proposalService.processAndValidateWizardData(wizardData);
    const pdfBuffer = await this.proposalService.generateProposalDocument(processedData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=software_proposal.pdf');
    res.send(pdfBuffer);
  }

   // Placeholder for saving drafts - might be part of a different module later
   @Post('save-draft')
   @HttpCode(HttpStatus.OK)
   async saveDraft(@Body() wizardData: WizardFormDataDto): Promise<any> {
     this.logger.log('Received POST request on /proposal/save-draft');
     // TODO: Implement actual draft saving logic (likely in Phase 3 with DB)
     return {
       message: 'Draft received. Save functionality not yet fully implemented.',
       draftData: wizardData, // Echo back for now
       timestamp: new Date().toISOString()
     };
   }

}
