import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './activity.entity/activity.entity';
import { Profile } from '../profile/profile.entity/profile.entity';

describe('ActivityController', () => {
  let controller: ActivityController;

  const mockActivityService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
      ],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createActivity', () => {
    it('should create a new activity with default timestamp', async () => {
      const dto: CreateActivityDto = {
        handle: 'testuser',
        type: 'TWEET',
      };

      const mockProfile = new Profile();
      mockProfile.handle = 'testuser';

      const mockActivity = new Activity();
      mockActivity.type = 'TWEET';
      mockActivity.profile = mockProfile;
      mockActivity.timestamp = new Date();

      mockActivityService.create.mockResolvedValue(mockActivity);

      const result = await controller.createActivity(dto);

      expect(result).toBe(mockActivity);
      expect(mockActivityService.create).toHaveBeenCalledWith(dto);
      expect(result.type).toBe('TWEET');
      expect(result.profile.handle).toBe('testuser');
    });

    it('should create a new activity with custom timestamp', async () => {
      const customDate = new Date('2024-01-01T00:00:00Z');
      const dto: CreateActivityDto = {
        handle: 'testuser',
        type: 'RETWEET',
        timestamp: customDate,
      };

      const mockProfile = new Profile();
      mockProfile.handle = 'testuser';

      const mockActivity = new Activity();
      mockActivity.type = 'RETWEET';
      mockActivity.profile = mockProfile;
      mockActivity.timestamp = customDate;

      mockActivityService.create.mockResolvedValue(mockActivity);

      const result = await controller.createActivity(dto);

      expect(result).toBe(mockActivity);
      expect(mockActivityService.create).toHaveBeenCalledWith(dto);
      expect(result.type).toBe('RETWEET');
      expect(result.timestamp).toEqual(customDate);
    });

    it('should create a new activity with REPLY type', async () => {
      const dto: CreateActivityDto = {
        handle: 'testuser',
        type: 'REPLY',
      };

      const mockProfile = new Profile();
      mockProfile.handle = 'testuser';

      const mockActivity = new Activity();
      mockActivity.type = 'REPLY';
      mockActivity.profile = mockProfile;
      mockActivity.timestamp = new Date();

      mockActivityService.create.mockResolvedValue(mockActivity);

      const result = await controller.createActivity(dto);

      expect(result).toBe(mockActivity);
      expect(mockActivityService.create).toHaveBeenCalledWith(dto);
      expect(result.type).toBe('REPLY');
    });

    it('should handle service errors gracefully', async () => {
      const dto: CreateActivityDto = {
        handle: 'testuser',
        type: 'TWEET',
      };

      mockActivityService.create.mockRejectedValue(new Error('Service error'));

      await expect(controller.createActivity(dto)).rejects.toThrow(
        'Service error',
      );
      expect(mockActivityService.create).toHaveBeenCalledWith(dto);
    });
  });
});
