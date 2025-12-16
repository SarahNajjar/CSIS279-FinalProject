import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WatchlistService } from './watchlist.service';
import { Watchlist } from './entities/watchlist.entity';
import { CreateWatchlistInput } from './dto/create-watchlist.input';
import { UpdateWatchlistInput } from './dto/update-watchlist.input';

@Resolver(() => Watchlist)
export class WatchlistResolver {
    constructor(private readonly watchlistService: WatchlistService) { }

    @Mutation(() => Watchlist)
    createWatchlist(@Args('createWatchlistInput') createWatchlistInput: CreateWatchlistInput) {
        return this.watchlistService.create(createWatchlistInput);
    }

    @Query(() => [Watchlist], { name: 'watchlists' })
    findAll() {
        return this.watchlistService.findAll();
    }

    @Query(() => Watchlist, { name: 'watchlist' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.watchlistService.findOne(id);
    }

    @Mutation(() => Watchlist)
    updateWatchlist(@Args('updateWatchlistInput') updateWatchlistInput: UpdateWatchlistInput) {
        return this.watchlistService.update(updateWatchlistInput.id, updateWatchlistInput);
    }

    @Mutation(() => Boolean)
    removeWatchlist(@Args('id', { type: () => Int }) id: number) {
        return this.watchlistService.remove(id);
    }
}
