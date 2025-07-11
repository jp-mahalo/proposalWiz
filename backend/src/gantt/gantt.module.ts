import { Module } from '@nestjs/common';
import { GanttChartService } from './gantt-chart.service';

@Module({
  providers: [GanttChartService],
  exports: [GanttChartService],
})
export class GanttModule {}
