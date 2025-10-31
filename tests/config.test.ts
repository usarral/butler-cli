import { describe, it, expect, beforeEach, vi } from 'vitest';
import { existsSync, readFileSync, writeFileSync, readdirSync, unlinkSync, mkdirSync } from 'node:fs';
import { configManager } from '../src/utils/config';

vi.mock('node:fs');

describe('Config Manager', () => {
  const mockConfigDir = '/mock/config/dir';

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock del directorio de configuración
    vi.spyOn(configManager, 'getConfigDir').mockReturnValue(mockConfigDir);
  });

  describe('saveConfig', () => {
    it('should save a valid configuration', () => {
      const config = {
        name: 'production',
        url: 'https://jenkins.example.com',
        username: 'admin',
        token: 'secret-token',
        description: 'Production Jenkins',
      };

      vi.mocked(existsSync).mockReturnValue(false);
      vi.mocked(mkdirSync).mockReturnValue(undefined);
      vi.mocked(writeFileSync).mockReturnValue(undefined);

      configManager.saveConfig(config);

      expect(writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('production.json'),
        expect.stringContaining(config.url),
        'utf8'
      );
    });

    it('should create config directory if it does not exist', () => {
      const config = {
        name: 'test',
        url: 'http://localhost:8080',
        username: 'admin',
        token: 'token',
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(writeFileSync).mockReturnValue(undefined);

      configManager.saveConfig(config);

      expect(writeFileSync).toHaveBeenCalled();
    });
  });

  describe('loadConfig', () => {
    it('should load existing configuration', () => {
      const mockConfig = {
        name: 'staging',
        url: 'https://staging.jenkins.com',
        username: 'user',
        token: 'token123',
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockConfig));

      const config = configManager.loadConfig('staging');

      expect(config).toEqual(mockConfig);
    });

    it('should return null if config file does not exist', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const config = configManager.loadConfig('nonexistent');

      expect(config).toBeNull();
    });

    it('should handle invalid JSON gracefully', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue('invalid json{');

      const config = configManager.loadConfig('corrupted');

      expect(config).toBeNull();
    });
  });

  describe('listConfigs', () => {
    it('should list all configuration files', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readdirSync).mockReturnValue([
        'production.json',
        'staging.json',
        'development.json',
        '.current',
        'README.md',
      ] as any);

      const configs = configManager.listConfigs();

      expect(configs).toEqual(['production', 'staging', 'development']);
      expect(configs).not.toContain('.current');
      expect(configs).not.toContain('README');
    });

    it('should return empty array if config directory does not exist', () => {
      vi.mocked(readdirSync).mockImplementation(() => {
        throw new Error('Directory does not exist');
      });

      const configs = configManager.listConfigs();

      expect(configs).toEqual([]);
    });
  });

  describe('deleteConfig', () => {
    it('should delete existing configuration', () => {
      vi.mocked(existsSync).mockReturnValueOnce(true); // config file exists
      vi.mocked(unlinkSync).mockReturnValue(undefined);
      vi.mocked(readFileSync).mockReturnValue('production'); // current config

      const result = configManager.deleteConfig('staging');

      expect(result).toBe(true);
      expect(unlinkSync).toHaveBeenCalled();
    });

    it('should return false if config does not exist', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = configManager.deleteConfig('nonexistent');

      expect(result).toBe(false);
    });

    it('should clear current config if deleting active config', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(unlinkSync).mockReturnValue(undefined);
      vi.mocked(readFileSync).mockReturnValue('production');

      configManager.deleteConfig('production');

      expect(unlinkSync).toHaveBeenCalled();
    });
  });

  describe('getCurrentConfig', () => {
    it('should return current config name', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue('production');

      const current = configManager.getCurrentConfig();

      expect(current).toBe('production');
    });

    it('should return null if no current config is set', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const current = configManager.getCurrentConfig();

      expect(current).toBeNull();
    });

    it('should handle empty current config file', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue('  ');

      const current = configManager.getCurrentConfig();

      expect(current).toBeNull();
    });
  });

  describe('setCurrentConfig', () => {
    it('should set current configuration', () => {
      const mockConfig = {
        name: 'production',
        url: 'https://jenkins.com',
        username: 'admin',
        token: 'token',
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockConfig));
      vi.mocked(writeFileSync).mockReturnValue(undefined);

      const result = configManager.setCurrentConfig('production');

      expect(result).toBe(true);
      expect(writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('current-config.txt'),
        'production',
        'utf8'
      );
    });

    it('should return false if config does not exist', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = configManager.setCurrentConfig('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('getActiveConfig', () => {
    it('should return active configuration object', () => {
      const mockConfig = {
        name: 'staging',
        url: 'https://staging.jenkins.com',
        username: 'user',
        token: 'token123',
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync)
        .mockReturnValueOnce('staging') // getCurrentConfig
        .mockReturnValueOnce(JSON.stringify(mockConfig)); // loadConfig

      const activeConfig = configManager.getActiveConfig();

      expect(activeConfig).toEqual(mockConfig);
    });

    it('should return null if no active config is set', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const activeConfig = configManager.getActiveConfig();

      expect(activeConfig).toBeNull();
    });
  });
});
