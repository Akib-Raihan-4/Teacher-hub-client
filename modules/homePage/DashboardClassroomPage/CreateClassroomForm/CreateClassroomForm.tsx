"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import {
  classroomSchema,
  ClassroomFormValues,
} from "./CreateClassroomForm.helpers";
import { useCreateClassroom } from "../hooks/useCreateClassroom";
import { Plus } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import MultipleSelector, { Option } from "@/components/ui/MultiSelector";

const dayOptions: Option[] = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

export const CreateClassroomModal = () => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, error } = useCreateClassroom();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: "",
      subject: "",
      days: [],
    },
    mode: "onChange",
  });

  const onSubmit = (data: ClassroomFormValues) => {
    const payload = {
      name: data.name,
      subject: data.subject,
      days: data.days,
    };

    mutate(payload, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 cursor-pointer p-4 rounded-3xl sm:w-56 w-40 text-white">
          <Plus className="!w-5 !h-5" />
          <span className="font-bold sm:text-lg text-sm">Create Classroom</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="font-bold sm:text-2xl text-xl text-center sm:pb-8 pb-4">
          Create Your Classroom
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="sm:text-xl text-lg">
              Classroom Name
            </Label>
            <Input
              id="name"
              placeholder="Classroom Name"
              {...register("name")}
              className="my-4 border-2 border-foreground"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="subject" className="sm:text-xl text-lg">
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="Subject Name"
              {...register("subject")}
              className="my-4 border-2 border-foreground"
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <Label className="sm:text-xl text-lg">Days</Label>
            <MultipleSelector
              className="border-foreground border-2 my-4"
              defaultOptions={dayOptions}
              placeholder="Select Days"
              onChange={(selected) =>
                setValue(
                  "days",
                  selected.map((s) => s.value),
                  { shouldValidate: true }
                )
              }
            />
            {errors.days && (
              <p className="text-sm text-red-500">{errors.days.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error.message}</p>}
          <div className="flex justify-end gap-4">
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
