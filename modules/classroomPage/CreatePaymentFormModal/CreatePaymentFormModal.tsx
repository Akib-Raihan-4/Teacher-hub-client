"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentFormValues,
  paymentSchema,
} from "./CreatePaymentFormModal.helpers";
import { useCreatePayment } from "@/modules/classroomPage/hooks/useCreatePayment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const months = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 5; year <= currentYear + 5; year++) {
    years.push(year);
  }
  return years;
};

export const CreatePaymentFormModal = ({
  classroomId,
  studentId,
  open,
  onOpenChange,
}: {
  classroomId: string;
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear()
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      forMonth: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    },
    mode: "onChange",
  });

  const { mutate: createPayment, isPending } = useCreatePayment(
    studentId,
    classroomId
  );

  const forMonth = watch("forMonth");

  const handleMonthYearSelect = (month: number, year: number) => {
    const date = new Date(Date.UTC(year, month, 1));

    setValue("forMonth", date, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const onSubmit = (data: PaymentFormValues) => {
    createPayment(
      {
        studentId,
        amount: data.amount,
        forMonth: new Date(
          Date.UTC(data.forMonth.getFullYear(), data.forMonth.getMonth(), 1)
        ),
        status: "paid",
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
          setSelectedMonth(null);
          setSelectedYear(currentDate.getFullYear());
        },
      }
    );
  };

  const resetForm = () => {
    reset();
    setSelectedMonth(null);
    setSelectedYear(currentDate.getFullYear());
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent
        className="sm:max-w-[520px] max-w-[90vw]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="font-bold sm:text-2xl text-xl text-center sm:pb-8 pb-4">
          Payment
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="amount" className="sm:text-xl text-lg">
              Payment Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Payment Amount"
              {...register("amount", { valueAsNumber: true })}
              className="my-4 border-2 border-foreground"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="sm:text-xl text-lg">For Month</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-2 border-foreground",
                    !forMonth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {forMonth ? format(forMonth, "MMMM yyyy") : "Pick a month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="p-4 space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-1">
                      Select Month & Year
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Month Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Month</Label>
                      <Select
                        value={selectedMonth?.toString()}
                        onValueChange={(value) => {
                          const month = parseInt(value);
                          setSelectedMonth(month);
                          if (selectedYear !== null) {
                            handleMonthYearSelect(month, selectedYear);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem
                              key={month.value}
                              value={month.value.toString()}
                            >
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Year Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Year</Label>
                      <Select
                        value={selectedYear?.toString()}
                        onValueChange={(value) => {
                          const year = parseInt(value);
                          setSelectedYear(year);
                          if (selectedMonth !== null) {
                            handleMonthYearSelect(selectedMonth, year);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateYears().map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedMonth !== null && selectedYear !== null && (
                    <div className="mt-4 p-3 border rounded-lg">
                      <p className="text-sm text-center">
                        Selected:{" "}
                        <span className="font-semibold">
                          {months[selectedMonth].label} {selectedYear}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {errors.forMonth && (
              <p className="text-sm text-red-500">{errors.forMonth.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isPending || !isDirty}
              className="cursor-pointer"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                "Create"
              )}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
