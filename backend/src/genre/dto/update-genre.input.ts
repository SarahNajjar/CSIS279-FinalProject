import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// Field → exposes class properties as GraphQL fields
// Int → specifies a GraphQL integer type
// PartialType → creates a partial version of another input type

import { CreateGenreInput } from './create-genre.input';
// Base input containing the genre fields to be reused

@InputType()
export class UpdateGenreInput extends PartialType(CreateGenreInput) {
    // GraphQL input used for updating an existing genre
    // All fields from CreateGenreInput become optional here

    @Field(() => Int)
    id: number;
    // ID of the genre to be updated
}
