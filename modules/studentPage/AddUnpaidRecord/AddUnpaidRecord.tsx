"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UnpaidRecordFormValues,
  unpaidRecordSchema,
  months,
  generateYears,
  formatMonthYear,
} from "./AddUnpaidRecord.helpers";
import { useAddUnpaidRecord } from "../hooks/useAddUnpaidRecord";
import { IUnpaidRecord } from "@/types/unpaidRecord";
import { useUpdateUnpaidRecord } from "../hooks/useUpdateUnpaidRecord";

export const AddUnpaidRecordModal = ({
  studentId,
  open,
  onOpenChange,
  editingRecord,
}: {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord?: IUnpaidRecord | null;
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const availableYears = generateYears();

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UnpaidRecordFormValues>({
    resolver: zodResolver(unpaidRecordSchema),
    defaultValues: {
      unpaidMonths: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (editingRecord && open) {
      setSelectedMonths(editingRecord.unpaidMonths);
      setValue("unpaidMonths", editingRecord.unpaidMonths);
    }
  }, [editingRecord, open, setValue]);

  const { mutate: addUnpaidRecord, isPending } = useAddUnpaidRecord(studentId);
  const { mutate: updateUnpaidRecord, isPending: isEditPending } =
    useUpdateUnpaidRecord(studentId);

  const addMonth = (month: number, year: number) => {
    const monthYear = formatMonthYear(month, year);
    if (!selectedMonths.includes(monthYear)) {
      const newSelectedMonths = [...selectedMonths, monthYear];
      setSelectedMonths(newSelectedMonths);
      setValue("unpaidMonths", newSelectedMonths, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    setSelectedMonth(null);
  };

  const removeMonth = (monthYear: string) => {
    const newSelectedMonths = selectedMonths.filter(
      (selected) => selected !== monthYear
    );
    setSelectedMonths(newSelectedMonths);
    setValue("unpaidMonths", newSelectedMonths, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (data: UnpaidRecordFormValues) => {
    const recordPayload = {
      unpaidMonths: data.unpaidMonths,
      studentId,
    };

    if (editingRecord) {
      updateUnpaidRecord(
        { studentId, payload: { ...editingRecord, ...recordPayload } },
        {
          onSuccess: () => {
            onOpenChange(false);
            resetForm();
          },
        }
      );
    } else {
      addUnpaidRecord(recordPayload, {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
        },
      });
    }
  };

  const resetForm = () => {
    reset();
    setSelectedMonths([]);
    setSelectedYear(currentYear);
    setSelectedMonth(null);
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
        className="sm:max-w-[600px] max-w-[90vw]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="font-bold sm:text-2xl text-xl text-center sm:pb-8 pb-4">
          Add Unpaid Record
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Label className="sm:text-xl text-lg">Select Unpaid Months</Label>

            {/* Selected months display */}
            {selectedMonths.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Selected Months ({selectedMonths.length})
                </Label>
                <div className="flex flex-wrap gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg min-h-[50px]">
                  {selectedMonths.map((monthYear) => (
                    <div
                      key={monthYear}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      <span>{monthYear}</span>
                      <button
                        type="button"
                        onClick={() => removeMonth(monthYear)}
                        className="hover:bg-primary-foreground/20 rounded-full p-1 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Month and Year selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Month Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Month</Label>
                <Select
                  value={selectedMonth?.toString()}
                  onValueChange={(value) => {
                    const month = parseInt(value);
                    setSelectedMonth(month);
                    addMonth(month, selectedYear);
                  }}
                >
                  <SelectTrigger className="border-2 border-foreground cursor-pointer w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                        className="cursor-pointer"
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Selection */}
              <div className="space-y-2 w0fu">
                <Label className="text-sm font-medium">Year</Label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => {
                    const year = parseInt(value);
                    setSelectedYear(year);
                    if (selectedMonth !== null) {
                      addMonth(selectedMonth, year);
                    }
                  }}
                >
                  <SelectTrigger className="border-2 border-foreground cursor-pointer w-full">
                    <SelectValue
                      placeholder="Select year"
                      className="cursor-pointer"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem
                        key={year}
                        value={year.toString()}
                        className="cursor-pointer"
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {errors.unpaidMonths && (
              <p className="text-sm text-red-500">
                {errors.unpaidMonths.message}
              </p>
            )}
          </div>

          {/* Quick selection buttons */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Quick Select
            </Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  const lastThreeMonths = [];
                  for (let i = 0; i < 3; i++) {
                    const date = new Date(
                      currentYear,
                      currentDate.getMonth() - i,
                      1
                    );
                    const monthYear = formatMonthYear(
                      date.getMonth(),
                      date.getFullYear()
                    );
                    if (!selectedMonths.includes(monthYear)) {
                      lastThreeMonths.push(monthYear);
                    }
                  }

                  const newSelectedMonths = [
                    ...selectedMonths,
                    ...lastThreeMonths,
                  ];
                  setSelectedMonths(newSelectedMonths);
                  setValue("unpaidMonths", newSelectedMonths, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                Last 3 Months
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  setSelectedMonths([]);
                  setValue("unpaidMonths", [], {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="submit"
              disabled={isPending || !isDirty || selectedMonths.length === 0}
              className="cursor-pointer"
            >
              {isPending || isEditPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditPending ? "Updating..." : "Adding..."}
                </span>
              ) : editingRecord ? (
                "Update"
              ) : (
                "Add"
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
