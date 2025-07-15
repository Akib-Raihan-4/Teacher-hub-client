"use client";

import React from "react";
import { useGetClassroomById } from "@/modules/classroomPage/hooks/useGetClassroomById";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowBigLeftDash } from "lucide-react";

export default function Classroom(props: { params: Promise<{ id: string }> }) {
  const { id } = React.use(props.params);
  const router = useRouter();

  const { data: classroom } = useGetClassroomById(id);

  return (
    <div>
      <Button
        onClick={() => router.back()}
        className="!px-0 hover:!px-2 cursor-pointer dark:hover:!bg-gray-200 hover:!bg-gray-300 dark:hover:!text-black"
        variant={"ghost"}
      >
        <ArrowBigLeftDash className="!w-6 !h-6" />{" "}
        <span className="text-xl"> Back to Classrooms</span>
      </Button>
      <h1>{classroom?.name}</h1>
    </div>
  );
}
