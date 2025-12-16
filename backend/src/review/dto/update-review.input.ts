import { CreateReviewInput } from './create-review.input';
// Base input containing review fields to be reused

import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
// InputType → marks this class as a GraphQL input type
// Field → exposes properties as GraphQL input fields
// Int → specifies a GraphQL integer type
// PartialType → creates a version of another input type where all fields are optional

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
    // GraphQL input used for updating an existing review
    // All fields from CreateReviewInput are optional here

    @Field(() => Int)
    id: number;
    // ID of the review to be updated
}
