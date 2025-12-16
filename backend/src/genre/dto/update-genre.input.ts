import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateGenreInput } from './create-genre.input';

@InputType()
export class UpdateGenreInput extends PartialType(CreateGenreInput) {
    @Field(() => Int)
    id: number;
}
