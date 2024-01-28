import { Question } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionEntity implements Question {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  availableResponses: string[];

  @ApiProperty()
  correctResponses: string[];

  @ApiProperty()
  timeInSeconds: number;

  @ApiProperty()
  quizId: number;
}
