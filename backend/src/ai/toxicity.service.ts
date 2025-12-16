import { Injectable, InternalServerErrorException } from '@nestjs/common';
// Injectable → allows this service to be injected via NestJS DI
// InternalServerErrorException → used to throw a 500 error if AI processing fails

import { execFile } from 'child_process';
// execFile → runs an external executable (Python script in this case)

import { promisify } from 'util';
// promisify → converts callback-based functions into Promise-based ones

import * as path from 'path';
// path → used to safely build file paths across OSes

const execFileAsync = promisify(execFile);
// Converts execFile into an async/await-friendly function

@Injectable()
export class ToxicityService {

  // Windows Python launcher command
  private pythonCmd = 'py';
  // Specifies the Python launcher (Windows-specific)

  private pythonVersion = '-3.10';
  // Forces execution with Python 3.10

  private scriptPath = path.join(
    process.cwd(),
    'predict.py'
  );
  // Builds an absolute path to predict.py located at the project root

  async analyze(text: string): Promise<{ toxic: number; non_toxic: number }> {
    // Runs the Python AI model and returns toxicity probabilities

    try {
      const { stdout } = await execFileAsync(
        this.pythonCmd,
        [this.pythonVersion, this.scriptPath, text],
        {
          timeout: 30000,          // Maximum execution time (30 seconds)
          maxBuffer: 1024 * 1024,  // Maximum stdout buffer size (1 MB)
          windowsHide: true,       // Prevents spawning a visible console window on Windows
        }
      );

      if (!stdout) {
        // Ensures the AI script returned output
        throw new Error('Empty AI response');
      }

      // Parses the JSON output returned by the Python script
      return JSON.parse(stdout.trim());

    } catch (err) {
      // Logs the original error for debugging
      console.error('Toxicity AI error:', err);

      // Throws a NestJS 500 error to the client
      throw new InternalServerErrorException('Toxicity analysis failed');
    }
  }

  async isToxic(text: string): Promise<boolean> {
    // Helper method that returns a boolean toxicity verdict

    const result = await this.analyze(text);
    // Calls analyze() to get toxicity scores

    return result.toxic >= 0.5;
    // Considers text toxic if probability is 50% or higher
  }
}
