import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Movie } from '../../movie/entities/movie.entity';

@ObjectType()
@Entity('watchlists')
export class Watchlist {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Int)
    @Column()
    profile_id: number;

    @Field(() => Int)
    @Column()
    movie_id: number;

    @Field(() => Date)
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.watchlists, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    @Field(() => User, { nullable: true })
    user?: User;

    @ManyToOne(() => Movie, (movie) => movie.watchlists, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
    @Field(() => Movie, { nullable: true })
    movie?: Movie;
}
