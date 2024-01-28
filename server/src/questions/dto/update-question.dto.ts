import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  availableResponses: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  correctResponses: string[];

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  timeInSeconds: number;
}
