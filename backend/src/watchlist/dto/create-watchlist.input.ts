import { InputType, Field, Int } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// Field → exposes properties as GraphQL input fields
// Int → specifies a GraphQL integer type

@InputType()
export class CreateWatchlistInput {
    // GraphQL input used when adding a movie to a user's watchlist

    @Field(() => Int)
    profile_id: number;
    // ID of the user/profile who owns the watchlist entry

    @Field(() => Int)
    movie_id: number;
    // ID of the movie being added to the watchlist
}
