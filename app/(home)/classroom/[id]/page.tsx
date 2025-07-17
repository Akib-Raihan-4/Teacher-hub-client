"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowBigLeftDash } from "lucide-react";
import ClassroomSummaryWithHeader from "@/modules/classroomPage/ClassroomSummary/ClassroomSummary";
import { AddStudentFormModal } from "@/modules/classroomPage/AddStudentModal/AddStudentFormModal";
import AllStudents from "@/modules/classroomPage/AllStudents/AllStudents";

export default function Classroom(props: { params: Promise<{ id: string }> }) {
  const { id } = React.use(props.params);
  const router = useRouter();

  return (
    <>
      <Button
        onClick={() => router.back()}
        className="!px-0 hover:!px-2 cursor-pointer dark:hover:!bg-gray-200 hover:!bg-gray-300 dark:hover:!text-black"
        variant={"ghost"}
      >
        <ArrowBigLeftDash className="!w-6 !h-6" />{" "}
        <span className="text-xl"> Back To Classroom Dashboard</span>
      </Button>
      <ClassroomSummaryWithHeader classroomId={id} />

      <div className="flex justify-between items-center my-9">
        <h1 className="text-4xl font-bold">Students</h1>
        <AddStudentFormModal classroomId={id} />
      </div>
      <AllStudents classroomId={id}   />
    </>
  );
}
