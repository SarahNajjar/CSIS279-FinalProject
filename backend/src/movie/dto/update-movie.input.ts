// update-movie.input.ts
import { InputType, PartialType } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// PartialType → creates a version of another input type where all fields are optional

import { CreateMovieInput } from './create-movie.input';
// Base input containing movie fields to be reused

@InputType()
export class UpdateMovieInput extends PartialType(CreateMovieInput) {
    // GraphQL input used for updating an existing movie
    // All fields from CreateMovieInput are optional here
}
