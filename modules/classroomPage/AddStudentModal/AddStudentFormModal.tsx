"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "@radix-ui/react-dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Plus } from "lucide-react";

import { useAddStudent } from "../hooks/useAddStudent";
import { StudentFormValues, studentSchema } from "./AddStudentFormModal.helpers";


interface AddStudentModalProps {
  classroomId: string;
}

export const AddStudentFormModal = ({ classroomId }: AddStudentModalProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAddStudent(classroomId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      parentPhone: "",
      email: "",
      monthlyFee: 0,
    },
    mode: "onChange",
  });

  const onSubmit = (data: StudentFormValues) => {
    mutate(
      { ...data, classroomId },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
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
        <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 cursor-pointer p-4 rounded-3xl sm:w-56 w-40 text-white">
          <Plus className="!w-5 !h-5" />
          <span className="font-bold sm:text-lg text-sm">Add Student</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="font-bold sm:text-2xl text-xl text-center sm:pb-8 pb-4">
          Add New Student
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="sm:text-xl text-lg">
              Student Name
            </Label>
            <Input
              id="name"
              placeholder="Enter student name"
              {...register("name")}
              className="my-2 border-2 border-foreground"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="parentPhone" className="sm:text-xl text-lg">
              Parent Phone
            </Label>
            <Input
              id="parentPhone"
              placeholder="Enter parent's phone number"
              {...register("parentPhone")}
              className="my-2 border-2 border-foreground"
            />
            {errors.parentPhone && (
              <p className="text-sm text-red-500">
                {errors.parentPhone.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="sm:text-xl text-lg">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Enter email address"
              {...register("email")}
              className="my-2 border-2 border-foreground"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="monthlyFee" className="sm:text-xl text-lg">
              Monthly Fee
            </Label>
            <Input
              id="monthlyFee"
              type="number"
              step="0.01"
              placeholder="Enter monthly fee"
              {...register("monthlyFee", { valueAsNumber: true })}
              className="my-2 border-2 border-foreground"
            />
            {errors.monthlyFee && (
              <p className="text-sm text-red-500">
                {errors.monthlyFee.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Adding..." : "Add Student"}
            </Button>
            <Button
              variant="destructive"
              type="button"
              className="cursor-pointer"
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
