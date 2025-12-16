import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login-input';
import { AuthResponse } from './dto/auth-response';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const { email, password } = loginInput;

        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new UnauthorizedException('Invalid email or password');

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            'MY_SECRET_KEY',
            { expiresIn: '7d' }
        );

        return { token, user };
    }
}
