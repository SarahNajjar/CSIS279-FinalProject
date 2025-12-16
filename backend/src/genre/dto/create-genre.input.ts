import { InputType, Field } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// Field → exposes properties as GraphQL input fields

import { IsNotEmpty } from 'class-validator';
// IsNotEmpty → validates that the field is not empty or undefined

@InputType()
export class CreateGenreInput {
    // GraphQL input used when creating a new genre

    @Field()
    @IsNotEmpty()
    name: string;
    // Name of the genre (must not be empty)
}
