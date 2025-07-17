"use client";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IStudentPaymentDetails } from "@/types/student";
import { CheckCircle, Ellipsis, Mail, Phone, Wallet2 } from "lucide-react";
import { useState } from "react";
import { useRemoveStudent } from "../hooks/useRemoveStudent";
import { EditStudentFormModal } from "../EditStudentFormModal/EditStudentFormModal";
import { CreatePaymentFormModal } from "../CreatePaymentFormModal/CreatePaymentFormModal";
import { useRouter } from "next/navigation";

const getPaymentStatusBadge = (status: boolean) => {
  if (status) {
    return <Badge className="bg-green-600 text-white">Paid</Badge>;
  } else {
    return <Badge className="bg-red-600 text-white">Due</Badge>;
  }
};

export default function StudentCard({
  student,
  classroomId,
}: {
  student: IStudentPaymentDetails;
  classroomId: string;
}) {
  const { mutate: removeStudent, isPending } = useRemoveStudent(classroomId);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    removeStudent(student.id);
    setIsDialogOpen(false);
  };
  return (
    <>
      <Card
        key={student.id}
        className=" bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 shadow-2xl hover:shadow-lg transition-all duration-300 mt-6"
      >
        <CardContent className="p-6 relative">
          <div className="absolute -top-3 right-7">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="h-5 w-5 cursor-pointer dark:text-gray-400 text-gray-600 dark:hover:text-yellow-400 hover:text-blue-600 transition-colors" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDialogOpen(true)}
                  className="text-red-500"
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Student Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold text-white">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold hover:cursor-pointer"
                    onClick={() => router.push(`/student/${student.id}`)}
                  >
                    {student.name}
                  </h3>
                  <p className="text-sm dark:text-gray-400 text-gray-600">
                    Joined {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 dark:text-gray-300 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2 dark:text-gray-300 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{student.parentPhone}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="lg:w-80">
              <div className="dark:bg-gray-800/60 bg-gray-100/80 p-4 rounded-lg border dark:border-gray-700 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm dark:text-gray-300 text-gray-600">
                    Payment Status
                  </span>
                  {getPaymentStatusBadge(student.paid)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="dark:text-gray-400 text-gray-500">
                      Monthly Fee:
                    </span>
                    <span className="dark:text-gray-100 text-gray-900 font-medium">
                      ${student.monthlyFee}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dark:text-gray-400 text-gray-500">
                      Amount Paid:
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      ${student.totalPaid}
                    </span>
                  </div>

                  {student.dueAmount > 0 ? (
                    <>
                      <div className="flex justify-between">
                        <span className="dark:text-gray-400 text-gray-500">
                          Due Amount:
                        </span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          ${student.dueAmount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="dark:text-gray-400 text-gray-500">
                          Due Months:
                        </span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          {student.unpaidMonths.join(", ")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="mt-4">
                  {student.paid ? (
                    <Button
                      size="sm"
                      disabled
                      className="w-full bg-green-600 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Paid
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                      onClick={() => setIsPaymentDialogOpen(true)}
                    >
                      <Wallet2 className="h-4 w-4 mr-1" />
                      Pay
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the student &quot;{student.name}
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

      <EditStudentFormModal
        classroomId={classroomId}
        student={student}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <CreatePaymentFormModal
        classroomId={classroomId}
        studentId={student.id}
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
      />
    </>
  );
}
