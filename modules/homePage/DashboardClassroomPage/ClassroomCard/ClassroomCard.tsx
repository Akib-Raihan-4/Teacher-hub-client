import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IClassroomExtendedResponse } from "@/types/classroom";
import { Calendar, Ellipsis, Users, Wallet } from "lucide-react";

export default function ClassroomCard({
  classroom,
}: {
  classroom: IClassroomExtendedResponse;
}) {
  return (
    <Card className="dark:bg-neutral-600 shadow-2xl dark:border-gray-600 hover:dark:bg-neutral-700 hover:bg-neutral-100 transition-all duration-300 cursor-pointer group">
      <CardHeader>
        <div className="flex items-center justify-between pb-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="text-xs">
            <Ellipsis className="h-5 w-5" />
          </div>
        </div>
        <CardTitle className="text-lg">{classroom.name}</CardTitle>
        <CardDescription>{classroom.subject}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-6 w-6" />
          <span>{classroom.studentsCount} students</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-6 w-6" />
          <span>{classroom.days.join(", ")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Wallet className="h-6 w-6" />
          <span>{classroom.totalMonthlyFee} bdt/month</span>
        </div>
      </CardContent>
    </Card>
  );
}
