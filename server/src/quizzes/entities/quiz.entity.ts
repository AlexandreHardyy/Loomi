import { Quiz, Question } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class QuizEntity implements Quiz {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  shuffle: boolean;

  @ApiProperty()
  questions: Question[];
}
