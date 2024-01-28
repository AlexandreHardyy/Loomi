import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizInterface } from "@/interface/quiz.interface";
import Link from "next/link";

const Page = async () => {
  const quizzes = await axios.get("http://localhost:3000/quizzes");

  if (!quizzes) return <div>No quizzes</div>;

  return (
    <div className={"flex flex-col gap-3"}>
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
              <div className={"flex flex-col gap-2"}>
                <div>Questions: {quiz.questions.length}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className={"flex gap-2"}>
              <Button>Start</Button>
              <Button>Edit</Button>
              <Button variant={"destructive"}>Delete</Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Page;
