import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalDraft } from './proposal-draft.entity';
// import { ProposalDraftService } from './proposal-draft.service'; // For future use
// import { ProposalDraftController } from './proposal-draft.controller'; // For future use

@Module({
  imports: [TypeOrmModule.forFeature([ProposalDraft])],
  // controllers: [ProposalDraftController], // For future use
  // providers: [ProposalDraftService], // For future use
  // exports: [ProposalDraftService], // If other modules need ProposalDraftService
})
export class ProposalDraftModule {}
