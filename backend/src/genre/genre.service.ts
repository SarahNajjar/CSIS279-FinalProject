import { Injectable } from '@nestjs/common';
// Injectable → allows this service to be injected via NestJS dependency injection

import { InjectRepository } from '@nestjs/typeorm';
// InjectRepository → injects a TypeORM repository into the service

import { Repository } from 'typeorm';
// Repository → provides database access methods (find, save, update, delete)

import { Genre } from './entities/genre.entity';
// Genre entity representing the genres table

import { CreateGenreInput } from './dto/create-genre.input';
// DTO defining input structure for creating a genre

import { UpdateGenreInput } from './dto/update-genre.input';
// DTO defining input structure for updating a genre

@Injectable()
export class GenreService {
    // Service responsible for genre-related business logic

    constructor(
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>,
    ) { }
    // Injects the Genre repository for database operations

    findAll(): Promise<Genre[]> {
        // Retrieves all genres along with their related movies
        return this.genreRepository.find({ relations: ['movies'] });
    }

    async findOne(id: number): Promise<Genre> {
        // Retrieves a single genre by ID, including related movies
        const genre = await this.genreRepository.findOne({
            where: { id },
            relations: ['movies'],
        });

        if (!genre)
            throw new Error(`Genre with ID ${id} not found`);
        // Throws an error if the genre does not exist

        return genre;
    }

    async create(createGenreInput: CreateGenreInput): Promise<Genre> {
        // Creates a new Genre entity from input data
        const genre = this.genreRepository.create(createGenreInput);

        // Saves the new genre to the database
        return this.genreRepository.save(genre);
    }

    async update(id: number, updateGenreInput: UpdateGenreInput): Promise<Genre> {
        // Updates the genre with the given ID using provided fields
        await this.genreRepository.update(id, updateGenreInput);

        // Returns the updated genre
        return this.findOne(id);
    }

    async remove(id: number): Promise<boolean> {
        // Deletes the genre with the given ID
        const result = await this.genreRepository.delete(id);

        // Returns true if at least one row was affected (deleted)
        return !!result.affected && result.affected > 0;
    }
}
