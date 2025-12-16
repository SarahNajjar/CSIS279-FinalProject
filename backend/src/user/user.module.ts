import { Module } from '@nestjs/common';
// Module → NestJS decorator used to define a module

import { TypeOrmModule } from '@nestjs/typeorm';
// TypeOrmModule → integrates TypeORM repositories with NestJS

import { User } from './entities/user.entity';
// User entity representing the users table

import { UserService } from './user.service';
// Service containing business logic related to users

import { UserResolver } from './user.resolver';
// GraphQL resolver handling user-related queries and mutations

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    // Registers the User repository for dependency injection

    providers: [UserResolver, UserService],
    // Makes UserResolver and UserService available within this module

    exports: [UserService],
    // Exports UserService so other modules (e.g. AuthModule) can reuse it
})
export class UserModule { }
// Defines the User module of the application
