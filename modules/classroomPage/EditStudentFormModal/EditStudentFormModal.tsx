"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";

import { IStudentResponse } from "@/types/student";
import { useUpdateStudent } from "../hooks/useUpdateStudent";
import {
  StudentFormValues,
  studentSchema,
} from "../AddStudentModal/AddStudentFormModal.helpers";

export const EditStudentFormModal = ({
  classroomId,
  student,
  open,
  onOpenChange,
}: {
  classroomId: string;
  student: IStudentResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student.name,
      parentPhone: student.parentPhone,
      email: student.email,
      monthlyFee: student.monthlyFee,
    },
    mode: "onChange",
  });

  const {
    mutate: updateStudent,
    isPending,
    error,
  } = useUpdateStudent(classroomId);

  useEffect(() => {
    reset({
      name: student.name,
      parentPhone: student.parentPhone,
      email: student.email,
      monthlyFee: student.monthlyFee,
    });
  }, [student, reset]);

  const onSubmit = (data: StudentFormValues) => {
    updateStudent(
      {
        studentId: student.id,
        payload: { ...data, classroomId },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogContent
        className="sm:max-w-[500px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="font-bold sm:text-2xl text-xl text-center sm:pb-8 pb-4">
          Edit Student
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="sm:text-xl text-lg">
              Student Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              className="my-4 border-2 border-foreground"
              placeholder="Student Name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="parentPhone" className="sm:text-xl text-lg">
              Parent&apos;s Phone
            </Label>
            <Input
              id="parentPhone"
              {...register("parentPhone")}
              className="my-4 border-2 border-foreground"
              placeholder="Parent Phone"
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
              {...register("email")}
              className="my-4 border-2 border-foreground"
              placeholder="Email"
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
              {...register("monthlyFee", { valueAsNumber: true })}
              className="my-4 border-2 border-foreground"
              placeholder="Monthly Fee"
            />
            {errors.monthlyFee && (
              <p className="text-sm text-red-500">
                {errors.monthlyFee.message}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error.message}</p>}

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isPending || !isDirty}
              className="cursor-pointer"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
