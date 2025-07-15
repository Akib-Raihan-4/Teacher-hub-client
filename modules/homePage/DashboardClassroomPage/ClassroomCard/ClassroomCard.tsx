"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IClassroomExtendedResponse } from "@/types/classroom";
import { Calendar, Ellipsis, Users, Wallet } from "lucide-react";
import { useDeleteClassroom } from "../hooks/useDeleteClassroom";
import { useState } from "react";
import { EditClassroomModal } from "../EditClassroomModal/EditClassroomModal";
import { useRouter } from "next/navigation";

export default function ClassroomCard({
  classroom,
}: {
  classroom: IClassroomExtendedResponse;
}) {
  const { mutate: deleteClassroom, isPending } = useDeleteClassroom();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    deleteClassroom(classroom.id);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg dark:hover:from-gray-800 dark:hover:to-gray-700 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group">
        <CardHeader>
          <div className="flex items-center justify-between pb-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="h-5 w-5 cursor-pointer dark:text-gray-400 text-gray-600  dark:hover:text-yellow-400 hover:text-blue-600 transition-colors" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDialogOpen(true)}
                  className="text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardTitle
            className="text-lg cursor-pointer  dark:text-white text-gray-800 dark:hover:text-yellow-400 hover:text-blue-600 transition-colors"
            onClick={() => router.push(`/classroom/${classroom.id}`)}
          >
            {classroom.name}
          </CardTitle>
          <CardDescription className=" dark:text-gray-400 text-gray-600">
            {classroom.subject}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm  dark:text-gray-300 text-gray-700">
            <Users className="h-6 w-6  dark:text-yellow-500 text-blue-500" />
            <span className="font-semibold  dark:text-yellow-400 text-blue-600">
              {classroom.studentsCount} students
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm  ">
            <Calendar className="h-6 w-6 dark:text-yellow-500 text-blue-500" />
            <span className="font-semibold  dark:text-yellow-400 text-blue-600">
              {classroom.days.join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm  dark:text-gray-300 text-gray-700">
            <Wallet className="h-6 w-6  dark:text-yellow-500 text-blue-500" />
            <span className="font-semibold  dark:text-yellow-400 text-blue-600">
              {classroom.totalMonthlyFee} bdt/month
            </span>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the classroom &quot;{classroom.name}
              &quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditClassroomModal
        classroom={classroom}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
