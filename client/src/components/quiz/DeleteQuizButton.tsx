"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const DeleteQuizButton = ({
  QuizId,
  QuizName,
}: {
  QuizId: number;
  QuizName: string;
}) => {
  const deleteQuiz = async (id: number, name: string) => {
    try {
      await axios.delete(`http://localhost:3000/quizzes/${id}`);
      toast(`Quiz ${name} deleted`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      variant={"destructive"}
      onClick={() => deleteQuiz(QuizId, QuizName)}
    >
      Delete
    </Button>
  );
};

export default DeleteQuizButton;
