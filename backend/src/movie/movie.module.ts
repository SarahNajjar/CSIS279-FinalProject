import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';
import { MovieResolver } from './movie.resolver';

import { Review } from '../review/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Review])],
  providers: [MovieService, MovieResolver],
  exports: [MovieService],
})
export class MovieModule {}
