import { Injectable, UnauthorizedException } from '@nestjs/common';
// Injectable → allows this service to be injected via NestJS DI
// UnauthorizedException → throws a 401 error when authentication fails

import { UserService } from '../user/user.service';
// Service used to retrieve user data from the database

import { LoginInput } from './dto/login-input';
// DTO defining the structure of login input (email & password)

import { AuthResponse } from './dto/auth-response';
// DTO defining the structure of the login response (token + user)

import * as bcrypt from 'bcrypt';
// bcrypt → used to compare the plain password with the hashed password

import * as jwt from 'jsonwebtoken';
// jsonwebtoken → used to generate JWT access tokens

@Injectable()
export class AuthService {
    // Service responsible for authentication logic

    constructor(private readonly userService: UserService) { }
    // Injects UserService to access user-related database operations

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        // Handles user login and returns authentication response

        const { email, password } = loginInput;
        // Extracts email and password from input

        const user = await this.userService.findByEmail(email);
        // Fetches user by email from the database

        if (!user)
            throw new UnauthorizedException('Invalid email or password');
        // Rejects login if user does not exist

        const isValid = await bcrypt.compare(password, user.password);
        // Compares provided password with stored hashed password

        if (!isValid)
            throw new UnauthorizedException('Invalid email or password');
        // Rejects login if password is incorrect

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            'MY_SECRET_KEY',
            { expiresIn: '7d' }
        );
        // Generates a JWT containing user identity and role, valid for 7 days

        return { token, user };
        // Returns the token along with the authenticated user object
    }
}
