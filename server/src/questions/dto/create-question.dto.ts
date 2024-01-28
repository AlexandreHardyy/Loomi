import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  availableResponses: string[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  correctResponses: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  timeInSeconds: number;
}
