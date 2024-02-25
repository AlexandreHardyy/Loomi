import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizInterface } from "@/interface/quiz.interface";
import axios from "axios";
import Link from "next/link";
import DeleteQuizButton from "@/components/quiz/DeleteQuizButton";

const Page = async () => {
  const quizzes = await axios.get("http://localhost:3000/quizzes");

  if (!quizzes) return <div>No quizzes</div>;

  return (
    <div className={"flex flex-col gap-3 m-10"}>
      <h1 className={"text-3xl font-bold"}>My Quizzes</h1>
      <div>
        <Button asChild>
          <Link href={"/profile/quizzes/new-quiz"}>Create new quiz</Link>
        </Button>
      </div>
      {quizzes?.data.map((quiz: QuizInterface) => (
        <Card key={quiz.id}>
          <CardHeader>
            <CardTitle>{quiz.name}</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex gap-2"}>
              <div className={"flex items-center gap-2"}>
                <div>Questions: {quiz.questions.length}</div>
                <Button asChild>
                  <Link href={`/profile/quizzes/new-question/${quiz.id}`}>
                    Add Question
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className={"flex gap-2"}>
              <Button asChild>
                <Link href={"/lobby"}>Start</Link>
              </Button>
              <Button asChild>
                <Link href={`/profile/quizzes/edit-questions/${quiz.id}`}>
                  Edit
                </Link>
              </Button>
              <DeleteQuizButton QuizId={quiz.id} QuizName={quiz.name} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Page;
