import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Resolver → marks this class as a GraphQL resolver
// Query → defines GraphQL query operations
// Mutation → defines GraphQL mutation operations
// Args → extracts arguments passed to queries/mutations
// Int → specifies a GraphQL integer type

import { WatchlistService } from './watchlist.service';
// Service containing business logic for watchlist operations

import { Watchlist } from './entities/watchlist.entity';
// Watchlist entity used as the GraphQL return type

import { CreateWatchlistInput } from './dto/create-watchlist.input';
// DTO defining input structure for creating a watchlist entry

import { UpdateWatchlistInput } from './dto/update-watchlist.input';
// DTO defining input structure for updating a watchlist entry

@Resolver(() => Watchlist)
export class WatchlistResolver {
    // GraphQL resolver responsible for watchlist-related queries and mutations

    constructor(private readonly watchlistService: WatchlistService) { }
    // Injects WatchlistService via NestJS dependency injection

    @Mutation(() => Watchlist)
    createWatchlist(@Args('createWatchlistInput') createWatchlistInput: CreateWatchlistInput) {
        // Creates a new watchlist entry (adds a movie to a user's watchlist)
        return this.watchlistService.create(createWatchlistInput);
    }

    @Query(() => [Watchlist], { name: 'watchlists' })
    findAll() {
        // Returns all watchlist entries
        return this.watchlistService.findAll();
    }

    @Query(() => Watchlist, { name: 'watchlist' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        // Returns a single watchlist entry by its ID
        return this.watchlistService.findOne(id);
    }

    @Mutation(() => Watchlist)
    updateWatchlist(@Args('updateWatchlistInput') updateWatchlistInput: UpdateWatchlistInput) {
        // Updates an existing watchlist entry using its ID and new values
        return this.watchlistService.update(updateWatchlistInput.id, updateWatchlistInput);
    }

    @Mutation(() => Boolean)
    removeWatchlist(@Args('id', { type: () => Int }) id: number) {
        // Removes a watchlist entry by its ID
        return this.watchlistService.remove(id);
    }
}
