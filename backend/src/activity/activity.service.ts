import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity/activity.entity';
import { Profile } from '../profile/profile.entity/profile.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(dto: CreateActivityDto): Promise<Activity> {
    let profile = await this.profileRepository.findOne({
      where: { handle: dto.handle },
    });

    if (!profile) {
      profile = this.profileRepository.create({ handle: dto.handle });
      profile = await this.profileRepository.save(profile);
    }

    const activity = this.activityRepository.create({
      type: dto.type,
      timestamp: dto.timestamp || new Date(),
      profile,
    });

    return this.activityRepository.save(activity);
  }
}
