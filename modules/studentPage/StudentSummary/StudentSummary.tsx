import Loader from "@/components/shared/loader/Loader";

import { AlertTriangle, Banknote, Calendar} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetStudentSummary } from "../hooks/useGetStudentSummary";
import { format } from "date-fns";

export default function StudentSummary({ studentId }: { studentId: string }) {
  const {
    data: studentSummary,
    isLoading,
    error,
  } = useGetStudentSummary(studentId);

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
        {studentSummary?.name.toLocaleUpperCase()}
      </h1>
      <p className="text-gray-300 mt-2">
        {studentSummary?.email} • {studentSummary?.parentPhone}
      </p>

      <p className="text-gray-400 mt-2">
        Joined{" "}
        {studentSummary?.createdAt
          ? format(studentSummary.createdAt, "dd MMMM yyyy")
          : ""}{" "}
        • {studentSummary?.monthlyFee} bdt/month
      </p>

      <div className="flex flex-col gap-4 xl:flex-row mt-7">
        <Card className="px-7 py-6 w-full bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300 mb-2">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold ">Unpaid Months</h1>
            <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
            {studentSummary?.unpaidMonthsCount}
          </p>
        </Card>

        <Card className="px-7 py-6 w-full bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300  mb-2">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold ">Total Paid</h1>
            <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
              <Banknote className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
            {((studentSummary?.totalPaidAmount ?? 0) / 1000).toFixed(2)}
            {(studentSummary?.totalPaidAmount ?? 0) > 0 && "k "} bdt
          </p>
        </Card>

        <Card className="px-7 py-6 w-full bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300 mb-2">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold ">Number of Payments</h1>
            <div className="p-2  dark:bg-yellow-500/10 bg-blue-500/10 rounded-lg">
              <Calendar className="h-5 w-5 sm:w-6 sm:h-6  dark:text-yellow-500 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold  dark:text-yellow-400 text-blue-600 mb-4">
            {studentSummary?.totalPayments}
          </p>
        </Card>
      </div>
    </div>
  );
}
