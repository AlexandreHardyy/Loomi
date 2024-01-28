import { QuestionInterface } from "@/interface/question.interface";

export interface QuizInterface {
  id: number;
  name: string;
  shuffle: boolean;
  questions: QuestionInterface[];
}
