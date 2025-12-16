import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsInt, IsString } from 'class-validator';

@InputType()
export class CreateMovieInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    genre_id?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    poster_path?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    trailer_path?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    duration?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    release_year?: number;
}
