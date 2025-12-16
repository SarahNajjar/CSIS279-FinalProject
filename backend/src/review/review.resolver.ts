import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Resolver(() => Review)
export class ReviewResolver {
    constructor(private readonly reviewService: ReviewService) { }

    @Query(() => [Review], { name: 'reviews' })
    findAll() {
        return this.reviewService.findAll();
    }

    @Query(() => Review, { name: 'review' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.reviewService.findOne(id);
    }

    @Mutation(() => Review)
    createReview(@Args('createReviewInput') createReviewInput: CreateReviewInput) {
        return this.reviewService.create(createReviewInput);
    }

    @Mutation(() => Review)
    updateReview(@Args('updateReviewInput') updateReviewInput: UpdateReviewInput) {
        return this.reviewService.update(updateReviewInput.id, updateReviewInput);
    }

    @Mutation(() => Boolean)
    deleteReview(@Args('id', { type: () => Int }) id: number) {
        return this.reviewService.remove(id);
    }
}
