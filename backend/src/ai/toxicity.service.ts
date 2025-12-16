import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execFileAsync = promisify(execFile);

@Injectable()
export class ToxicityService {
  // Windows Python launcher
  private pythonCmd = 'py';
  private pythonVersion = '-3.10';

  private scriptPath = path.join(
    process.cwd(),
    'predict.py'
  );

  async analyze(text: string): Promise<{ toxic: number; non_toxic: number }> {
    try {
      const { stdout } = await execFileAsync(
        this.pythonCmd,
        [this.pythonVersion, this.scriptPath, text],
        {
          timeout: 30000,          // ✅ 30s (important)
          maxBuffer: 1024 * 1024,  // ✅ 1MB buffer (important)
          windowsHide: true,
        }
      );

      if (!stdout) {
        throw new Error('Empty AI response');
      }

      return JSON.parse(stdout.trim());
    } catch (err) {
      console.error('Toxicity AI error:', err);
      throw new InternalServerErrorException('Toxicity analysis failed');
    }
  }

  async isToxic(text: string): Promise<boolean> {
    const result = await this.analyze(text);
    return result.toxic >= 0.5;
  }
}
