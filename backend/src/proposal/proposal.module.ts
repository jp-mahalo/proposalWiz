import { Module } from '@nestjs/common';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { WizardDataModule } from '../wizard-data/wizard-data.module';
import { TemplatesModule } from '../templates/templates.module';
import { GanttModule } from '../gantt/gantt.module';
import { CostingModule } from '../costing/costing.module';
import { PdfModule } from '../pdf/pdf.module'; // Import PdfModule

@Module({
  imports: [
    WizardDataModule,
    TemplatesModule,
    GanttModule,
    CostingModule,
    PdfModule, // Add PdfModule to imports
  ],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
