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
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const FormQuizSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  shuffle: z.boolean(),
});

function NewQuiz() {
  const mutation = useMutation({
    mutationKey: ["addQuiz"],
    mutationFn: async (values: z.infer<typeof FormQuizSchema>) => {
      await axios.post("http://localhost:3000/quizzes", values);
    },
  });

  const quizForm = useForm<z.infer<typeof FormQuizSchema>>({
    resolver: zodResolver(FormQuizSchema),
    defaultValues: {
      name: "",
      shuffle: true,
    },
  });

  async function onSubmit(data: z.infer<typeof FormQuizSchema>) {
    try {
      await mutation.mutateAsync(data);
      toast("Your quiz has been created !");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex items-center flex-col my-10">
      <h1 className="text-3xl font-bold mb-2">Create a new quiz</h1>
      <Form {...quizForm}>
        <form
          onSubmit={quizForm.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={quizForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz Name</FormLabel>
                <FormControl>
                  <Input placeholder="Quiz n°1..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default NewQuiz;
