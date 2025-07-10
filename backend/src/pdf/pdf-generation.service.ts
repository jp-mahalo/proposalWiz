import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import puppeteer, { PDFOptions } from 'puppeteer';
import { marked } from 'marked';
import {
    ProcessedWizardData,
    ProcessedPhase,
    ProcessedFunctionalModule,
    ProcessedRoleResourcing
} from '../wizard-data/wizard-data-processing.service'; // Adjust path as needed
import { GanttPhase } from '../gantt/gantt-chart.service';
import { CostEstimationOutput, CostEstimationBreakdown } from '../costing/costing.service';

@Injectable()
export class PdfGenerationService {
    private readonly logger = new Logger(PdfGenerationService.name);

    // Helper to generate HTML for a section from Markdown
    private markdownToHtml(title: string, markdownContent?: string): string {
        if (!markdownContent) return '';
        const htmlContent = marked.parse(markdownContent);
        return `
            <section class="section">
                ${title ? `<h2>${title}</h2>` : ''}
                ${htmlContent}
            </section>
        `;
    }

    private generateGanttHtml(ganttPhases: GanttPhase[]): string {
        if (!ganttPhases || ganttPhases.length === 0) return '<p>No timeline data available.</p>';
        let tableHtml = `<h3>Project Timeline (Gantt Chart Representation)</h3>
                         <table>
                            <thead>
                                <tr>
                                    <th>Phase</th>
                                    <th>Duration</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                </tr>
                            </thead>
                            <tbody>`;
        ganttPhases.forEach(phase => {
            tableHtml += `
                <tr>
                    <td>${phase.name}</td>
                    <td>${phase.duration || 'N/A'}</td>
                    <td>${phase.startDate}</td>
                    <td>${phase.endDate}</td>
                </tr>`;
        });
        tableHtml += `</tbody></table>`;
        return tableHtml;
    }

    private generateCostingHtml(costEstimation?: CostEstimationOutput): string {
        if (!costEstimation) return '<p>No costing data available.</p>';
        let html = `<h3>Cost Estimation</h3>
                    <p><strong>Sub-Total Estimated Cost:</strong> ${costEstimation.currency} ${costEstimation.subTotalEstimatedCost.toLocaleString()}</p>
                    <p><strong>Complexity Adjustment (${costEstimation.complexityAdjustmentName || 'N/A'}):</strong> x${costEstimation.complexityAdjustmentFactor}</p>
                    <p><strong>Total Estimated Cost:</strong> ${costEstimation.currency} ${costEstimation.totalEstimatedCost.toLocaleString()}</p>
                    <h4>Cost Breakdown by Phase:</h4>
                    <table>
                        <thead><tr><th>Phase</th><th>Effort (Hours)</th><th>Estimated Cost (${costEstimation.currency})</th></tr></thead>
                        <tbody>`;
        costEstimation.costByPhase.forEach(phase => {
            html += `<tr>
                        <td>${phase.phaseName}</td>
                        <td>${phase.effortHours.toLocaleString()} hrs</td>
                        <td>${phase.cost.toLocaleString()}</td>
                     </tr>`;
        });
        html += `</tbody></table>`;
        if (costEstimation.notes && costEstimation.notes.length > 0) {
            html += `<h4>Notes:</h4><ul>${costEstimation.notes.map(note => `<li>${note}</li>`).join('')}</ul>`;
        }
        return html;
    }

    private generateResourcingHtml(step10Data?: ProcessedWizardData['step10']): string {
        if (!step10Data) return '<p>No resourcing data available.</p>';
        let html = `<h3>Resourcing Plan</h3>`;

        const renderRoles = (title: string, roles: ProcessedRoleResourcing[]) => {
            if (!roles || roles.length === 0) return `<p>No ${title.toLowerCase()} defined.</p>`;
            let roleHtml = `<h4>${title}</h4>
                            <table><thead><tr><th>Role</th><th>Quantity</th><th>FTE %</th></tr></thead><tbody>`;
            roles.forEach(role => {
                roleHtml += `<tr><td>${role.roleName}</td><td>${role.quantity}</td><td>${role.fte}%</td></tr>`;
            });
            roleHtml += `</tbody></table>`;
            return roleHtml;
        };

        html += renderRoles('Standard Roles', step10Data.roles?.filter(r => (r as any).isSelected !== false)); // Filter for selected if isSelected is present
        html += renderRoles('Custom Roles', step10Data.customRoles);
        html += `<p><strong>Team Location Preference:</strong> ${step10Data.teamLocationPreferenceName || 'N/A'}</p>`;
        return html;
    }


    public async generatePdf(templateData: {
        executiveSummary?: string,
        introduction?: string,
        technicalSolution?: string,
        ganttPhases?: GanttPhase[],
        costEstimation?: CostEstimationOutput,
        step10?: ProcessedWizardData['step10'] // For resourcing
        // Add other rendered sections as needed
    }): Promise<Buffer> {
        this.logger.log('Starting PDF generation with Puppeteer...');

        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Software Development Proposal</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                    h1, h2, h3, h4 { color: #2c3e50; }
                    h1 { text-align: center; margin-bottom: 30px; }
                    h2 { border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-top: 30px; }
                    h3 { margin-top: 20px; color: #3498db; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .section { margin-bottom: 30px; page-break-inside: avoid; }
                    ul { padding-left: 20px; }
                    li { margin-bottom: 5px; }
                    footer {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        text-align: center;
                        font-size: 0.8em;
                        color: #777;
                        border-top: 1px solid #eee;
                        padding-top: 5px;
                    }
                    /* Page numbers will be handled by Puppeteer's displayHeaderFooter */
                    @page { margin: 1in; } /* Default margin */
                </style>
            </head>
            <body>
                <h1>Software Development Proposal</h1>

                ${this.markdownToHtml('Executive Summary', templateData.executiveSummary)}
                ${this.markdownToHtml('Introduction & Understanding', templateData.introduction)}
                ${this.markdownToHtml('Proposed Technical Solution', templateData.technicalSolution)}

                <section class="section">
                    ${this.generateGanttHtml(templateData.ganttPhases || [])}
                </section>

                <section class="section">
                    ${this.generateResourcingHtml(templateData.step10)}
                </section>

                <section class="section">
                    ${this.generateCostingHtml(templateData.costEstimation)}
                </section>

                <!-- Add more sections as needed -->

            </body>
            </html>
        `;

        let browser;
        try {
            // Launch Puppeteer.
            // In some environments (like Docker), you might need: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
            browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();

            await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

            const pdfOptions: PDFOptions = {
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '1in',
                    right: '1in',
                    bottom: '1in',
                    left: '1in'
                },
                displayHeaderFooter: true,
                headerTemplate: `<div style="font-size:9px; margin-left:1in; margin-right:1in; width:calc(100% - 2in); text-align:center;">Software Proposal</div>`, // Empty header
                footerTemplate: `
                    <div style="font-size:9px; margin-left:1in; margin-right:1in; width:calc(100% - 2in); text-align:center;">
                        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                    </div>`,
            };

            const pdfBuffer = await page.pdf(pdfOptions);
            this.logger.log('PDF generated successfully.');
            return pdfBuffer;
        } catch (error) {
            this.logger.error('Error generating PDF with Puppeteer:', error.stack);
            throw new InternalServerErrorException('Failed to generate PDF document.');
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}
