import { Injectable } from '@nestjs/common';
// Injectable → allows this service to be injected via NestJS dependency injection

@Injectable()
export class AppService {
  // Root application service

  getHello(): string {
    // Simple method returning a static greeting
    return 'Hello World!';
  }
}
