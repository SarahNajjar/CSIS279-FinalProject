import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Resolver → marks this class as a GraphQL resolver
// Query → defines GraphQL query operations
// Mutation → defines GraphQL mutation operations
// Args → extracts arguments passed to queries/mutations
// Int → specifies a GraphQL integer type

import { GenreService } from './genre.service';
// Service that contains business logic for genre operations

import { Genre } from './entities/genre.entity';
// Genre entity used as the GraphQL return type

import { CreateGenreInput } from './dto/create-genre.input';
// DTO defining input structure for creating a genre

import { UpdateGenreInput } from './dto/update-genre.input';
// DTO defining input structure for updating a genre

@Resolver(() => Genre)
export class GenreResolver {
    // GraphQL resolver responsible for handling genre-related operations

    constructor(private readonly genreService: GenreService) { }
    // Injects GenreService via NestJS dependency injection

    @Query(() => [Genre], { name: 'genres' })
    findAll() {
        // Returns a list of all genres
        return this.genreService.findAll();
    }

    @Query(() => Genre, { name: 'genre' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        // Returns a single genre by its ID
        return this.genreService.findOne(id);
    }

    @Mutation(() => Genre)
    createGenre(@Args('createGenreInput') createGenreInput: CreateGenreInput) {
        // Creates a new genre using provided input
        return this.genreService.create(createGenreInput);
    }

    @Mutation(() => Genre)
    updateGenre(@Args('updateGenreInput') updateGenreInput: UpdateGenreInput) {
        // Updates an existing genre using its ID and new values
        return this.genreService.update(updateGenreInput.id, updateGenreInput);
    }

    @Mutation(() => Boolean)
    removeGenre(@Args('id', { type: () => Int }) id: number) {
        // Deletes a genre by its ID
        return this.genreService.remove(id);
    }
}
