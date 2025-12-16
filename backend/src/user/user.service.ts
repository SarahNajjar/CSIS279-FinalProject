import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
        const user = this.userRepository.create({
            ...createUserInput,
            password: hashedPassword, // store the hashed password
        });
        return this.userRepository.save(user);
    }

    async update(id: number, updateUserInput: UpdateUserInput): Promise<User | null> {
        if (updateUserInput.password) {
            updateUserInput.password = await bcrypt.hash(updateUserInput.password, 10);
        }
        await this.userRepository.update(id, updateUserInput);
        return this.userRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.userRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}
