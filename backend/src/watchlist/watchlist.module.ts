import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistService } from './watchlist.service';
import { WatchlistResolver } from './watchlist.resolver';
import { Watchlist } from './entities/watchlist.entity';
import { User } from '../user/entities/user.entity';
import { Movie } from '../movie/entities/movie.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Watchlist, User, Movie])],
    providers: [WatchlistService, WatchlistResolver],
})
export class WatchlistModule { }
