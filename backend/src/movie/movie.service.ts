import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) { }

    findAll(): Promise<Movie[]> {
        return this.movieRepository.find();
    }

    async findOne(id: number): Promise<Movie> {
        const movie = await this.movieRepository.findOne({ where: { id } });
        if (!movie) throw new Error(`Movie with ID ${id} not found`);
        return movie;
    }

    async create(createMovieInput: CreateMovieInput): Promise<Movie> {
        const movie = this.movieRepository.create(createMovieInput);
        const savedMovie = await this.movieRepository.save(movie);

        const reloaded = await this.movieRepository.findOne({
            where: { id: savedMovie.id },
            relations: ['genre'],
        });

        if (!reloaded) {
            throw new Error('Movie could not be reloaded after creation');
        }

        return reloaded;
    }

    async update(id: number, input: UpdateMovieInput): Promise<Movie> {
        await this.movieRepository.update(id, { ...input });
        return this.findOne(id);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.movieRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
