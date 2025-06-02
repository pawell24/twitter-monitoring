import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../profile/profile.entity/profile.entity';

describe('AlertsService', () => {
  let service: AlertsService;
  let mockGetMany: jest.Mock;

  const mockProfileRepository = {
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    mockGetMany = jest.fn();
    mockProfileRepository.createQueryBuilder = jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getMany: mockGetMany,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getInactiveProfiles', () => {
    it('should return empty array when no profiles exist', async () => {
      mockGetMany.mockResolvedValue([]);

      const result = await service.getInactiveProfiles();

      expect(result).toEqual([]);
    });

    it('should return profiles with no activities as inactive', async () => {
      const profiles = [
        {
          handle: 'user1',
          activities: [],
        },
        {
          handle: 'user2',
          activities: [],
        },
      ];

      mockGetMany.mockResolvedValue(profiles);

      const result = await service.getInactiveProfiles();

      expect(result).toEqual([
        { handle: 'user1', lastActivity: null },
        { handle: 'user2', lastActivity: null },
      ]);
    });

    it('should return profiles with old activities as inactive', async () => {
      const oldDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      const profiles = [
        {
          handle: 'user1',
          activities: [{ timestamp: oldDate }],
        },
      ];

      mockGetMany.mockResolvedValue(profiles);

      const result = await service.getInactiveProfiles(30); // 30 minutes threshold

      expect(result).toEqual([{ handle: 'user1', lastActivity: oldDate }]);
    });

    it('should not return profiles with recent activities', async () => {
      const recentDate = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
      const profiles = [
        {
          handle: 'user1',
          activities: [{ timestamp: recentDate }],
        },
      ];

      mockGetMany.mockResolvedValue(profiles);

      const result = await service.getInactiveProfiles(30); // 30 minutes threshold

      expect(result).toEqual([]);
    });

    it('should return only inactive profiles from mixed set', async () => {
      const oldDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      const recentDate = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
      const profiles = [
        {
          handle: 'inactive_user',
          activities: [{ timestamp: oldDate }],
        },
        {
          handle: 'active_user',
          activities: [{ timestamp: recentDate }],
        },
        {
          handle: 'no_activity_user',
          activities: [],
        },
      ];

      mockGetMany.mockResolvedValue(profiles);

      const result = await service.getInactiveProfiles(30); // 30 minutes threshold

      expect(result).toEqual([
        { handle: 'inactive_user', lastActivity: oldDate },
        { handle: 'no_activity_user', lastActivity: null },
      ]);
    });

    it('should use the most recent activity when multiple exist', async () => {
      const oldDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      const recentDate = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
      const profiles = [
        {
          handle: 'user1',
          activities: [{ timestamp: oldDate }, { timestamp: recentDate }],
        },
      ];

      mockGetMany.mockResolvedValue(profiles);

      const result = await service.getInactiveProfiles(30); // 30 minutes threshold

      expect(result).toEqual([]); // Should not be inactive because of recent activity
    });

    it('should handle custom threshold values', async () => {
      const oldDate = new Date(Date.now() - 45 * 60 * 1000); // 45 minutes ago
      const profiles = [
        {
          handle: 'user1',
          activities: [{ timestamp: oldDate }],
        },
      ];

      mockGetMany.mockResolvedValue(profiles);

      const result = await service.getInactiveProfiles(60); // 60 minutes threshold

      expect(result).toEqual([]); // Should not be inactive with 60-minute threshold
    });
  });
});
