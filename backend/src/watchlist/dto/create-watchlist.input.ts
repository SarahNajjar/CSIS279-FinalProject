import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateWatchlistInput {
    @Field(() => Int)
    profile_id: number;

    @Field(() => Int)
    movie_id: number;
}
