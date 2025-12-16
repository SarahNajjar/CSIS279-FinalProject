import { Injectable } from '@nestjs/common';
// Injectable → allows this service to be injected via NestJS dependency injection

import { InjectRepository } from '@nestjs/typeorm';
// InjectRepository → injects a TypeORM repository into the service

import { Repository } from 'typeorm';
// Repository → provides database access methods (find, save, update, delete)

import * as bcrypt from 'bcrypt';
// bcrypt → used to hash and compare passwords securely

import { User } from './entities/user.entity';
// User entity representing the users table

import { CreateUserInput } from './dto/create-user.input';
// DTO defining input structure for creating a user

import { UpdateUserInput } from './dto/update-user.input';
// DTO defining input structure for updating a user

@Injectable()
export class UserService {
    // Service responsible for user-related business logic

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }
    // Injects the User repository for database operations

    findAll(): Promise<User[]> {
        // Retrieves all users from the database
        return this.userRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        // Retrieves a single user by ID
        return this.userRepository.findOne({ where: { id } });
    }

    findByEmail(email: string): Promise<User | null> {
        // Retrieves a single user by email (used for authentication)
        return this.userRepository.findOne({ where: { email } });
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        // Hashes the user's password before saving
        const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

        // Creates a new User entity with the hashed password
        const user = this.userRepository.create({
            ...createUserInput,
            password: hashedPassword, // store the hashed password
        });

        // Saves the new user to the database
        return this.userRepository.save(user);
    }

    async update(id: number, updateUserInput: UpdateUserInput): Promise<User | null> {
        // If password is being updated, hash it before saving
        if (updateUserInput.password) {
            updateUserInput.password = await bcrypt.hash(updateUserInput.password, 10);
        }

        // Updates the user record in the database
        await this.userRepository.update(id, updateUserInput);

        // Returns the updated user
        return this.userRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<boolean> {
        // Deletes the user with the given ID
        const result = await this.userRepository.delete(id);

        // Returns true if a user was successfully deleted
        return (result.affected ?? 0) > 0;
    }
}
