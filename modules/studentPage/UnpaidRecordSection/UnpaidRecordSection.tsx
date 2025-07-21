import Loader from "@/components/shared/loader/Loader";
import { useGetUnpaidRecord } from "../hooks/useGetUnpaidRecord";
import { AddUnpaidRecordModal } from "../AddUnpaidRecord/AddUnpaidRecord";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IUnpaidRecord } from "@/types/unpaidRecord";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useDeleteUnpaidRecord } from "../hooks/useDeleteUnpaidRecord";

export default function UnpaidRecordSection({
  studentId,
}: {
  studentId: string;
}) {
  const { data: unpaidData, isLoading, error } = useGetUnpaidRecord(studentId);
  const { mutate: deleteUnpaidRecord, isPending: isDeleting } =
    useDeleteUnpaidRecord(studentId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IUnpaidRecord | null>(
    null
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (error) {
    return (
      <div className="flex justify-center items-center md:min-h-[40rem] min-h-[20rem]">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const handleEdit = (record: IUnpaidRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = (studentId: string) => {
    deleteUnpaidRecord(studentId);
    setConfirmDeleteOpen(false);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingRecord(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[10rem]">
          <Loader />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex mt-4 justify-between items-center">
            <h2 className="sm:text-4xl text-2xl font-bold">Unpaid Record</h2>
            <Button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 cursor-pointer p-4 rounded-3xl sm:w-56 w-42 text-white"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="!w-5 !h-5" />
              <span className="font-bold sm:text-lg text-sm">
                Add Unpaid Record
              </span>
            </Button>
          </div>

          {/* Unpaid Records Display */}
          <div className="space-y-4 mb-7">
            {unpaidData &&
            unpaidData.unpaidMonths &&
            unpaidData.unpaidMonths.length > 0 ? (
              <div className="w-full">
                <div className="grid gap-4 md:grid-cols-1">
                  <Card className="relative gap-1">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          Unpaid Months ({unpaidData.unpaidMonths.length})
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(unpaidData)}
                            className="cursor-pointer p-2 h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete()}
                            className="cursor-pointer p-2 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground"></p>
                          <div className="flex flex-wrap gap-2">
                            {unpaidData.unpaidMonths.map(
                              (month: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 w-30 h-8"
                                >
                                  {month}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>

                        {unpaidData.updatedAt && (
                          <div className="text-xs text-muted-foreground">
                            Updated:{" "}
                            {new Date(
                              unpaidData.updatedAt
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-6xl">📋</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        No Unpaid Records
                      </h3>
                      <p className="text-muted-foreground">
                        This student has no unpaid records yet.
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="cursor-pointer"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Record
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <AddUnpaidRecordModal
        studentId={studentId}
        open={isModalOpen}
        onOpenChange={handleModalClose}
        editingRecord={editingRecord}
      />

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this unpaid record?
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleConfirmDelete(studentId)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
