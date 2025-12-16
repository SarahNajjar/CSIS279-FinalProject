import { Controller, Get } from '@nestjs/common';
// Controller → marks this class as a NestJS controller
// Get → maps HTTP GET requests to a handler method

import { AppService } from './app.service';
// Service that contains the business logic for this controller

@Controller()
export class AppController {
  // Root application controller

  constructor(private readonly appService: AppService) { }
  // Injects AppService via NestJS dependency injection

  @Get()
  getHello(): string {
    // Handles GET requests to the root path (/)
    return this.appService.getHello();
    // Delegates response logic to AppService
  }
}
