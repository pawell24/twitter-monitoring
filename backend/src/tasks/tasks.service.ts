import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly alertsService: AlertsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleInactiveProfilesCheck() {
    const inactive = await this.alertsService.getInactiveProfiles();
    this.logger.log(`Inactive profiles (${inactive.length}):`);
    inactive.forEach((profile) =>
      this.logger.log(
        `- ${profile.handle} (last: ${profile.lastActivity?.toISOString() ?? 'never'})`,
      ),
    );
  }
}
