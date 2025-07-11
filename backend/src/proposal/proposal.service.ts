import { Injectable, Logger } from '@nestjs/common';
import { WizardFormDataDto } from '../wizard-data/dto/wizard-form-data.dto';
import { WizardDataProcessingService, ProcessedWizardData } from '../wizard-data/wizard-data-processing.service';
import { TemplateService } from '../templates/template.service';
import { GanttChartService, GanttPhase } from '../gantt/gantt-chart.service';
import { CostingService, CostEstimationOutput } from '../costing/costing.service';
import { PdfGenerationService } from '../pdf/pdf-generation.service'; // Import PdfGenerationService

@Injectable()
export class ProposalService {
  private readonly logger = new Logger(ProposalService.name);

  constructor(
    private readonly wizardDataProcessingService: WizardDataProcessingService,
    private readonly templateService: TemplateService,
    private readonly ganttChartService: GanttChartService,
    private readonly costingService: CostingService,
    private readonly pdfGenerationService: PdfGenerationService, // Inject PdfGenerationService
  ) {}

  async processAndValidateWizardData(wizardDataDto: WizardFormDataDto): Promise<ProcessedWizardData> {
    this.logger.log('Processing and validating wizard data DTO...');
    const processedData = this.wizardDataProcessingService.process(wizardDataDto);
    return processedData;
  }

  async generateProposalDocument(processedData: ProcessedWizardData): Promise<Buffer> {
    this.logger.log('Generating proposal document using processed data...');

    const isMobileProject = processedData.step1?.applicationType === 'mobile' || processedData.step1?.applicationType === 'both';
    const ganttPhases: GanttPhase[] = this.ganttChartService.generateGanttData(processedData.step6, isMobileProject);
    const costEstimation: CostEstimationOutput = this.costingService.estimateCosts(processedData, ganttPhases);

    const templateDataForTextSections = { ...processedData, ganttPhases, costEstimation };

    const executiveSummary = await this.templateService.render('executiveSummary.md', templateDataForTextSections);
    const introduction = await this.templateService.render('introduction.md', templateDataForTextSections);
    const techSolutionTemplateName = this.templateService.determineTechnicalSolutionTemplate(templateDataForTextSections);
    const technicalSolution = await this.templateService.render(techSolutionTemplateName, templateDataForTextSections);

    // For PDF generation, we pass the raw data structures for tables, and rendered markdown for text
    const pdfInputData = {
        executiveSummary,
        introduction,
        technicalSolution,
        ganttPhases, // Pass structured data for table generation
        costEstimation, // Pass structured data for table generation
        step10: processedData.step10, // For resourcing section
        // Add other necessary processed data or rendered sections
    };

    this.logger.log('All data prepared for PDF generation.');
    const pdfBuffer = await this.pdfGenerationService.generatePdf(pdfInputData);
    return pdfBuffer;
  }
}
