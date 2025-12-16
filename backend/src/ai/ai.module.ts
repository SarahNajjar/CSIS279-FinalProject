import { Module } from '@nestjs/common';
// Imports the NestJS @Module decorator, which is used to define a module

import { ToxicityService } from './toxicity.service';
// Imports the ToxicityService that contains AI toxicity detection logic

@Module({
  providers: [ToxicityService],
  // Registers ToxicityService as a provider so it can be injected via NestJS DI

  exports: [ToxicityService],
  // Exports ToxicityService so other modules (e.g. ReviewModule / ReviewService)
  // can inject and use it without redefining the provider
})
export class AiModule { }
// Defines the AiModule, responsible for exposing AI-related services
