import { Module } from '@nestjs/common';
// Module → NestJS decorator used to define a module

import { TypeOrmModule } from '@nestjs/typeorm';
// TypeOrmModule → integrates TypeORM repositories with NestJS

import { Movie } from './entities/movie.entity';
// Movie entity representing the movies table

import { MovieService } from './movie.service';
// Service containing business logic for movies

import { MovieResolver } from './movie.resolver';
// GraphQL resolver handling movie-related queries and mutations

import { Review } from '../review/entities/review.entity';
// Review entity used for rating and review aggregation logic

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Review])],
  // Registers Movie and Review repositories for dependency injection

  providers: [MovieService, MovieResolver],
  // Makes MovieService and MovieResolver available within this module

  exports: [MovieService],
  // Exports MovieService so other modules can reuse it
})
export class MovieModule { }
// Defines the Movie module of the application
