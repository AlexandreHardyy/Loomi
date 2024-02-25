import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { QuizInterface } from "@/interface/quiz.interface";

const FormQuizSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  shuffle: z.boolean(),
});

const EditQuestion = ({ quiz }: { quiz: QuizInterface }) => {
  const mutation = useMutation({
    mutationKey: ["addQuiz"],
    mutationFn: async (values: z.infer<typeof FormQuizSchema>) => {
      await axios.patch(`http://localhost:3000/quizzes/${quiz.id}`, values);
    },
  });

  const quizForm = useForm<z.infer<typeof FormQuizSchema>>({
    resolver: zodResolver(FormQuizSchema),
    defaultValues: {
      name: quiz.name,
      shuffle: true,
    },
  });

  async function onSubmit(data: z.infer<typeof FormQuizSchema>) {
    try {
      await mutation.mutateAsync(data);
      toast("Quiz name has been updated !");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...quizForm}>
      <form onSubmit={quizForm.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={quizForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className={"text-3xl font-bold"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Edit quiz name</Button>
      </form>
    </Form>
  );
};

export default EditQuestion;