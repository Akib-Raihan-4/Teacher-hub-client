"use client";
import { Button } from "@/components/ui/button";
import StudentSummary from "@/modules/studentPage/StudentSummary/StudentSummary";
import { ArrowBigLeftDash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Student(props: { params: Promise<{ id: string }> }) {
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
        <span className="text-xl"> Back To Classroom</span>
      </Button>
      <StudentSummary studentId={id} />
    </>
  );
}
