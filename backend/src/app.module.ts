import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProposalModule } from './proposal/proposal.module';
import { WizardDataModule } from './wizard-data/wizard-data.module';
import { PdfModule } from './pdf/pdf.module'; // Assuming PdfModule was created in Task 18
import { TemplatesModule } from './templates/templates.module';
import { GanttModule } from './gantt/gantt.module';
import { CostingModule } from './costing/costing.module';
import { UserModule } from './user/user.module';
import { ProposalDraftModule } from './proposal-draft/proposal-draft.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app
      envFilePath: '.env', // Specify your .env file path if not in root
      // You can add validation schema for env variables here if needed
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', 'password'),
        database: configService.get<string>('DATABASE_NAME', 'proposal_generator'),
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Path to your entities
        autoLoadEntities: true, // Recommended for NestJS to automatically load entities
        synchronize: configService.get<string>('NODE_ENV', 'development') === 'development', // true for dev only, never for prod!
        logging: configService.get<string>('NODE_ENV', 'development') === 'development',
      }),
    }),
    ProposalModule,
    WizardDataModule,
    TemplatesModule,
    GanttModule,
    CostingModule,
    PdfModule,
    UserModule,
    ProposalDraftModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
