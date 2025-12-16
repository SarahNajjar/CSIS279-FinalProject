import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { CreateWatchlistInput } from './dto/create-watchlist.input';
import { UpdateWatchlistInput } from './dto/update-watchlist.input';
import { User } from '../user/entities/user.entity';
import { Movie } from '../movie/entities/movie.entity';

@Injectable()
export class WatchlistService {
    constructor(
        @InjectRepository(Watchlist)
        private readonly watchlistRepository: Repository<Watchlist>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) { }

    findAll(): Promise<Watchlist[]> {
        return this.watchlistRepository.find({ relations: ['user', 'movie'] });
    }

    async findOne(id: number): Promise<Watchlist> {
        const item = await this.watchlistRepository.findOne({
            where: { id },
            relations: ['user', 'movie'],
        });
        if (!item) throw new Error(`Watchlist item with ID ${id} not found`);
        return item;
    }

    async create(createWatchlistInput: CreateWatchlistInput): Promise<Watchlist> {
        const { profile_id, movie_id } = createWatchlistInput;

        // 1️⃣ Find user and movie
        const user = await this.userRepository.findOne({ where: { id: profile_id } });
        const movie = await this.movieRepository.findOne({ where: { id: movie_id } });

        if (!user || !movie) {
            throw new Error('User or Movie not found');
        }

        // 2️⃣ Check if already exists in watchlist
        const existing = await this.watchlistRepository.findOne({
            where: { profile_id, movie_id },
        });

        if (existing) {
            throw new Error('This movie is already in the user’s watchlist');
        }

        // 3️⃣ Create and save
        const watchlist = this.watchlistRepository.create({
            profile_id,
            movie_id,
            user,
            movie,
        });

        await this.watchlistRepository.save(watchlist);

        // 4️⃣ Reload with relations
        const result = await this.watchlistRepository.findOne({
            where: { id: watchlist.id },
            relations: ['user', 'movie'],
        });

        if (!result) throw new Error('Failed to load created watchlist');
        return result;
    }

    async update(id: number, updateWatchlistInput: UpdateWatchlistInput): Promise<Watchlist> {
        await this.watchlistRepository.update(id, updateWatchlistInput);
        return this.findOne(id);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.watchlistRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
