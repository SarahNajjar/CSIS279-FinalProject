import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreInput } from './dto/create-genre.input';
import { UpdateGenreInput } from './dto/update-genre.input';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>,
    ) { }

    findAll(): Promise<Genre[]> {
        return this.genreRepository.find({ relations: ['movies'] });
    }

    async findOne(id: number): Promise<Genre> {
        const genre = await this.genreRepository.findOne({
            where: { id },
            relations: ['movies'],
        });
        if (!genre) throw new Error(`Genre with ID ${id} not found`);
        return genre;
    }

    async create(createGenreInput: CreateGenreInput): Promise<Genre> {
        const genre = this.genreRepository.create(createGenreInput);
        return this.genreRepository.save(genre);
    }

    async update(id: number, updateGenreInput: UpdateGenreInput): Promise<Genre> {
        await this.genreRepository.update(id, updateGenreInput);
        return this.findOne(id);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.genreRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
