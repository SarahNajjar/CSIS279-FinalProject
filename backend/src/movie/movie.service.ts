import { Injectable } from '@nestjs/common';
// Injectable → allows this service to be injected via NestJS dependency injection

import { InjectRepository } from '@nestjs/typeorm';
// InjectRepository → injects a TypeORM repository into the service

import { Repository } from 'typeorm';
// Repository → provides database access methods (find, save, update, delete)

import { Movie } from './entities/movie.entity';
// Movie entity representing the movies table

import { CreateMovieInput } from './dto/create-movie.input';
// DTO defining input structure for creating a movie

import { UpdateMovieInput } from './dto/update-movie.input';
// DTO defining input structure for updating a movie

@Injectable()
export class MovieService {
    // Service responsible for movie-related business logic

    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) { }
    // Injects the Movie repository for database operations

    findAll(): Promise<Movie[]> {
        // Retrieves all movies from the database
        return this.movieRepository.find();
    }

    async findOne(id: number): Promise<Movie> {
        // Retrieves a single movie by its ID
        const movie = await this.movieRepository.findOne({ where: { id } });

        if (!movie)
            throw new Error(`Movie with ID ${id} not found`);
        // Throws an error if the movie does not exist

        return movie;
    }

    async create(createMovieInput: CreateMovieInput): Promise<Movie> {
        // Creates a new Movie entity from the provided input
        const movie = this.movieRepository.create(createMovieInput);

        // Saves the new movie to the database
        const savedMovie = await this.movieRepository.save(movie);

        // Reloads the movie with its related genre
        const reloaded = await this.movieRepository.findOne({
            where: { id: savedMovie.id },
            relations: ['genre'],
        });

        if (!reloaded) {
            // Ensures the movie was successfully reloaded
            throw new Error('Movie could not be reloaded after creation');
        }

        return reloaded;
        // Returns the newly created movie with relations loaded
    }

    async update(id: number, input: UpdateMovieInput): Promise<Movie> {
        // Updates an existing movie by its ID with the provided fields
        await this.movieRepository.update(id, { ...input });

        // Returns the updated movie
        return this.findOne(id);
    }

    async remove(id: number): Promise<boolean> {
        // Deletes the movie with the given ID
        const result = await this.movieRepository.delete(id);

        // Returns true if at least one row was affected (deleted)
        return !!result.affected && result.affected > 0;
    }
}
