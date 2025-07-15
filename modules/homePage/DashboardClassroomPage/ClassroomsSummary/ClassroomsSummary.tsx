import { Card } from "@/components/ui/card";
import { useGetAllClassroomsSummary } from "../hooks/useGetAllClassroomsSummary";
import { HandCoins, Users2, Warehouse } from "lucide-react";

export default function ClassroomsSummary() {
  const { data: classroomsSummary } = useGetAllClassroomsSummary();
  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      <Card className="px-7 py-6 w-full bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300">
        <div className="flex w-full justify-between items-center mb-4">
          <h1 className="text-2xl font-bold ">Total Classrooms</h1>
          <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
            <Warehouse className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
          </div>
        </div>
        <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
          {classroomsSummary?.totalClassrooms}
        </p>

        <div className="border-t  dark:border-yellow-500/20 border-blue-500/20 pt-4">
          <h1 className="sm:text-xl font-semibold  dark:text-gray-300 text-gray-600">
            Current Month Added Classrooms:
            <span className="sm:pl-2 pl-1  dark:text-yellow-400 text-blue-600 font-bold">
              {classroomsSummary?.currentMonth.currentMonthClassrooms}
            </span>
          </h1>
        </div>
      </Card>

      <Card className="px-7 py-6 w-full bg-gradient-to-br  dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300">
        <div className="flex w-full justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Total Students</h1>
          <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
            <Users2 className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
          </div>
        </div>
        <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
          {classroomsSummary?.totalStudents}
        </p>

        <div className="border-t  dark:border-yellow-500/20 border-blue-500/20 pt-4">
          <h1 className="sm:text-xl font-semibold  dark:text-gray-300 text-gray-600">
            Current Month Added Students:
            <span className="sm:pl-2 pl-1  dark:text-yellow-400 text-blue-600 font-bold">
              {classroomsSummary?.currentMonth.currentMonthStudents}
            </span>
          </h1>
        </div>
      </Card>

      <Card className="px-7 py-6 w-full bg-gradient-to-br   dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300">
        <div className="flex w-full justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Total Revenue</h1>
          <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
            <HandCoins className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
          </div>
        </div>
        <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
          {classroomsSummary?.totalRevenue}
        </p>

        <div className="border-t dark:border-yellow-500/20 border-blue-500/20 pt-4">
          <h1 className="sm:text-xl font-semibold  dark:text-gray-300 text-gray-600">
            Current Month Revenue:
            <span className="sm:pl-2 pl-1 dark:text-yellow-400 text-blue-600 font-bold">
              {classroomsSummary?.currentMonth.currentMonthRevenue}
            </span>
          </h1>
        </div>
      </Card>
    </div>
  );
}
