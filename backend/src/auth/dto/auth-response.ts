import { ObjectType, Field } from '@nestjs/graphql';
// ObjectType → marks this class as a GraphQL type
// Field → exposes class properties as GraphQL fields

import { User } from '../../user/entities/user.entity';
// Imports the User entity to be included in the auth response

@ObjectType()
export class AuthResponse {
    // GraphQL object returned after successful authentication

    @Field()
    token: string;
    // JWT access token returned to the client

    @Field(() => User)
    user: User;
    // Authenticated user object (id, email, role, etc.)
}
