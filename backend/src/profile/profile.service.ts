import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity/profile.entity';
import { Activity } from '../activity/activity.entity/activity.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getAllWithStats(): Promise<
    { handle: string; activityCount: number; lastActivity: Date | null }[]
  > {
    const profiles = await this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.activities', 'activity')
      .getMany();

    return profiles.map((profile: Profile) => {
      const sorted = profile.activities.sort((a: Activity, b: Activity) =>
        a.timestamp < b.timestamp ? 1 : -1,
      );
      return {
        handle: profile.handle,
        activityCount: profile.activities.length,
        lastActivity: sorted[0]?.timestamp ?? null,
      };
    });
  }
}
