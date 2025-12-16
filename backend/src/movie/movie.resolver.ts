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
// Resolver → marks this class as a GraphQL resolver
// Query → defines GraphQL query operations
// Mutation → defines GraphQL mutation operations
// Args → extracts arguments passed to queries/mutations
// Int / Float → GraphQL scalar types
// ResolveField → defines computed/derived GraphQL fields
// Parent → accesses the parent object in field resolvers

import { InjectRepository } from '@nestjs/typeorm';
// InjectRepository → injects a TypeORM repository

import { Repository } from 'typeorm';
// Repository → provides database access methods

import { MovieService } from './movie.service';
// Service containing business logic for movies

import { Movie } from './entities/movie.entity';
// Movie entity used as the GraphQL return type

import { CreateMovieInput } from './dto/create-movie.input';
// DTO defining input structure for creating a movie

import { UpdateMovieInput } from './dto/update-movie.input';
// DTO defining input structure for updating a movie

import { Review } from '../review/entities/review.entity';
// Review entity used for computing ratings

@Resolver(() => Movie)
export class MovieResolver {
  // GraphQL resolver responsible for movie queries, mutations, and computed fields

  constructor(
    private readonly movieService: MovieService,
    // Injects MovieService for movie CRUD operations

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    // Injects Review repository for rating aggregation queries
  ) { }

  // =======================
  // Queries
  // =======================

  @Query(() => [Movie], { name: 'movies' })
  findAll() {
    // Returns a list of all movies
    return this.movieService.findAll();
  }

  @Query(() => Movie, { name: 'movie' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    // Returns a single movie by its ID
    return this.movieService.findOne(id);
  }

  // =======================
  // Mutations
  // =======================

  @Mutation(() => Movie)
  createMovie(@Args('createMovieInput') createMovieInput: CreateMovieInput) {
    // Creates a new movie using the provided input
    return this.movieService.create(createMovieInput);
  }

  @Mutation(() => Movie)
  updateMovie(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateMovieInput,
  ) {
    // Updates an existing movie by ID with new values
    return this.movieService.update(id, input);
  }

  @Mutation(() => Boolean)
  removeMovie(@Args('id', { type: () => Int }) id: number) {
    // Deletes a movie by its ID
    return this.movieService.remove(id);
  }

  // =======================
  // ✅ Computed fields
  // =======================

  @ResolveField(() => Float)
  async average_rating(@Parent() movie: Movie): Promise<number> {
    // Computes the average rating for a movie (not stored in DB)
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.movie_id = :movieId', { movieId: movie.id })
      .andWhere('review.rating IS NOT NULL')
      .getRawOne();

    return Number(result?.avg) || 0;
    // Returns average rating or 0 if none exists
  }

  @ResolveField(() => Int)
  async total_ratings(@Parent() movie: Movie): Promise<number> {
    // Computes the total number of ratings for a movie
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('COUNT(review.rating)', 'count')
      .where('review.movie_id = :movieId', { movieId: movie.id })
      .andWhere('review.rating IS NOT NULL')
      .getRawOne();

    return Number(result?.count) || 0;
    // Returns total ratings count or 0 if none exist
  }
}
