import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Float,
} from '@nestjs/graphql';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MovieService } from './movie.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';

import { Review } from '../review/entities/review.entity';

@Resolver(() => Movie)
export class MovieResolver {
  constructor(
    private readonly movieService: MovieService,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // =======================
  // Queries
  // =======================

  @Query(() => [Movie], { name: 'movies' })
  findAll() {
    return this.movieService.findAll();
  }

  @Query(() => Movie, { name: 'movie' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.movieService.findOne(id);
  }

  // =======================
  // Mutations
  // =======================

  @Mutation(() => Movie)
  createMovie(@Args('createMovieInput') createMovieInput: CreateMovieInput) {
    return this.movieService.create(createMovieInput);
  }

  @Mutation(() => Movie)
  updateMovie(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateMovieInput,
  ) {
    return this.movieService.update(id, input);
  }

  @Mutation(() => Boolean)
  removeMovie(@Args('id', { type: () => Int }) id: number) {
    return this.movieService.remove(id);
  }

  // =======================
  // ✅ Computed fields
  // =======================

  @ResolveField(() => Float)
  async average_rating(@Parent() movie: Movie): Promise<number> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.movie_id = :movieId', { movieId: movie.id })
      .andWhere('review.rating IS NOT NULL')
      .getRawOne();

    return Number(result?.avg) || 0;
  }

  @ResolveField(() => Int)
  async total_ratings(@Parent() movie: Movie): Promise<number> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('COUNT(review.rating)', 'count')
      .where('review.movie_id = :movieId', { movieId: movie.id })
      .andWhere('review.rating IS NOT NULL')
      .getRawOne();

    return Number(result?.count) || 0;
  }
}
