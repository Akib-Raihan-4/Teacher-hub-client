"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, X, Check, Pencil } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetIncomeSources } from "../hooks/useGetIncomeSource";
import { useUpdateIncome } from "../hooks/useUpdateIncome";
import { IIncomeWithSource } from "@/types/finances";

const schema = z.object({
  sourceId: z.string().min(1, "Source is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive(),
  description: z.string().min(1),
  date: z.date(),
});

type FormValues = z.infer<typeof schema>;

export const EditIncomeFormModal = ({
  income,
}: {
  income: IIncomeWithSource;
}) => {
  const [open, setOpen] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);

  const { data: sources = [] } = useGetIncomeSources();
  const { mutate: updateIncome, isPending: updating } = useUpdateIncome();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      description: "",
      sourceId: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (open && income) {
      reset({
        amount: income.amount,
        description: income.description,
        sourceId: income.incomeSourceId,
        date: new Date(income.date),
      });
    }
  }, [open, income, reset]);

  const selectedSource = sources.find((cat) => cat.id === watch("sourceId"));

  const onSubmit = (data: FormValues) => {
    updateIncome(
      {
        incomeId: income.id,
        payload: {
          amount: data.amount,
          description: data.description,
          date: new Date(
            Date.UTC(
              data.date.getFullYear(),
              data.date.getMonth(),
              data.date.getDate()
            )
          ),
          incomeSourceId: data.sourceId,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 w-8">
          <Pencil className="!w-4 !h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-6">
        <DialogTitle className="text-2xl font-bold text-center mb-6">
          Edit Income
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Source Selector */}
          <div className="space-y-2">
            <Label>Source</Label>
            <Popover
              open={sourceDropdownOpen}
              onOpenChange={setSourceDropdownOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between border-2",
                    !watch("sourceId") && "text-gray-400"
                  )}
                >
                  <span>
                    {selectedSource ? selectedSource.name : "Select a source"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="max-h-60 overflow-y-auto">
                  {sources.map((cat) => (
                    <div
                      key={cat.id}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                        watch("sourceId") === cat.id &&
                          "bg-gray-200 dark:bg-gray-800"
                      )}
                      onClick={() => {
                        setValue("sourceId", cat.id, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        trigger("sourceId"); // Fix validation
                        setSourceDropdownOpen(false);
                      }}
                    >
                      <span>{cat.name}</span>
                      {watch("sourceId") === cat.id && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {errors.sourceId && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <X className="w-3 h-3" />
                {errors.sourceId.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
                className="pl-2 border-2"
              />
              <span className="absolute right-10  top-1/2 -translate-y-1/2">
                bdt
              </span>
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <X className="w-3 h-3" />
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              {...register("description")}
              className="border-2 rounded-xl w-full p-4"
              placeholder="What was this income for?"
            />
            {errors.description && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <X className="w-3 h-3" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left border-2",
                    !watch("date") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("date") ? format(watch("date"), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("date")}
                  onSelect={(date) => date && setValue("date", date)}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <X className="w-3 h-3" />
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="submit" disabled={!isDirty || updating}>
              {updating ? "Updating..." : "Update"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
