import { InputType, Field, PartialType } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// Field → exposes properties as GraphQL input fields
// PartialType → creates a version of another input type where all fields are optional

import { CreateUserInput } from './create-user.input';
// Base input containing user fields to be reused

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
    // GraphQL input used for updating an existing user
    // All fields from CreateUserInput become optional here

    @Field({ nullable: true })
    role?: string;
    // Optional user role update (can override existing role)
}
