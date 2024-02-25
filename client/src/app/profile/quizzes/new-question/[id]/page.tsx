"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";

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
  timeInSeconds: z.coerce.number().min(10, {
    message: "Time must be at least 10 seconds.",
  }),
});

const Page = () => {
  const params = useParams();
  const [response, setResponse] = useState("");
  const [availableResponses, setAvailableResponses] = useState([""]);
  const [correctResponses, setCorrectResponses] = useState([""]);

  const mutation = useMutation({
    mutationKey: ["addQuestion"],
    mutationFn: async (values: z.infer<typeof FormQuestionSchema>) => {
      console.log(values);
      values.availableResponses = availableResponses;
      values.availableResponses = values.availableResponses.filter(
        (response) => response !== "",
      );
      values.correctResponses = correctResponses;
      values.correctResponses = values.correctResponses.filter(
        (response) => response !== "",
      );
      values.timeInSeconds = parseInt(values.timeInSeconds);
      await axios.post(
        `http://localhost:3000/quizzes/${params.id}/questions`,
        values,
      );
    },
  });

  const questionForm = useForm<z.infer<typeof FormQuestionSchema>>({
    resolver: zodResolver(FormQuestionSchema),
    defaultValues: {
      name: "",
      availableResponses: [],
      correctResponses: [],
      timeInSeconds: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof FormQuestionSchema>) {
    if (correctResponses.length === 0) {
      toast("You need to add at least one correct response.");
      return;
    }
    try {
      await mutation.mutateAsync(data);
      toast("Your question has been added to the quiz !");
      setAvailableResponses([]);
      setCorrectResponses([]);
      setResponse("");
    } catch (error) {
      console.error(error);
    }
  }

  function addResponse() {
    //si la réponse est vide ou alors est déjà dans les réponses, on ne l'ajoute pas
    if (response === "" || availableResponses.includes(response)) {
      toast("You need to add a valid response.");
      return;
    }
    setAvailableResponses((prev) => [...prev, response]);
    setResponse("");
    toast("Your response has been added.");
  }

  function toggleCorrectResponses(answer: string) {
    //si la réponse est déjà dans les bonnes réponses, on la retire et inversement
    if (correctResponses.includes(answer)) {
      setCorrectResponses((prev) => prev.filter((item) => item !== answer));
    } else {
      setCorrectResponses((prev) => [...prev, answer]);
    }
  }

  return (
    <div className="flex items-center flex-col my-10">
      <h1 className="text-2xl font-bold mb-2">Questions</h1>
      <Form {...questionForm}>
        <form
          onSubmit={questionForm.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={questionForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input
                    placeholder="What is the capital of France?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <input
            type="text"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={"Paris"}
            className={"border border-gray-300 rounded-md p-2 w-full mb-4"}
          />
          <div className="flex items-center">
            <Button
              onClick={(event) => {
                event.preventDefault();
                addResponse();
              }}
            >
              Add response
            </Button>
            <div className="ml-4">
              {availableResponses.map(
                (answer, index) =>
                  answer !== "" && (
                    <Badge
                      key={index}
                      className={
                        correctResponses.includes(answer)
                          ? "bg-green-500 mr-2 cursor-pointer"
                          : "mr-2 cursor-pointer"
                      }
                      onClick={() => toggleCorrectResponses(answer)}
                    >
                      {answer}
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          setAvailableResponses((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
                        className="ml-2"
                      >
                        X
                      </button>
                    </Badge>
                  ),
              )}
            </div>
          </div>
          <small>Click on the answers you want to make correct</small>

          <FormField
            control={questionForm.control}
            name="timeInSeconds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time in seconds</FormLabel>
                <FormControl>
                  <Input placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            onClick={() => onSubmit(questionForm.getValues())}
          >
            Add question
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;
