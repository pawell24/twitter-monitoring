import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../profile/profile.entity/profile.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getInactiveProfiles(
    thresholdMinutes = 30,
  ): Promise<{ handle: string; lastActivity: Date | null }[]> {
    const cutoff = new Date(Date.now() - thresholdMinutes * 60 * 1000);

    const profiles = await this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.activities', 'activity')
      .getMany();

    return profiles
      .map((profile) => {
        const last = profile.activities.reduce(
          (latest, curr) => (curr.timestamp > latest.timestamp ? curr : latest),
          profile.activities[0],
        );

        const lastActivity = last?.timestamp ?? null;
        const isInactive = !lastActivity || lastActivity < cutoff;

        return isInactive
          ? {
              handle: profile.handle,
              lastActivity,
            }
          : null;
      })
      .filter(
        (item): item is { handle: string; lastActivity: Date } => item !== null,
      );
  }
}
