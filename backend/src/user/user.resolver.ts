import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Resolver → marks this class as a GraphQL resolver
// Query → defines GraphQL query operations
// Mutation → defines GraphQL mutation operations
// Args → extracts arguments passed to queries/mutations
// Int → specifies a GraphQL integer type

import { UserService } from './user.service';
// Service containing business logic for user operations

import { User } from './entities/user.entity';
// User entity used as the GraphQL return type

import { CreateUserInput } from './dto/create-user.input';
// DTO defining input structure for creating a user

import { UpdateUserInput } from './dto/update-user.input';
// DTO defining input structure for updating a user

@Resolver(() => User)
export class UserResolver {
    // GraphQL resolver responsible for user-related queries and mutations

    constructor(private readonly userService: UserService) { }
    // Injects UserService via NestJS dependency injection

    @Query(() => [User], { name: 'users' })
    findAll() {
        // Returns a list of all users
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'user' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        // Returns a single user by their ID
        return this.userService.findOne(id);
    }

    @Mutation(() => User)
    createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        // Creates a new user using the provided input
        return this.userService.create(createUserInput);
    }

    @Mutation(() => User)
    updateUser(
        @Args('id', { type: () => Int }) id: number,
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ) {
        // Updates an existing user by ID with new values
        return this.userService.update(id, updateUserInput);
    }

    @Mutation(() => Boolean)
    removeUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        // Deletes a user by their ID
        return this.userService.remove(id);
    }
}
