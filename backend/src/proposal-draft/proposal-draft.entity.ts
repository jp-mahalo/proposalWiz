import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'; // Import User entity
import { WizardFormDataDto } from '../wizard-data/dto/wizard-form-data.dto'; // To type the wizardData

@Entity('proposal_drafts')
export class ProposalDraft {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  draftName?: string; // Optional name for the draft

  @Column({ type: 'jsonb' }) // Using JSONB to store the entire wizard form data object
  wizardData: WizardFormDataDto; // Or 'any' if you don't want to tie it strictly to the DTO version

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Example relation: A draft belongs to a user
  @ManyToOne(() => User, /*user => user.drafts,*/ { nullable: true, onDelete: 'SET NULL' }) // Nullable if drafts can be anonymous
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
}
