import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { Profile } from '../profile/profile.entity/profile.entity';
import { Activity } from '../activity/activity.entity/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Activity])],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
