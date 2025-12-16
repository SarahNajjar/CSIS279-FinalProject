import { InputType, Field } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// Field → exposes properties as GraphQL input fields

@InputType()
export class LoginInput {
    // GraphQL input used for user login mutations

    @Field()
    email: string;
    // User’s email address used for authentication

    @Field()
    password: string;
    // User’s password used for authentication
}
