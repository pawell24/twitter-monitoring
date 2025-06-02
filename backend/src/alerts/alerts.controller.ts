import { Controller, Get } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async getInactiveProfiles() {
    return this.alertsService.getInactiveProfiles();
  }
}
