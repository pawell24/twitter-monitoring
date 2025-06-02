import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;

  const mockProfileService = {
    getAllWithStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfiles', () => {
    it('should return empty array when no profiles exist', async () => {
      mockProfileService.getAllWithStats.mockResolvedValue([]);

      const result = await controller.getProfiles();

      expect(result).toEqual([]);
      expect(mockProfileService.getAllWithStats).toHaveBeenCalled();
    });

    it('should return profiles with their stats', async () => {
      const profiles = [
        {
          handle: 'user1',
          activityCount: 2,
          lastActivity: new Date('2024-01-01T00:00:00Z'),
        },
        {
          handle: 'user2',
          activityCount: 0,
          lastActivity: null,
        },
      ];

      mockProfileService.getAllWithStats.mockResolvedValue(profiles);

      const result = await controller.getProfiles();

      expect(result).toEqual(profiles);
      expect(mockProfileService.getAllWithStats).toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      mockProfileService.getAllWithStats.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.getProfiles()).rejects.toThrow('Service error');
      expect(mockProfileService.getAllWithStats).toHaveBeenCalled();
    });

    it('should return profiles sorted by last activity', async () => {
      const oldDate = new Date('2024-01-01T00:00:00Z');
      const recentDate = new Date('2024-01-02T00:00:00Z');
      const profiles = [
        {
          handle: 'old_user',
          activityCount: 1,
          lastActivity: oldDate,
        },
        {
          handle: 'recent_user',
          activityCount: 1,
          lastActivity: recentDate,
        },
      ];

      mockProfileService.getAllWithStats.mockResolvedValue(profiles);

      const result = await controller.getProfiles();

      expect(result).toEqual(profiles);
      expect(mockProfileService.getAllWithStats).toHaveBeenCalled();
    });
  });
});
