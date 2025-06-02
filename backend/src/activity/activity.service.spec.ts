import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity } from './activity.entity/activity.entity';
import { Profile } from '../profile/profile.entity/profile.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

describe('ActivityService', () => {
  let service: ActivityService;

  const mockActivityRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProfileRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getRepositoryToken(Activity),
          useValue: mockActivityRepository,
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new activity for an existing profile', async () => {
      const dto: CreateActivityDto = {
        handle: 'testuser',
        type: 'TWEET',
      };

      const existingProfile = new Profile();
      existingProfile.handle = 'testuser';

      const newActivity = new Activity();
      newActivity.type = 'TWEET';
      newActivity.profile = existingProfile;
      newActivity.timestamp = new Date();

      mockProfileRepository.findOne.mockResolvedValue(existingProfile);
      mockActivityRepository.create.mockReturnValue(newActivity);
      mockActivityRepository.save.mockResolvedValue(newActivity);

      const result = await service.create(dto);

      expect(result).toBe(newActivity);
      expect(mockProfileRepository.findOne).toHaveBeenCalledWith({
        where: { handle: 'testuser' },
      });
      expect(mockActivityRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'TWEET',
          profile: existingProfile,
        }),
      );
      expect(mockActivityRepository.save).toHaveBeenCalledWith(newActivity);
    });

    it('should create a new profile and activity if profile does not exist', async () => {
      const dto: CreateActivityDto = {
        handle: 'newuser',
        type: 'RETWEET',
      };

      const newProfile = new Profile();
      newProfile.handle = 'newuser';

      const newActivity = new Activity();
      newActivity.type = 'RETWEET';
      newActivity.profile = newProfile;
      newActivity.timestamp = new Date();

      mockProfileRepository.findOne.mockResolvedValue(null);
      mockProfileRepository.create.mockReturnValue(newProfile);
      mockProfileRepository.save.mockResolvedValue(newProfile);
      mockActivityRepository.create.mockReturnValue(newActivity);
      mockActivityRepository.save.mockResolvedValue(newActivity);

      const result = await service.create(dto);

      expect(result).toBe(newActivity);
      expect(mockProfileRepository.findOne).toHaveBeenCalledWith({
        where: { handle: 'newuser' },
      });
      expect(mockProfileRepository.create).toHaveBeenCalledWith({
        handle: 'newuser',
      });
      expect(mockProfileRepository.save).toHaveBeenCalledWith(newProfile);
      expect(mockActivityRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'RETWEET',
          profile: newProfile,
        }),
      );
      expect(mockActivityRepository.save).toHaveBeenCalledWith(newActivity);
    });

    it('should create activity with custom timestamp if provided', async () => {
      const customDate = new Date('2024-01-01T00:00:00Z');
      const dto: CreateActivityDto = {
        handle: 'testuser',
        type: 'REPLY',
        timestamp: customDate,
      };

      const existingProfile = new Profile();
      existingProfile.handle = 'testuser';

      const newActivity = new Activity();
      newActivity.type = 'REPLY';
      newActivity.profile = existingProfile;
      newActivity.timestamp = customDate;

      mockProfileRepository.findOne.mockResolvedValue(existingProfile);
      mockActivityRepository.create.mockReturnValue(newActivity);
      mockActivityRepository.save.mockResolvedValue(newActivity);

      const result = await service.create(dto);

      expect(result).toBe(newActivity);
      expect(mockActivityRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'REPLY',
          timestamp: customDate,
          profile: existingProfile,
        }),
      );
    });

    it('should handle repository errors gracefully', async () => {
      const dto: CreateActivityDto = {
        handle: 'testuser',
        type: 'TWEET',
      };

      mockProfileRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(dto)).rejects.toThrow('Database error');
    });
  });
});
