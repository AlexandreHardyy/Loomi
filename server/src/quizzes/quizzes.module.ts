import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { QuestionsModule } from '../questions/questions.module';
import { QuizzesGateway } from './quizzes.gateway';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService, QuizzesGateway],
  imports: [PrismaModule, QuestionsModule],
})
export class QuizzesModule {}
