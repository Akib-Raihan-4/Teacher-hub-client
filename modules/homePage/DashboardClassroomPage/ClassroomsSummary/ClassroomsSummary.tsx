import { Card } from "@/components/ui/card";
import { useGetAllClassroomsSummary } from "../hooks/useGetAllClassroomsSummary";
import { HandCoins, Users2, Warehouse } from "lucide-react";

export default function ClassroomsSummary() {
  const { data: classroomsSummary } = useGetAllClassroomsSummary();
  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      <Card className="px-7 my-4 w-full bg-white dark:bg-neutral-600 shadow-2xl border border-neutral-100">
        <div className="flex w-full justify-between items-center ">
          <h1 className="text-2xl font-bold">Total Classrooms</h1>{" "}
          <Warehouse className="h-5 w-5 sm:w-6 sm:h-6" />
        </div>
        <p className="text-2xl font-bold">
          {classroomsSummary?.totalClassrooms}
        </p>

        <h1 className="sm:text-xl  font-semibold">
          Current Month Added Classrooms:{" "}
          <span className="sm:pl-2 pl-1">
            {classroomsSummary?.currentMonth.currentMonthClassrooms}{" "}
          </span>
        </h1>
      </Card>

      <Card className="px-7 my-4 w-full bg-white dark:bg-neutral-600 shadow-2xl border border-neutral-100">
        <div className="flex w-full justify-between items-center ">
          <h1 className="text-2xl font-bold">Total Students</h1>{" "}
          <Users2 className="h-5 w-5 sm:w-6 sm:h-6" />
        </div>
        <p className="text-2xl font-bold">{classroomsSummary?.totalStudents}</p>

        <h1 className="sm:text-xl  font-semibold">
          Current Month Added Students:{" "}
          <span className="sm:pl-2 pl-1">
            {classroomsSummary?.currentMonth.currentMonthStudents}{" "}
          </span>
        </h1>
      </Card>

      <Card className="px-7 my-4 w-full bg-white dark:bg-neutral-600 shadow-2xl border border-neutral-100">
        <div className="flex w-full justify-between items-center ">
          <h1 className="text-2xl font-bold">Total Revenue</h1>{" "}
          <HandCoins className="h-5 w-5 sm:w-6 sm:h-6" />
        </div>
        <p className="text-2xl font-bold">{classroomsSummary?.totalRevenue}</p>

        <h1 className="sm:text-xl  font-semibold">
          Current Month Revenue:{" "}
          <span className="sm:pl-2 pl-1">
            {classroomsSummary?.currentMonth.currentMonthRevenue}{" "}
          </span>
        </h1>
      </Card>
    </div>
  );
}
