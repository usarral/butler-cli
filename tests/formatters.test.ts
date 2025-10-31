import { describe, it, expect } from 'vitest';
import { formatters, TableBuilder } from '../src/utils/formatters';
import chalk from 'chalk';

describe('Formatters', () => {
  describe('Basic Formatters', () => {
    it('should format success messages in green', () => {
      const message = formatters.success('Operation completed');
      expect(message).toContain('Operation completed');
      expect(message).toBe(chalk.green('Operation completed'));
    });

    it('should format error messages in red', () => {
      const message = formatters.error('Something failed');
      expect(message).toContain('Something failed');
      expect(message).toBe(chalk.red('Something failed'));
    });

    it('should format warning messages in yellow', () => {
      const message = formatters.warning('Be careful');
      expect(message).toBe(chalk.yellow('Be careful'));
    });

    it('should format info messages in cyan', () => {
      const message = formatters.info('Information');
      expect(message).toBe(chalk.cyan('Information'));
    });

    it('should format highlighted text', () => {
      const message = formatters.highlight('Important');
      expect(message).toBe(chalk.bold.cyan('Important'));
    });

    it('should format secondary text in gray', () => {
      const message = formatters.secondary('Less important');
      expect(message).toBe(chalk.gray('Less important'));
    });

    it('should format bold text', () => {
      const message = formatters.bold('Bold text');
      expect(message).toBe(chalk.bold('Bold text'));
    });

    it('should format dim text', () => {
      const message = formatters.dim('Dimmed');
      expect(message).toBe(chalk.gray('Dimmed'));
    });
  });

  describe('Specialized Formatters', () => {
    it('should format URLs with underline', () => {
      const url = formatters.url('https://jenkins.example.com');
      expect(url).toBe(chalk.underline.cyan('https://jenkins.example.com'));
    });

    it('should format job names in cyan', () => {
      const jobName = formatters.jobName('my-job');
      expect(jobName).toBe(chalk.cyan('my-job'));
    });

    it('should format build numbers with hash', () => {
      const buildNum = formatters.buildNumber(42);
      expect(buildNum).toContain('#42');
      expect(buildNum).toBe(chalk.yellow('#42'));
    });

    it('should format build numbers from strings', () => {
      const buildNum = formatters.buildNumber('15');
      expect(buildNum).toContain('#15');
    });
  });

  describe('Duration Formatter', () => {
    it('should format milliseconds to readable duration', () => {
      expect(formatters.duration(1500)).toBe('1s');
      expect(formatters.duration(65000)).toBe('1m 5s');
      expect(formatters.duration(3665000)).toBe('1h 1m 5s');
    });

    it('should handle zero duration', () => {
      expect(formatters.duration(0)).toBe('0s');
    });

    it('should handle large durations', () => {
      const duration = formatters.duration(7265000); // 2h 1m 5s
      expect(duration).toContain('h');
      expect(duration).toContain('m');
      expect(duration).toContain('s');
    });
  });

  describe('Timestamp Formatter', () => {
    it('should format timestamp to readable date', () => {
      const timestamp = new Date('2025-10-31T10:30:00').getTime();
      const formatted = formatters.timestamp(timestamp);
      
      expect(formatted).toContain('2025');
      expect(formatted).toContain('10');
      expect(formatted).toContain('31');
    });
  });

  describe('Field Formatter', () => {
    it('should format field with value', () => {
      const field = formatters.field('Status', 'Active');
      expect(field).toContain('Status');
      expect(field).toContain('Active');
    });

    it('should show empty text for undefined values', () => {
      const field = formatters.field('Description', undefined);
      expect(field).toContain('Description');
      expect(field).toContain('-');
    });

    it('should use custom empty text', () => {
      const field = formatters.field('Optional', undefined, 'N/A');
      expect(field).toContain('N/A');
    });
  });

  describe('Separator Formatter', () => {
    it('should create separator with default character', () => {
      const separator = formatters.separator();
      expect(separator.length).toBe(80);
      expect(separator).toContain('━');
    });

    it('should create separator with custom character', () => {
      const separator = formatters.separator('=');
      expect(separator).toContain('=');
      expect(separator.length).toBe(80);
    });

    it('should create separator with custom length', () => {
      const separator = formatters.separator('-', 40);
      expect(separator.length).toBe(40);
    });
  });

  describe('Status Formatter', () => {
    it('should format SUCCESS status', () => {
      const status = formatters.buildStatus('SUCCESS');
      expect(status).toContain('SUCCESS');
      expect(status).toBe(chalk.green('✓ SUCCESS'));
    });

    it('should format FAILURE status', () => {
      const status = formatters.buildStatus('FAILURE');
      expect(status).toContain('FAILURE');
      expect(status).toBe(chalk.red('✗ FAILURE'));
    });

    it('should format UNSTABLE status', () => {
      const status = formatters.buildStatus('UNSTABLE');
      expect(status).toContain('UNSTABLE');
      expect(status).toBe(chalk.yellow('⚠ UNSTABLE'));
    });

    it('should format ABORTED status', () => {
      const status = formatters.buildStatus('ABORTED');
      expect(status).toContain('ABORTED');
      expect(status).toBe(chalk.gray('⊗ ABORTED'));
    });

    it('should format unknown status', () => {
      const status = formatters.buildStatus('UNKNOWN');
      expect(status).toContain('UNKNOWN');
      expect(status).toBe(chalk.gray('? UNKNOWN'));
    });
  });
});

describe('TableBuilder', () => {
  it('should build a simple table', () => {
    const table = new TableBuilder();
    table.add('Name', 'Test Job');
    table.add('Status', 'Active');

    const output = table.build();

    expect(output).toContain('Name');
    expect(output).toContain('Test Job');
    expect(output).toContain('Status');
    expect(output).toContain('Active');
  });

  it('should show empty text for undefined values', () => {
    const table = new TableBuilder();
    table.add('Description', undefined, 'No description');

    const output = table.build();

    expect(output).toContain('No description');
  });

  it('should support method chaining', () => {
    const table = new TableBuilder();
    const result = table
      .add('Field 1', 'Value 1')
      .add('Field 2', 'Value 2')
      .add('Field 3', 'Value 3');

    expect(result).toBe(table);
    const output = table.build();
    
    expect(output).toContain('Field 1');
    expect(output).toContain('Field 2');
    expect(output).toContain('Field 3');
  });

  it('should handle multiple rows', () => {
    const table = new TableBuilder();
    table.add('Name', 'Job 1');
    table.add('URL', 'http://jenkins.com/job1');
    table.add('Status', 'SUCCESS');

    const output = table.build();
    const lines = output.split('\n').filter(line => line.trim());

    expect(lines.length).toBe(3); // Exactamente 3 líneas
  });
});
