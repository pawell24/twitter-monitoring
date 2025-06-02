import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { AlertsService } from '../alerts/alerts.service';

describe('TasksService', () => {
  let service: TasksService;

  const mockAlertsService = {
    getInactiveProfiles: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: AlertsService,
          useValue: mockAlertsService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleInactiveProfilesCheck', () => {
    it('should log when no inactive profiles are found', async () => {
      mockAlertsService.getInactiveProfiles.mockResolvedValue([]);
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      await service.handleInactiveProfilesCheck();

      expect(mockAlertsService.getInactiveProfiles).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Inactive profiles (0):');
    });

    it('should log inactive profiles with their last activity', async () => {
      const mockInactiveProfiles = [
        {
          handle: 'user1',
          lastActivity: new Date('2025-05-01T00:00:00Z'),
        },
        {
          handle: 'user2',
          lastActivity: null,
        },
      ];

      mockAlertsService.getInactiveProfiles.mockResolvedValue(
        mockInactiveProfiles,
      );
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      await service.handleInactiveProfilesCheck();

      expect(mockAlertsService.getInactiveProfiles).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Inactive profiles (2):');
      expect(loggerSpy).toHaveBeenCalledWith(
        '- user1 (last: 2025-05-01T00:00:00.000Z)',
      );
      expect(loggerSpy).toHaveBeenCalledWith('- user2 (last: never)');
    });

    it('should handle service errors gracefully', async () => {
      mockAlertsService.getInactiveProfiles.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(service.handleInactiveProfilesCheck()).rejects.toThrow(
        'Service error',
      );
    });
  });
});
