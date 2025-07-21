"use client";
import { Button } from "@/components/ui/button";
import PaymentSection from "@/modules/studentPage/PaymentSection/PaymentSection";
import StudentSummary from "@/modules/studentPage/StudentSummary/StudentSummary";
import UnpaidRecordSection from "@/modules/studentPage/UnpaidRecordSection/UnpaidRecordSection";
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
      <UnpaidRecordSection studentId={id} />
      <h1 className="text-4xl font-bold mb-7">Payments</h1>
      <PaymentSection studentId={id} />
     
    </>
  );
}
