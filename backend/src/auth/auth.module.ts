import { Module } from '@nestjs/common';
// Imports the NestJS Module decorator used to define a module

import { AuthResolver } from './auth.resolver';
// GraphQL resolver responsible for handling auth-related queries and mutations

import { AuthService } from './auth.service';
// Service that contains authentication business logic (login, token generation, etc.)

import { UserModule } from '../user/user.module';
// Imports UserModule to access user-related services and entities

@Module({
    imports: [UserModule],
    // Makes providers from UserModule (e.g. UserService) available to AuthModule

    providers: [AuthResolver, AuthService],
    // Registers the AuthResolver and AuthService with NestJS dependency injection
})
export class AuthModule { }
// Defines the authentication module of the application
