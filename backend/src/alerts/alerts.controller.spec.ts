import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

describe('AlertsController', () => {
  let controller: AlertsController;

  const mockAlertsService = {
    getInactiveProfiles: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [
        {
          provide: AlertsService,
          useValue: mockAlertsService,
        },
      ],
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInactiveProfiles', () => {
    it('should return empty array when no inactive profiles exist', async () => {
      mockAlertsService.getInactiveProfiles.mockResolvedValue([]);

      const result = await controller.getInactiveProfiles();

      expect(result).toEqual([]);
      expect(mockAlertsService.getInactiveProfiles).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should return inactive profiles with their last activity', async () => {
      const oldDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      const inactiveProfiles = [
        { handle: 'user1', lastActivity: oldDate },
        { handle: 'user2', lastActivity: null },
      ];

      mockAlertsService.getInactiveProfiles.mockResolvedValue(inactiveProfiles);

      const result = await controller.getInactiveProfiles();

      expect(result).toEqual(inactiveProfiles);
      expect(mockAlertsService.getInactiveProfiles).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should handle service errors gracefully', async () => {
      mockAlertsService.getInactiveProfiles.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.getInactiveProfiles()).rejects.toThrow(
        'Service error',
      );
      expect(mockAlertsService.getInactiveProfiles).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should pass threshold parameter to service when provided', async () => {
      const threshold = 60;
      const oldDate = new Date(Date.now() - 45 * 60 * 1000); // 45 minutes ago
      const inactiveProfiles = [{ handle: 'user1', lastActivity: oldDate }];

      mockAlertsService.getInactiveProfiles.mockResolvedValue(inactiveProfiles);

      const result = await controller.getInactiveProfiles(threshold);

      expect(result).toEqual(inactiveProfiles);
      expect(mockAlertsService.getInactiveProfiles).toHaveBeenCalledWith(
        threshold,
      );
    });
  });
});
