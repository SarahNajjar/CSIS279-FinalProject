import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @MinLength(6)
    password: string;

    // 👇 Optional role with default value "viewer"
    @Field({ nullable: true, defaultValue: 'viewer' })
    @IsOptional()
    role?: string;
}
