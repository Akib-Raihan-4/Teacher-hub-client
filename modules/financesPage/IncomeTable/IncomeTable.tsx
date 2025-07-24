"use client";
import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchIcon, CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Loader from "@/components/shared/loader/Loader";
import { useGetIncomes } from "../hooks/useGetIncomes";
import { useDebounce } from "@/modules/classroomPage/hooks/useDebounce";
import { IIncomeWithSource } from "@/types/finances";
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
import { useDeleteIncome } from "../hooks/useDeleteIncome";
import { EditIncomeFormModal } from "../EditIncomeFormModal/EditIncomeFormModal";
import { Badge } from "@/components/ui/badge";

export default function IncomeTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [activeDateFrom, setActiveDateFrom] = useState<string>();
  const [activeDateTo, setActiveDateTo] = useState<string>();
  const limit = 3;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { mutate: deleteIncome, isPending } = useDeleteIncome();

  useEffect(() => {
    setPage(1);
    setActiveSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setPage(1);
    setActiveDateFrom(dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined);
  }, [dateFrom]);

  useEffect(() => {
    setPage(1);
    setActiveDateTo(dateTo ? format(dateTo, "yyyy-MM-dd") : undefined);
  }, [dateTo]);

  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useGetIncomes(
    { page, limit },
    activeSearch,
    activeDateFrom,
    activeDateTo
  );

  const handleDelete = () => {
    if (selectedId) {
      deleteIncome(selectedId);
      setSelectedId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const columns = useMemo<ColumnDef<IIncomeWithSource>[]>(
    () => [
      {
        accessorKey: "date",
        header: () => (
          <div className="w-[120px] pl-2 dark:text-black">Date</div>
        ),
        cell: ({ row }) => {
          const rawDate = row.getValue("date") as string;
          const formattedDate = format(new Date(rawDate), "MMM dd, yyyy");

          return (
            <div className="pl-2">
              <Badge>{formattedDate}</Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "source.name",
        header: () => <div className="w-[140px] dark:text-black">Source</div>,
        cell: ({ row }) => row.original.source?.name || "N/A",
      },
      {
        accessorKey: "description",
        header: () => (
          <div className="w-[200px] dark:text-black">Description</div>
        ),
        cell: ({ row }) => (
          <div
            className="sm:max-w-[200px] truncate whitespace-nowrap hover:whitespace-normal break-words py-6"
            title={row.getValue("description")}
          >
            {row.getValue("description") || "No description"}
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-center dark:text-black">Amount</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          return (
            <div className="text-center font-medium">
              {amount.toFixed(2)} bdt
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="text-center dark:text-black">Actions</div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <EditIncomeFormModal income={row.original} />
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={() => {
                setSelectedId(row.original.id);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const incomes = response?.data || [];
  const pagination = response?.pagination || {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    perPage: limit,
    hasNextPage: false,
  };

  const table = useReactTable({
    data: incomes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  const handlePageChange = (newPage: number) => {
    if (!isFetching) {
      setPage(newPage);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[20rem]">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const hasActiveFilters = activeSearch || activeDateFrom || activeDateTo;

  return (
    <>
      <div className="mb-14">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
            <div className="relative flex-1 w-full sm:max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 shadow-xl h-10 w-full"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[140px] justify-start text-left font-normal shadow-xl",
                      !dateFrom && "text-muted-foreground "
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[140px] justify-start text-left font-normal shadow-xl",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "MMM dd") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    disabled={(date) => (dateFrom ? date < dateFrom : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="whitespace-nowrap"
              >
                Clear All
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {activeSearch && (
                <span className="bg-secondary px-2 py-1 rounded">
                  Source: &quot;{activeSearch}&quot;
                </span>
              )}
              {activeDateFrom && (
                <span className="bg-secondary px-2 py-1 rounded">
                  From: {format(new Date(activeDateFrom), "MMM dd, yyyy")}
                </span>
              )}
              {activeDateTo && (
                <span className="bg-secondary px-2 py-1 rounded">
                  To: {format(new Date(activeDateTo), "MMM dd, yyyy")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[10rem]">
            <Loader />
          </div>
        ) : incomes.length === 0 ? (
          <div className="flex justify-center items-center min-h-[20rem]">
            <p className="text-gray-500">
              {hasActiveFilters
                ? "No incomes found matching your filters"
                : "No incomes recorded"}
            </p>
          </div>
        ) : (
          <>
            <div
              className={`${
                isFetching ? "opacity-50" : ""
              } transition-opacity shadow-2xl rounded-2xl mb-6 overflow-x-auto border`}
            >
              <Table className="w-full table-fixed min-w-[700px]">
                <TableHeader className="bg-gray-200">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-4 flex justify-between gap-2 items-start sm:items-center text-sm text-muted-foreground px-2">
              <div>
                Showing {incomes.length} of {pagination.total} incomes
              </div>
              <div className="font-medium">
                Total: $
                {incomes
                  .reduce((sum, income) => sum + income.amount, 0)
                  .toFixed(2)}
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.currentPage > 1 && !isFetching) {
                            handlePageChange(pagination.currentPage - 1);
                          }
                        }}
                        className={
                          pagination.currentPage <= 1 || isFetching
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {(() => {
                      const pages = [];
                      const totalPages = pagination.totalPages;
                      const currentPage = pagination.currentPage;

                      if (totalPages > 0) {
                        pages.push(
                          <PaginationItem key={1}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isFetching) handlePageChange(1);
                              }}
                              isActive={currentPage === 1}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      if (currentPage > 3) {
                        pages.push(
                          <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      const startPage = Math.max(2, currentPage - 1);
                      const endPage = Math.min(totalPages - 1, currentPage + 1);

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isFetching) handlePageChange(i);
                              }}
                              isActive={currentPage === i}
                            >
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      if (currentPage < totalPages - 2) {
                        pages.push(
                          <PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      if (totalPages > 1) {
                        pages.push(
                          <PaginationItem key={totalPages}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isFetching) handlePageChange(totalPages);
                              }}
                              isActive={currentPage === totalPages}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      return pages;
                    })()}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            pagination.currentPage < pagination.totalPages &&
                            !isFetching
                          ) {
                            handlePageChange(pagination.currentPage + 1);
                          }
                        }}
                        className={
                          pagination.currentPage >= pagination.totalPages ||
                          isFetching
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this income?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the
              income from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
