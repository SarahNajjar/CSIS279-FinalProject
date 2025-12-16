import { Module } from '@nestjs/common';
// Module → NestJS decorator used to define a module

import { TypeOrmModule } from '@nestjs/typeorm';
// TypeOrmModule → integrates TypeORM repositories with NestJS

import { GenreService } from './genre.service';
// Service containing business logic for genres (CRUD operations)

import { GenreResolver } from './genre.resolver';
// GraphQL resolver handling genre-related queries and mutations

import { Genre } from './entities/genre.entity';
// Genre entity mapped to the database and GraphQL schema

@Module({
    imports: [TypeOrmModule.forFeature([Genre])],
    // Registers the Genre repository for dependency injection

    providers: [GenreService, GenreResolver],
    // Makes GenreService and GenreResolver available within this module

    exports: [GenreService],
    // Exports GenreService so other modules can reuse it
})
export class GenreModule { }
// Defines the Genre module of the application
