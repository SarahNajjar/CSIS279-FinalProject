import { InputType, Field, Int } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// Field → exposes properties as GraphQL input fields
// Int → specifies a GraphQL integer type

@InputType()
export class CreateReviewInput {
    // GraphQL input used when creating a new review

    @Field(() => Int)
    movie_id: number;
    // ID of the movie being reviewed

    @Field(() => Int, { nullable: true })
    profile_id?: number;
    // Optional profile/user ID of the reviewer

    @Field(() => Int, { nullable: true })
    rating?: number;
    // Optional numeric rating given to the movie

    @Field({ nullable: true })
    review_text?: string;
    // Optional textual review content
}
