import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QuizEntity } from './entities/quiz.entity';

@Controller('quizzes')
@ApiTags('Quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @ApiOkResponse({ type: QuizEntity, isArray: true })
  async findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: QuizEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const quiz = await this.quizzesService.findOne(id);
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  @Post()
  @ApiCreatedResponse({ type: QuizEntity })
  async create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: QuizEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: QuizEntity })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.delete(id);
  }
}
