"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const DeleteQuestionButton = ({
  QuizId,
  QuestionId,
}: {
  QuizId: string[] | string;
  QuestionId: number;
}) => {
  const deleteQuestion = async (
    quizId: string | string[],
    questionId: number,
  ) => {
    try {
      if (typeof quizId === "string") {
        await axios.delete(
          `http://localhost:3000/quizzes/${parseInt(quizId)}/questions/${questionId}`,
        );
      }
      toast(`Question has been deleted`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      variant={"destructive"}
      onClick={() => deleteQuestion(QuizId, QuestionId)}
    >
      Delete
    </Button>
  );
};

export default DeleteQuestionButton;
