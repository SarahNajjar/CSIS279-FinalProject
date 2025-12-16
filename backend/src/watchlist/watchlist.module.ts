import { Module } from '@nestjs/common';
// Module → NestJS decorator used to define a module

import { TypeOrmModule } from '@nestjs/typeorm';
// TypeOrmModule → integrates TypeORM repositories with NestJS

import { WatchlistService } from './watchlist.service';
// Service containing business logic for watchlist operations

import { WatchlistResolver } from './watchlist.resolver';
// GraphQL resolver handling watchlist-related queries and mutations

import { Watchlist } from './entities/watchlist.entity';
// Watchlist entity representing the watchlists table

import { User } from '../user/entities/user.entity';
// User entity used to resolve watchlist–user relations

import { Movie } from '../movie/entities/movie.entity';
// Movie entity used to resolve watchlist–movie relations

@Module({
    imports: [TypeOrmModule.forFeature([Watchlist, User, Movie])],
    // Registers Watchlist, User, and Movie repositories for dependency injection

    providers: [WatchlistService, WatchlistResolver],
    // Makes WatchlistService and WatchlistResolver available within this module
})
export class WatchlistModule { }
// Defines the Watchlist module of the application
