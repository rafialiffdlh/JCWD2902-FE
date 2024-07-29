/** @format */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { promise, z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/config/axios.config";
import { THero } from "./heroes.component";
import { useEffect } from "react";

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(10, {
    message: "Username must be at least 10 characters.",
  }),
});

interface Props {
  fetch: () => Promise<void>;
  editHero: THero;
}

export function HeroForm({ fetch, editHero }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      id: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (form.getValues("id")) {
      await api.patch("/superheroes/" + values.id, values);
    } else {
      await api.post("superheroes", values);
    }
    form.control._reset();
    await fetch();
  };

  useEffect(() => {
    if (editHero) {
      form.setValue("name", editHero.name!);
      form.setValue("id", editHero.id!);
    }
  }, [editHero]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-screen-sm text-left "
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your superhero name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
