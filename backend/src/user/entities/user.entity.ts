import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Review } from '../../review/entities/review.entity';
import { Watchlist } from '../../watchlist/entities/watchlist.entity';

@ObjectType()
@Entity('users')
export class User {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ unique: true })
    username: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;  // ❗ FIXED: required + stored in DB

    @Field({ defaultValue: 'viewer' })
    @Column({ default: 'viewer' })
    role: string;

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Review, (review) => review.user)
    @Field(() => [Review], { nullable: true })
    reviews?: Review[];

    @OneToMany(() => Watchlist, (watchlist) => watchlist.user)
    watchlists?: Watchlist[];
}
