import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity/activity.entity';
import { Profile } from '../profile/profile.entity/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Profile])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
