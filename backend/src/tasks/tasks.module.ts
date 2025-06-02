import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [ScheduleModule.forRoot(), AlertsModule],
  providers: [TasksService],
})
export class TasksModule {}
