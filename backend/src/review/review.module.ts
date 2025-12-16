import { Module } from '@nestjs/common';
// Module → NestJS decorator used to define a module

import { TypeOrmModule } from '@nestjs/typeorm';
// TypeOrmModule → integrates TypeORM repositories with NestJS

import { Review } from './entities/review.entity';
// Review entity representing the reviews table

import { ReviewService } from './review.service';
// Service containing business logic for reviews

import { ReviewResolver } from './review.resolver';
// GraphQL resolver handling review-related queries and mutations

// 🧠 AI module (exports ToxicityService)
import { AiModule } from '../ai/ai.module';
// Imports the AI module to access ToxicityService

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    // Registers the Review repository for dependency injection

    AiModule, // REQUIRED to inject ToxicityService into ReviewService
  ],
  providers: [ReviewService, ReviewResolver],
  // Makes ReviewService and ReviewResolver available within this module
})
export class ReviewModule { }
// Defines the Review module of the application
