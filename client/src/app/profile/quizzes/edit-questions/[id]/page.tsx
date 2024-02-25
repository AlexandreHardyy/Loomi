"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { QuestionInterface } from "@/interface/question.interface";
import { useQuery } from "@tanstack/react-query";
import EditQuestion from "@/components/quiz/question/EditQuestion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditQuiz from "@/components/quiz/EditQuiz";

const Page = () => {
  const params = useParams();

  const { data: quiz } = useQuery({
    queryKey: ["getQuiz", params.id],
    queryFn: async () => {
      return await axios.get(`http://localhost:3000/quizzes/${params.id}`);
    },
  });

  if (!quiz) return <div>No quiz</div>;

  return (
    <div className={"flex flex-col gap-3 m-10"}>
      <EditQuiz quiz={quiz?.data} />
      <Button asChild className={"w-[150px]"}>
        <Link href={`/profile/quizzes/new-question/${quiz?.data.id}`}>
          Add Question
        </Link>
      </Button>
      {quiz?.data.questions.map((question: QuestionInterface) => (
        <EditQuestion
          key={question.id}
          question={question}
          quizId={params.id}
        />
      ))}
    </div>
  );
};

export default Page;
