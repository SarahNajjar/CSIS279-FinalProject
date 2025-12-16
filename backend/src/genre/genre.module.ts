import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreService } from './genre.service';
import { GenreResolver } from './genre.resolver';
import { Genre } from './entities/genre.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Genre])],
    providers: [GenreService, GenreResolver],
    exports: [GenreService],
})
export class GenreModule { }
