import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DeleteQuestionButton from "@/components/quiz/question/DeleteQuestionButton";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { QuestionInterface } from "@/interface/question.interface";

const FormQuestionSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  availableResponses: z.array(z.string()).min(2, {
    message: "At least 2 responses are required.",
  }),
  correctResponses: z.array(z.string()).min(1, {
    message: "At least 1 correct response is required.",
  }),
  timeInSeconds: z.number().min(10, {
    message: "Time must be at least 10 seconds.",
  }),
});

const EditQuestion = ({
  question,
  quizId,
}: {
  question: QuestionInterface;
  quizId: string[] | string;
}) => {
  const [availableResponses, setAvailableResponses] = useState(
    question.availableResponses,
  );
  const [correctResponses, setCorrectResponses] = useState(
    question.correctResponses,
  );
  const mutation = useMutation({
    mutationKey: ["addQuestion"],
    mutationFn: async (values: z.infer<typeof FormQuestionSchema>) => {
      values.availableResponses = availableResponses;
      values.availableResponses = values.availableResponses.filter(
        (response) => response !== "",
      );
      values.correctResponses = correctResponses;
      values.correctResponses = values.correctResponses.filter(
        (response) => response !== "",
      );
      await axios.patch(
        `http://localhost:3000/quizzes/${quizId}/questions/${question.id}`,
        values,
      );
    },
  });

  const questionForm = useForm<z.infer<typeof FormQuestionSchema>>({
    resolver: zodResolver(FormQuestionSchema),
    defaultValues: {
      name: question.name,
      availableResponses: availableResponses,
      correctResponses: correctResponses,
      timeInSeconds: question.timeInSeconds,
    },
  });

  function changeAvailableResponse(
    e: any,
    index: number,
    availableResponse: string,
  ) {
    const newAvailableResponses = [...availableResponses];
    newAvailableResponses[index] = e.target.value;
    setAvailableResponses(newAvailableResponses);
    if (correctResponses.includes(availableResponse)) {
      const newCorrectResponses = [...correctResponses];
      newCorrectResponses[index] = e.target.value;
      setCorrectResponses(newCorrectResponses);
    }
  }

  async function onSubmit(data: z.infer<typeof FormQuestionSchema>) {
    try {
      await mutation.mutateAsync(data);
      toast("Question edited.");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form key={question.id} {...questionForm}>
      <form
        onSubmit={questionForm.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6"
      >
        <Card>
          <CardHeader>
            <FormField
              control={questionForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardHeader>
          <CardContent>
            <div className={"flex items-center gap-2 mb-2"}>
              {question.availableResponses.map((availableResponse, index) => (
                <input
                  key={index}
                  type="text"
                  defaultValue={availableResponse}
                  onChange={(e) => {
                    changeAvailableResponse(e, index, availableResponse);
                  }}
                  className={
                    question.correctResponses.includes(availableResponse)
                      ? "border border-gray-300 rounded-md p-2 w-80 bg-green-500"
                      : "border border-gray-300 rounded-md p-2"
                  }
                />
              ))}
            </div>
            <div>
              <FormField
                control={questionForm.control}
                name="timeInSeconds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time in seconds</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10"
                        defaultValue={question.timeInSeconds}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className={"flex gap-2"}>
              <Button
                type="submit"
                onClick={() => onSubmit(questionForm.getValues())}
              >
                Edit
              </Button>
              <DeleteQuestionButton QuizId={quizId} QuestionId={question.id} />
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditQuestion;
