import { useMemo, useState } from "react";
import { useGetPayments } from "../hooks/useGetPayments";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import Loader from "@/components/shared/loader/Loader";
import { Button } from "@/components/ui/button";
import { IPaymentResponse } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
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
import { useDeletePayment } from "../hooks/useDeletePayment";
import { UpdatePaymentFormModal } from "../UpdatePaymentFormModal/UpdatePaymentFormModal";

export default function PaymentSection({ studentId }: { studentId: string }) {
  const { data: paymentsData, isLoading, error } = useGetPayments(studentId);
  const [editingPayment, setEditingPayment] = useState<IPaymentResponse | null>(
    null
  );
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(
    null
  );

  const { mutate: deletePaymentMutation, isPending } = useDeletePayment(
    deletingPaymentId ?? "",
    studentId
  );

  const handleConfirmDelete = () => {
    if (deletingPaymentId) {
      deletePaymentMutation(deletingPaymentId);
      setDeletingPaymentId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingPaymentId(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDeletingPaymentId(null);
    }
  };

  const handleUpdateSuccess = () => {
    setEditingPayment(null);
  };

  const columns = useMemo<ColumnDef<IPaymentResponse>[]>(
    () => [
      {
        header: "For Month",
        accessorKey: "forMonth",
        cell: ({ row }) => (
          <Badge className="font-semibold text-md">
            {format(new Date(row.original.forMonth), "MMMM yyyy")}
          </Badge>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ row }) => (
          <span className="font-semibold text-green-600">
            <h1 className="text-lg">{row.original.amount} bdt</h1>
          </span>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingPayment(row.original)}
              className="cursor-pointer text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
            >
              <Edit2 className="!h-5 !w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeletingPaymentId(row.original.id)}
              className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="!h-5 !w-5" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: paymentsData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[10rem]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error: {error.message}
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingPaymentId} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              payment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelDelete}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpdatePaymentFormModal
        payment={editingPayment}
        studentId={studentId}
        open={!!editingPayment}
        onOpenChange={(open) => {
          if (!open) setEditingPayment(null);
        }}
        onSuccess={handleUpdateSuccess}
      />

      {/* Payments Table */}
      <div className="shadow-lg rounded-xl border-0 mb-14">
        <div className="p-0">
          {paymentsData && paymentsData.length > 0 ? (
            <div className="overflow-hidden rounded-lg">
              <table className="w-full">
                <thead className="bg-gradient-to-r dark:from-gray-50 dark:to-gray-100 from-gray-100 to-gray:200 border-b">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-left p-4 font-semibold text-gray-600"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 py-8 text-gray-700">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center bg-gray-100 rounded-full p-6 mb-4">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Payment Records
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                This student has no payments recorded yet. Add a payment to get
                started.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
