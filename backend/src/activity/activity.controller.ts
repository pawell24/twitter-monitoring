import { Controller, Post, Body } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  createActivity(@Body() dto: CreateActivityDto) {
    return this.activityService.create(dto);
  }
}
