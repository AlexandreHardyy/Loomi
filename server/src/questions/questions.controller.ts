import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionEntity } from './entities/question.entity';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('quizzes/:idQuiz/questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Post()
  @ApiCreatedResponse({ type: QuestionEntity })
  async create(
    @Param('idQuiz', ParseIntPipe) idQuiz: number,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionService.create(createQuestionDto, idQuiz);
  }

  @Patch(':id')
  @ApiOkResponse({ type: QuestionEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(createQuestionDto, id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: QuestionEntity })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.delete(id);
  }
}
