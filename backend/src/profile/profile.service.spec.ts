import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './profile.entity/profile.entity';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockProfileRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllWithStats', () => {
    it('should return empty array when no profiles exist', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.getAllWithStats();

      expect(result).toEqual([]);
      expect(mockProfileRepository.createQueryBuilder).toHaveBeenCalledWith(
        'profile',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'profile.activities',
        'activity',
      );
    });

    it('should return profiles with their stats', async () => {
      const mockProfiles = [
        {
          handle: 'user1',
          activities: [
            { timestamp: new Date('2025-05-01T00:00:00Z') },
            { timestamp: new Date('2025-05-02T00:00:00Z') },
          ],
        },
        {
          handle: 'user2',
          activities: [],
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(mockProfiles);

      const result = await service.getAllWithStats();

      expect(result).toEqual([
        {
          handle: 'user1',
          activityCount: 2,
          lastActivity: new Date('2025-05-02T00:00:00Z'),
        },
        {
          handle: 'user2',
          activityCount: 0,
          lastActivity: null,
        },
      ]);
    });

    it('should sort activities by timestamp in descending order', async () => {
      const mockProfiles = [
        {
          handle: 'user1',
          activities: [
            { timestamp: new Date('2025-05-01T00:00:00Z') },
            { timestamp: new Date('2025-05-03T00:00:00Z') },
            { timestamp: new Date('2025-05-02T00:00:00Z') },
          ],
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(mockProfiles);

      const result = await service.getAllWithStats();

      expect(result[0].lastActivity).toEqual(new Date('2025-05-03T00:00:00Z'));
    });

    it('should handle repository errors gracefully', async () => {
      mockQueryBuilder.getMany.mockRejectedValue(new Error('Repository error'));

      await expect(service.getAllWithStats()).rejects.toThrow(
        'Repository error',
      );
    });
  });
});
