import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}
  async create(createQuestionDto: CreateQuestionDto, quizId: number) {
    return this.prisma.question.create({
      data: {
        ...createQuestionDto,
        quiz: { connect: { id: quizId } },
      },
    });
  }

  async update(updateQuestionDto: UpdateQuestionDto, id: number) {
    return this.prisma.question.update({
      where: {
        id,
      },
      data: updateQuestionDto,
    });
  }

  async delete(id: number) {
    return this.prisma.question.delete({
      where: {
        id,
      },
    });
  }
}
