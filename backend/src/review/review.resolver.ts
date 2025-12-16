import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Resolver → marks this class as a GraphQL resolver
// Query → defines GraphQL query operations
// Mutation → defines GraphQL mutation operations
// Args → extracts arguments passed to queries/mutations
// Int → specifies a GraphQL integer type

import { ReviewService } from './review.service';
// Service containing business logic for review operations

import { Review } from './entities/review.entity';
// Review entity used as the GraphQL return type

import { CreateReviewInput } from './dto/create-review.input';
// DTO defining input structure for creating a review

import { UpdateReviewInput } from './dto/update-review.input';
// DTO defining input structure for updating a review

@Resolver(() => Review)
export class ReviewResolver {
    // GraphQL resolver responsible for review-related queries and mutations

    constructor(private readonly reviewService: ReviewService) { }
    // Injects ReviewService via NestJS dependency injection

    @Query(() => [Review], { name: 'reviews' })
    findAll() {
        // Returns a list of all reviews
        return this.reviewService.findAll();
    }

    @Query(() => Review, { name: 'review' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        // Returns a single review by its ID
        return this.reviewService.findOne(id);
    }

    @Mutation(() => Review)
    createReview(@Args('createReviewInput') createReviewInput: CreateReviewInput) {
        // Creates a new review using the provided input
        return this.reviewService.create(createReviewInput);
    }

    @Mutation(() => Review)
    updateReview(@Args('updateReviewInput') updateReviewInput: UpdateReviewInput) {
        // Updates an existing review using its ID and new values
        return this.reviewService.update(updateReviewInput.id, updateReviewInput);
    }

    @Mutation(() => Boolean)
    deleteReview(@Args('id', { type: () => Int }) id: number) {
        // Deletes a review by its ID
        return this.reviewService.remove(id);
    }
}
