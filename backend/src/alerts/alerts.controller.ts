import { Controller, Get, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async getInactiveProfiles(@Query('threshold') threshold?: number) {
    return this.alertsService.getInactiveProfiles(threshold);
  }
}
