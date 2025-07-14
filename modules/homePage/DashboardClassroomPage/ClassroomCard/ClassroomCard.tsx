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

export default function ClassroomCard({
  classroom,
}: {
  classroom: IClassroomExtendedResponse;
}) {
  const { mutate: deleteClassroom, isPending } = useDeleteClassroom();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteClassroom(classroom.id);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="dark:bg-neutral-600 shadow-2xl dark:border-gray-600 hover:dark:bg-neutral-700 hover:bg-neutral-100 transition-all duration-300  group">
        <CardHeader>
          <div className="flex items-center justify-between pb-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="h-5 w-5 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setIsEditDialogOpen(true)} // Open edit modal
                >
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
