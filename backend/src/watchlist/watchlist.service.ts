import { Injectable } from '@nestjs/common';
// Injectable → allows this service to be injected via NestJS dependency injection

import { InjectRepository } from '@nestjs/typeorm';
// InjectRepository → injects TypeORM repositories into the service

import { Repository } from 'typeorm';
// Repository → provides database access methods (find, save, update, delete)

import { Watchlist } from './entities/watchlist.entity';
// Watchlist entity representing the watchlists table

import { CreateWatchlistInput } from './dto/create-watchlist.input';
// DTO defining input structure for creating a watchlist entry

import { UpdateWatchlistInput } from './dto/update-watchlist.input';
// DTO defining input structure for updating a watchlist entry

import { User } from '../user/entities/user.entity';
// User entity used to validate and link watchlist ownership

import { Movie } from '../movie/entities/movie.entity';
// Movie entity used to validate and link watchlist items

@Injectable()
export class WatchlistService {
    // Service responsible for watchlist-related business logic

    constructor(
        @InjectRepository(Watchlist)
        private readonly watchlistRepository: Repository<Watchlist>,
        // Repository for watchlist CRUD operations

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        // Repository used to fetch and validate users

        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
        // Repository used to fetch and validate movies
    ) { }

    findAll(): Promise<Watchlist[]> {
        // Retrieves all watchlist entries with related user and movie
        return this.watchlistRepository.find({ relations: ['user', 'movie'] });
    }

    async findOne(id: number): Promise<Watchlist> {
        // Retrieves a single watchlist entry by ID with relations
        const item = await this.watchlistRepository.findOne({
            where: { id },
            relations: ['user', 'movie'],
        });

        if (!item)
            throw new Error(`Watchlist item with ID ${id} not found`);
        // Throws an error if the watchlist entry does not exist

        return item;
    }

    async create(createWatchlistInput: CreateWatchlistInput): Promise<Watchlist> {
        const { profile_id, movie_id } = createWatchlistInput;
        // Extracts user and movie IDs from input

        // 1️⃣ Find user and movie
        const user = await this.userRepository.findOne({ where: { id: profile_id } });
        const movie = await this.movieRepository.findOne({ where: { id: movie_id } });

        if (!user || !movie) {
            // Ensures both user and movie exist
            throw new Error('User or Movie not found');
        }

        // 2️⃣ Check if already exists in watchlist
        const existing = await this.watchlistRepository.findOne({
            where: { profile_id, movie_id },
        });

        if (existing) {
            // Prevents duplicate watchlist entries
            throw new Error('This movie is already in the user’s watchlist');
        }

        // 3️⃣ Create and save watchlist entry
        const watchlist = this.watchlistRepository.create({
            profile_id,
            movie_id,
            user,
            movie,
        });

        await this.watchlistRepository.save(watchlist);
        // Persists the new watchlist entry

        // 4️⃣ Reload with relations
        const result = await this.watchlistRepository.findOne({
            where: { id: watchlist.id },
            relations: ['user', 'movie'],
        });

        if (!result)
            throw new Error('Failed to load created watchlist');
        // Ensures the newly created entry is properly loaded

        return result;
    }

    async update(id: number, updateWatchlistInput: UpdateWatchlistInput): Promise<Watchlist> {
        // Updates an existing watchlist entry by ID
        await this.watchlistRepository.update(id, updateWatchlistInput);

        // Returns the updated watchlist entry
        return this.findOne(id);
    }

    async remove(id: number): Promise<boolean> {
        // Deletes a watchlist entry by ID
        const result = await this.watchlistRepository.delete(id);

        // Returns true if a watchlist entry was successfully deleted
        return !!result.affected && result.affected > 0;
    }
}
