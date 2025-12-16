import { InputType, Field } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// Field → exposes properties as GraphQL input fields

import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
// Class-validator decorators used to validate incoming user input

@InputType()
export class CreateUserInput {
    // GraphQL input used when creating a new user

    @Field()
    @IsNotEmpty()
    username: string;
    // Username for the new user (required)

    @Field()
    @IsEmail()
    email: string;
    // User email address (must be a valid email format)

    @Field()
    @MinLength(6)
    password: string;
    // User password (minimum length of 6 characters)

    // 👇 Optional role with default value "viewer"
    @Field({ nullable: true, defaultValue: 'viewer' })
    @IsOptional()
    role?: string;
    // Optional user role (defaults to "viewer" if not provided)
}
