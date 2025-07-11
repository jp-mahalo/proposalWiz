import { Type } from 'class-transformer';
import {
  IsString, IsOptional, IsArray, ValidateNested, IsIn, IsBoolean, IsNumber, IsObject, Allow
} from 'class-validator';

// Based on frontend/src/context/WizardContext.tsx

export class Step1FormDataDto {
  @IsOptional()
  @IsIn(['web', 'mobile', 'both'])
  applicationType?: 'web' | 'mobile' | 'both';

  @IsOptional()
  @IsArray()
  @IsIn(['ios', 'android'], { each: true })
  mobilePlatforms?: ('ios' | 'android')[];
}

export class Step2FormDataDto {
  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  otherIndustry?: string;
}

export class Step3FormDataDto {
  @IsOptional()
  @IsObject() // More specific validation can be added if keys are known and fixed
  // For now, allowing any object structure for selectedModules
  @Allow()
  selectedModules?: { [mainModuleId: string]: string[] };

  @IsOptional()
  @IsString()
  otherModulesText?: string;
}

export class Step4FormDataDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedIntegrations?: string[];

  @IsOptional()
  @IsString()
  otherIntegrationsText?: string;
}

export class Step5FormDataDto {
  @IsOptional()
  @IsString()
  deploymentEnvironment?: string;

  @IsOptional()
  @IsString()
  preferredRegion?: string;
}

export class PhaseDurationDataDto {
    [phaseId: string]: string;
}
export class Step6FormDataDto {
  @IsOptional()
  @IsString() // Consider IsDateString if format is fixed
  projectStartDate?: string;

  @IsOptional()
  @IsString() // Consider IsDateString
  projectCompletionDate?: string;

  @IsOptional()
  @IsObject()
  @Type(() => PhaseDurationDataDto) // Not strictly needed if it's just Record<string, string>
  // For now, allowing any object structure for phaseDurations
  @Allow()
  phaseDurations?: { [phaseId: string]: string };
}

export class Step7FormDataDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetRegions?: string[];

  @IsOptional()
  @IsString()
  europeCountries?: string;

  @IsOptional()
  @IsString()
  africaCountries?: string;

  @IsOptional()
  @IsBoolean()
  multiLanguageSupport?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedLanguages?: string[];

  @IsOptional()
  @IsString()
  otherLanguage?: string;

  @IsOptional()
  @IsBoolean()
  currencyLocalization?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedCurrencies?: string[];

  @IsOptional()
  @IsString()
  otherCurrency?: string;

  @IsOptional()
  @IsBoolean()
  timezoneSupport?: boolean;
}

export class Step8FormDataDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedComplianceOptions?: string[];

  @IsOptional()
  @IsString()
  otherComplianceText?: string;
}

export class Step9FormDataDto {
  @IsOptional()
  @IsString()
  pricingModel?: string;

  @IsOptional()
  @IsString()
  projectComplexity?: string;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  otherPaymentTerms?: string;

  @IsOptional()
  @IsString()
  proposalCurrency?: string;

  @IsOptional()
  @IsString()
  preferredBudgetRange?: string;

  @IsOptional()
  @IsBoolean()
  ongoingMaintenance?: boolean;

  @IsOptional()
  @IsString()
  supportLevel?: string;

  @IsOptional()
  @IsString()
  supportDuration?: string;
}

export class RoleResourcingDto {
  @IsString()
  roleId: string;

  @IsOptional()
  @IsString()
  roleName?: string;

  @IsNumber()
  @Type(() => Number) // Ensure transformation from string if necessary
  quantity: number | string;

  @IsNumber()
  @Type(() => Number) // Ensure transformation
  fte: number | string;

  @IsOptional()
  @IsBoolean()
  isSelected?: boolean;
}
export class Step10FormDataDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleResourcingDto)
  roles?: RoleResourcingDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleResourcingDto)
  customRoles?: RoleResourcingDto[];

  @IsOptional()
  @IsString()
  teamLocationPreference?: string;
}


// Main DTO that aggregates all step data
export class WizardFormDataDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Step1FormDataDto)
  step1?: Step1FormDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Step2FormDataDto)
  step2?: Step2FormDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Step3FormDataDto)
  step3?: Step3FormDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Step4FormDataDto)
  step4?: Step4FormDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Step5FormDataDto)
  step5?: Step5FormDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Step6FormDataDto)
  step6?: Step6FormDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Step7FormDataDto)
  step7?: Step7FormDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Step8FormDataDto)
  step8?: Step8FormDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Step9FormDataDto)
  step9?: Step9FormDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Step10FormDataDto)
  step10?: Step10FormDataDto;
}
