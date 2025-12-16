import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => [User], { name: 'users' })
    findAll() {
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'user' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.userService.findOne(id);
    }

    @Mutation(() => User)
    createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.userService.create(createUserInput);
    }

    @Mutation(() => User)
    updateUser(
        @Args('id', { type: () => Int }) id: number,
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ) {
        return this.userService.update(id, updateUserInput);
    }

    @Mutation(() => Boolean)
    removeUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        return this.userService.remove(id);
    }
}
