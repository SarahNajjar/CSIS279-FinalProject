import { CreateWatchlistInput } from './create-watchlist.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWatchlistInput extends PartialType(CreateWatchlistInput) {
    @Field(() => Int)
    id: number;
}
