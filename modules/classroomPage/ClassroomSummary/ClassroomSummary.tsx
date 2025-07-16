import Loader from "@/components/shared/loader/Loader";
import { useGetClassroomById } from "../hooks/useGetClassroomById";
import {
  AlertCircle,
  Banknote,
  Calendar,
  CheckCircle,
  Users2,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ClassroomSummaryWithHeader({
  classroomId,
}: {
  classroomId: string;
}) {
  const {
    data: classroomSummary,
    isLoading,
    error,
  } = useGetClassroomById(classroomId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center md:min-h-[40rem] min-h-[20rem]">
        <Loader />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center md:min-h-[40rem] min-h-[20rem]">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mt-7">
      <h1 className="text-4xl font-bold">
        {classroomSummary?.name.toLocaleUpperCase()}
      </h1>
      <p className="text-gray-500 mt-2">
        {classroomSummary?.subject.toLocaleUpperCase()}
      </p>
      <div className="flex mt-2">
        <Calendar /> <p className="ml-2">{classroomSummary?.days.join(", ")}</p>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row mt-7">
        <Card className="px-7 py-6 w-full bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300 mb-2">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold ">Total Students</h1>
            <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
              <Users2 className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
            {classroomSummary?.studentsCount}
          </p>

          <div className="border-t  dark:border-yellow-500/20 border-blue-500/20 pt-4">
            <h1 className="sm:text-xl font-semibold  dark:text-gray-300 text-gray-600">
              Current Month Added Students:
              <span className="sm:pl-2 pl-1  dark:text-yellow-400 text-blue-600 font-bold">
                {classroomSummary?.newStudentsThisMonth}
              </span>
            </h1>
          </div>
        </Card>

        <Card className="px-7 py-6 w-full bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300  mb-2">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold ">Paid Students</h1>
            <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
            {classroomSummary?.lastMonth.paidStudentsCount}
          </p>

          <div className="border-t  dark:border-yellow-500/20 border-blue-500/20 pt-4">
            <h1 className="sm:text-xl font-semibold  dark:text-gray-300 text-gray-600">
              Completion Percentage:
              <span className="sm:pl-2 pl-1  dark:text-yellow-400 text-blue-600 font-bold">
                {classroomSummary?.lastMonth.completionPercentage.toFixed(2)}%
              </span>
            </h1>
          </div>
        </Card>

        <Card className="px-7 py-6 w-full bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300 mb-2">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold ">Total Revenue Collected</h1>
            <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
              <Banknote className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
            {((classroomSummary?.totalRevenue ?? 0) / 1000).toFixed(2)}
            {(classroomSummary?.lastMonth.revenue ?? 0) > 0 && "k "} bdt
          </p>

          <div className="border-t  dark:border-yellow-500/20 border-blue-500/20 pt-4">
            <h1 className="sm:text-xl font-semibold  dark:text-gray-300 text-gray-600">
              Last Month Revenue:
              <span className="sm:pl-2 pl-1  dark:text-yellow-400 text-blue-600 font-bold">
                {((classroomSummary?.lastMonth.revenue ?? 0) / 1000).toFixed(2)}
                {(classroomSummary?.lastMonth.revenue ?? 0) > 0 && "k "} bdt
              </span>
            </h1>
          </div>
        </Card>

        <Card className="px-7 py-6 w-full bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300 mb-2">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold ">Total Due</h1>
            <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
            {((classroomSummary?.totalDueAmount ?? 0) / 1000).toFixed(2)}
            {(classroomSummary?.lastMonth.revenue ?? 0) > 0 && "k "} bdt
          </p>

          <div className="border-t  dark:border-yellow-500/20 border-blue-500/20 pt-4">
            <h1 className="sm:text-xl font-semibold  dark:text-gray-300 text-gray-600">
              Last Month Due:
              <span className="sm:pl-2 pl-1  dark:text-yellow-400 text-blue-600 font-bold">
                {((classroomSummary?.lastMonth.dueAmount ?? 0) / 1000).toFixed(
                  2
                )}
                {(classroomSummary?.lastMonth.revenue ?? 0) > 0 && "k "} bdt
              </span>
            </h1>
          </div>
        </Card>
      </div>
    </div>
  );
}
