import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}
  async create(createQuizDto: CreateQuizDto) {
    return this.prisma.quiz.create({ data: createQuizDto });
  }

  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        questions: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.quiz.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    return this.prisma.quiz.update({
      where: { id },
      data: updateQuizDto,
    });
  }

  async delete(id: number) {
    return this.prisma.quiz.delete({
      where: { id },
    });
  }
}
