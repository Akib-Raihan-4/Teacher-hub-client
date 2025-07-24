"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, CalendarIcon, X, Tag, ChevronDown, Check } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useAddIncome } from "../hooks/useAddIncome";
import { useAddIncomeSource } from "../hooks/useAddIncomeSource";
import { useGetIncomeSources } from "../hooks/useGetIncomeSource";
import { useDeleteIncomeSource } from "../hooks/useDeleteIncomeSource";

const schema = z.object({
  incomeSourceId: z.string().min(1, "Source is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.date({ required_error: "Date is required" }),
  newSource: z.string().optional(),
});

type IncomeFormValues = z.infer<typeof schema>;

export const AddIncomeFormModal = () => {
  const [open, setOpen] = useState(false);
  const [addSourceMode, setAddSourceMode] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);

  const { data: sources = [] } = useGetIncomeSources();
  const { mutate: addIncome, isPending: addingIncome } = useAddIncome();
  const { mutate: addSource, isPending: addingSource } = useAddIncomeSource();
  const { mutate: deleteSource, isPending: deletingSource } =
    useDeleteIncomeSource();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<IncomeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      description: "",
      incomeSourceId: "",
      date: new Date(),
      newSource: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: IncomeFormValues) => {
    const payload = {
      incomeSourceId: data.incomeSourceId,
      amount: data.amount,
      description: data.description,
      date: new Date(
        Date.UTC(
          data.date.getFullYear(),
          data.date.getMonth(),
          data.date.getDate()
        )
      ),
    };

    addIncome(payload, {
      onSuccess: () => {
        reset();
        setOpen(false);
        setAddSourceMode(false);
      },
    });
  };

  const handleAddSource = () => {
    const name = watch("newSource");
    if (!name) return;

    addSource(
      { name },
      {
        onSuccess: (newCat) => {
          setValue("incomeSourceId", newCat.id, { shouldValidate: true });
          setValue("newSource", "");
          setAddSourceMode(false);
        },
      }
    );
  };

  const handleDeleteSource = (incomeSourceId: string) => {
    deleteSource(incomeSourceId, {
      onSuccess: () => {
        // If the deleted source was selected, clear the selection
        if (watch("incomeSourceId") === incomeSourceId) {
          setValue("incomeSourceId", "");
        }
      },
    });
  };

  const selectedSource = sources.find(
    (cat) => cat.id === watch("incomeSourceId")
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset();
          setAddSourceMode(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 cursor-pointer p-4 rounded-3xl sm:w-56 w-40 text-white">
          <Plus className="!w-6 !h-6" />
          <span className="font-semibold text-sm sm:text-lg">Add Income</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-6">
        <DialogTitle className="text-2xl font-bold text-center mb-6 bg-gradient-to-r bg-clip-text ">
          Add New Income
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Source Select or Add */}
          {!addSourceMode ? (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Source
              </Label>

              {/* Custom Source Dropdown */}
              <Popover
                open={sourceDropdownOpen}
                onOpenChange={setSourceDropdownOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between border-2 border-gray-200 hover:border-blue-400",
                      !watch("incomeSourceId") && "text-gray-400"
                    )}
                  >
                    <div className="flex items-center">
                      {selectedSource ? (
                        <span className="font-medium">
                          {selectedSource.name}
                        </span>
                      ) : (
                        "Select a source"
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="max-h-60 overflow-y-auto">
                    {sources.length === 0 && (
                      <p className="text-sm p-4">No sources available</p>
                    )}
                    {sources.map((cat) => (
                      <div
                        key={cat.id}
                        className={cn(
                          "flex items-center justify-between p-3 dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer",
                          watch("incomeSourceId") === cat.id &&
                            "dark:bg-gray-800 bg-gray-200 "
                        )}
                        onClick={() => {
                          setValue("incomeSourceId", cat.id);
                          trigger("incomeSourceId");
                          setSourceDropdownOpen(false);
                        }}
                      >
                        <span className="font-medium">{cat.name}</span>
                        <div className="flex items-center gap-2">
                          {watch("incomeSourceId") === cat.id && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Source
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;
                                  {cat.name}&quot;? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSource(cat.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deletingSource}
                                >
                                  {deletingSource ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start "
                      onClick={() => {
                        setAddSourceMode(true);
                        setSourceDropdownOpen(false);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add new source
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {errors.incomeSourceId && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <X className="w-3 h-3" />
                  {errors.incomeSourceId.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                New Source Name
              </Label>
              <div className="relative">
                <Input
                  placeholder="Enter source name"
                  {...register("newSource")}
                  className="border-2 border-gray-200 focus:border-blue-400 transition-colors pl-10"
                />
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddSource}
                  disabled={addingSource || !watch("newSource")}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  {addingSource ? "Adding..." : "Add Source"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setAddSourceMode(false);
                    setValue("newSource", "");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Amount
            </Label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
                className="pl-2 border-2 border-gray-200 focus:border-blue-400 transition-colors"
              />
              <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
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
            <Label className="text-sm font-semibold text-gray-700">
              Description
            </Label>
            <textarea
              placeholder="What was this income for?"
              {...register("description")}
              className="border-2 rounded-2xl p-4 border-gray-200 focus:border-blue-400 transition-colors w-full"
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
            <Label className="text-sm font-semibold text-gray-700">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-2 border-gray-200 hover:border-blue-400 transition-colors",
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

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={!isValid || addingIncome}
              className="px-6"
            >
              {addingIncome ? "Adding..." : "Add Income"}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
                setAddSourceMode(false);
              }}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
