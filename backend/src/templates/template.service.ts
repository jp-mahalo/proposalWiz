import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { ProcessedWizardData } from '../wizard-data/wizard-data-processing.service'; // Adjust path as needed

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  // Path relative to the 'dist' or 'src' directory after build/during dev.
  // 'dist/templates/sections' if 'templates' is copied to 'dist' root.
  // 'src/templates/sections' for ts-node dev.
  private readonly templatesPathInDist = path.join(process.cwd(), 'dist', 'templates', 'sections');
  private readonly templatesPathInSrc = path.join(process.cwd(), 'src', 'templates', 'sections');

  private readonly effectiveTemplatesDir: string;

  constructor() {
    // Synchronously determine the templates directory path
    if (fs.existsSync(this.templatesPathInDist)) {
      this.effectiveTemplatesDir = this.templatesPathInDist;
      this.logger.log(`Templates directory determined: ${this.effectiveTemplatesDir} (using dist path)`);
    } else if (fs.existsSync(this.templatesPathInSrc)) {
      this.effectiveTemplatesDir = this.templatesPathInSrc;
      this.logger.log(`Templates directory determined: ${this.effectiveTemplatesDir} (using src path)`);
    } else {
      this.logger.error(
        `Templates directory not found in 'dist/templates/sections' or 'src/templates/sections'. CWD: ${process.cwd()}`
      );
      // Throw an error or set a non-functional default to make it obvious templates won't load
      this.effectiveTemplatesDir = this.templatesPathInSrc; // Defaulting, but likely to fail
      throw new InternalServerErrorException(
        `Critital: Templates directory not found. Looked in ${this.templatesPathInDist} and ${this.templatesPathInSrc}.`
      );
    }
    this._registerHandlebarsHelpers();
  }

  private _registerHandlebarsHelpers() {
    Handlebars.registerHelper('eq', function (a, b) {
      return a === b;
    });
    Handlebars.registerHelper('neq', function (a, b) {
      return a !== b;
    });
    Handlebars.registerHelper('gt', function (a, b) {
      return a > b;
    });
    Handlebars.registerHelper('lt', function (a, b) {
      return a < b;
    });
    Handlebars.registerHelper('notEmpty', function (arr) {
        return Array.isArray(arr) && arr.length > 0;
    });
    // Add more helpers as needed
    this.logger.log('Handlebars helpers registered.');
  }


  private async loadTemplate(templateName: string): Promise<Handlebars.TemplateDelegate> {
    const safeTemplateName = path.basename(templateName);
    if (safeTemplateName !== templateName) {
      this.logger.error(`Potential path traversal attempt with templateName: ${templateName}`);
      throw new InternalServerErrorException('Invalid template name.');
    }

    const filePath = path.join(this.effectiveTemplatesDir, safeTemplateName);
    this.logger.debug(`Attempting to load template from: ${filePath}`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return Handlebars.compile(content);
    } catch (error) {
      this.logger.error(`Failed to load or compile template: ${safeTemplateName} from ${filePath}`, error.stack);
      throw new NotFoundException(`Template '${safeTemplateName}' not found or failed to compile.`);
    }
  }

  public async render(templateName: string, data: any): Promise<string> { // data can be ProcessedWizardData or any part of it
    this.logger.log(`Rendering template: ${templateName}`);
    const templateDelegate = await this.loadTemplate(templateName);
    try {
      return templateDelegate(data);
    } catch (error) {
      this.logger.error(`Error rendering template ${templateName} with data: ${JSON.stringify(data)}`, error.stack);
      throw new InternalServerErrorException(`Failed to render template ${templateName}.`);
    }
  }

  // Example of a method to select a template based on data
  public determineTechnicalSolutionTemplate(data: ProcessedWizardData): string {
    const appType = data.step1?.applicationType;
    if (appType === 'web') {
      return 'technicalSolution_web.md';
    } else if (appType === 'mobile') {
      return 'technicalSolution_mobile.md';
    } else if (appType === 'both') {
      return 'technicalSolution_both.md';
    }
    return 'technicalSolution_generic.md'; // Fallback
  }
}
