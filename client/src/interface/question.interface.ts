export interface QuestionInterface {
  id: number;
  name: string;
  availableResponses: string[];
  correctResponses: string[];
  timeInSeconds: number;
  quizId: number;
}
