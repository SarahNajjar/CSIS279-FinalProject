import { InputType, Field, Int } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// Field → exposes properties as GraphQL input fields
// Int → specifies a GraphQL integer type

import { IsNotEmpty, IsOptional, IsInt, IsString } from 'class-validator';
// Class-validator decorators used to validate incoming input data

@InputType()
export class CreateMovieInput {
    // GraphQL input used when creating a new movie

    @Field()
    @IsNotEmpty()
    @IsString()
    title: string;
    // Movie title (required and must be a string)

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;
    // Optional movie description

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    genre_id?: number;
    // Optional genre ID associated with the movie

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    poster_path?: string;
    // Optional path or URL to the movie poster

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    trailer_path?: string;
    // Optional path or URL to the movie trailer

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    duration?: number;
    // Optional movie duration in minutes

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    release_year?: number;
    // Optional release year of the movie
}
