import { Test, TestingModule } from '@nestjs/testing';
// Test → provides NestJS testing utilities
// TestingModule → represents a compiled testing module

import { AppController } from './app.controller';
// Controller being tested

import { AppService } from './app.service';
// Service dependency used by the controller

describe('AppController', () => {
  // Test suite for AppController

  let appController: AppController;
  // Variable to hold an instance of AppController

  beforeEach(async () => {
    // Runs before each test case

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      // Registers AppController in the testing module

      providers: [AppService],
      // Registers AppService as a provider dependency
    }).compile();
    // Compiles the testing module

    appController = app.get<AppController>(AppController);
    // Retrieves an instance of AppController from the testing module
  });

  describe('root', () => {
    // Group of tests related to the root endpoint

    it('should return "Hello World!"', () => {
      // Test case verifying the expected response
      expect(appController.getHello()).toBe('Hello World!');
      // Calls getHello() and checks its return value
    });
  });
});
