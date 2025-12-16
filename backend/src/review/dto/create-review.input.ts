import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
    @Field(() => Int)
    movie_id: number;

    @Field(() => Int, { nullable: true })
    profile_id?: number;

    @Field(() => Int, { nullable: true })
    rating?: number;

    @Field({ nullable: true })
    review_text?: string;
}
