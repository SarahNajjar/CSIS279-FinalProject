import { ObjectType, Field, Int } from '@nestjs/graphql';
// ObjectType → marks this class as a GraphQL object type
// Field → exposes class properties as GraphQL fields
// Int → specifies a GraphQL integer type

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
// TypeORM decorators for defining database entities, columns, and relations

import { Review } from '../../review/entities/review.entity';
// Review entity used for the user–review relationship

import { Watchlist } from '../../watchlist/entities/watchlist.entity';
// Watchlist entity used for the user–watchlist relationship

@ObjectType()
@Entity('users')
export class User {
    // Represents the User entity in both GraphQL and the database

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;
    // Auto-generated primary key

    @Field()
    @Column({ unique: true })
    username: string;
    // Unique username for the user

    @Field()
    @Column({ unique: true })
    email: string;
    // Unique email address for the user

    @Column()
    password: string;
    // User password (stored hashed in DB, not exposed in GraphQL)

    @Field({ defaultValue: 'viewer' })
    @Column({ default: 'viewer' })
    role: string;
    // User role with a default value of "viewer"

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;
    // Timestamp when the user was created

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;
    // Timestamp when the user was last updated

    @OneToMany(() => Review, (review) => review.user)
    @Field(() => [Review], { nullable: true })
    reviews?: Review[];
    // One user can have multiple reviews

    @OneToMany(() => Watchlist, (watchlist) => watchlist.user)
    watchlists?: Watchlist[];
    // One user can have multiple watchlist entries
}
