import { Module } from '@nestjs/common';
// Module → NestJS decorator used to define the root application module

import { GraphQLModule } from '@nestjs/graphql';
// GraphQLModule → integrates GraphQL into the NestJS application

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// ApolloDriver → Apollo GraphQL server driver for NestJS

import { TypeOrmModule } from '@nestjs/typeorm';
// TypeOrmModule → integrates TypeORM (database ORM) with NestJS

import { join } from 'path';
// join → utility to safely build file paths

import { ServeStaticModule } from '@nestjs/serve-static';
// ServeStaticModule → serves static files (e.g., images, uploads)

// 🔥 MODULES
import { AuthModule } from './auth/auth.module';
// Authentication module (login, JWT, auth logic)

import { UserModule } from './user/user.module';
// User management module

import { MovieModule } from './movie/movie.module';
// Movie management module

import { GenreModule } from './genre/genre.module';
// Genre management module

import { ReviewModule } from './review/review.module';
// Review & rating module

import { WatchlistModule } from './watchlist/watchlist.module';
// Watchlist management module

// 🧠 AI TOXICITY MODULE
import { AiModule } from './ai/ai.module';
// AI module that integrates toxicity detection (predict.py)

@Module({
  imports: [
    // ============================
    // Serve static files
    // ============================

    // Serves files from the /uploads directory
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // ============================
    // Database configuration
    // ============================

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'cinestream',
      autoLoadEntities: true,
      // Automatically loads entities from all modules

      synchronize: true,
      // Automatically syncs database schema (dev only)

      dropSchema: false,
      // Prevents dropping the database schema on restart
    }),

    // ============================
    // GraphQL configuration
    // ============================

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Uses Apollo as the GraphQL engine

      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // Automatically generates GraphQL schema file

      sortSchema: true,
      // Sorts schema for consistency

      playground: true,
      // Enables GraphQL Playground UI
    }),

    // ============================
    // Application modules
    // ============================

    AuthModule,
    // Authentication & authorization

    UserModule,
    // User management

    MovieModule,
    // Movie CRUD and queries

    GenreModule,
    // Genre CRUD and queries

    ReviewModule,
    // Reviews, ratings, and AI moderation

    WatchlistModule,
    // User watchlists

    // ============================
    // AI Module
    // ============================

    AiModule,
    // AI toxicity detection (Python integration)
  ],
})
export class AppModule { }
