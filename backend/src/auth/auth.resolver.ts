import { Resolver, Mutation, Args } from '@nestjs/graphql';
// Resolver → marks this class as a GraphQL resolver
// Mutation → defines a GraphQL mutation
// Args → extracts arguments passed to the mutation

import { AuthService } from './auth.service';
// Service that handles authentication logic

import { LoginInput } from './dto/login-input';
// DTO defining the input shape for the login mutation

import { AuthResponse } from './dto/auth-response';
// DTO defining the response returned after successful login

@Resolver()
export class AuthResolver {
    // GraphQL resolver responsible for authentication operations

    constructor(private readonly authService: AuthService) { }
    // Injects AuthService via NestJS dependency injection

    @Mutation(() => AuthResponse)
    login(@Args('loginInput') loginInput: LoginInput) {
        // GraphQL login mutation that accepts email & password
        // and returns a token + user object

        return this.authService.login(loginInput);
        // Delegates authentication logic to AuthService
    }
}
