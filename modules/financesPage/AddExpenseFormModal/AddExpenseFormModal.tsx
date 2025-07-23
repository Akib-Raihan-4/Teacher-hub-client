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
import { useAddExpense } from "../hooks/useAddExpense";
import { useAddExpenseCategory } from "../hooks/useAddExpenseCategory";
import { useGetExpenseCategories } from "../hooks/useGetExpenseCategory";
import { useDeleteExpenseCategory } from "../hooks/useDeleteExpenseCategory";

const schema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.date({ required_error: "Date is required" }),
  newCategory: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof schema>;

export const AddExpenseFormModal = () => {
  const [open, setOpen] = useState(false);
  const [addCategoryMode, setAddCategoryMode] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const { data: categories = [] } = useGetExpenseCategories();
  const { mutate: addExpense, isPending: addingExpense } = useAddExpense();
  const { mutate: addCategory, isPending: addingCategory } =
    useAddExpenseCategory();
  const { mutate: deleteCategory, isPending: deletingCategory } =
    useDeleteExpenseCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      description: "",
      categoryId: "",
      date: new Date(),
      newCategory: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: ExpenseFormValues) => {
    const payload = {
      categoryId: data.categoryId,
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

    addExpense(payload, {
      onSuccess: () => {
        reset();
        setOpen(false);
        setAddCategoryMode(false);
      },
    });
  };

  const handleAddCategory = () => {
    const name = watch("newCategory");
    if (!name) return;

    addCategory(
      { name },
      {
        onSuccess: (newCat) => {
          setValue("categoryId", newCat.id, { shouldValidate: true });
          setValue("newCategory", "");
          setAddCategoryMode(false);
        },
      }
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId, {
      onSuccess: () => {
        // If the deleted category was selected, clear the selection
        if (watch("categoryId") === categoryId) {
          setValue("categoryId", "");
        }
      },
    });
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === watch("categoryId")
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset();
          setAddCategoryMode(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 cursor-pointer p-4 rounded-3xl sm:w-56 w-40 text-white">
          <Plus className="!w-6 !h-6" />
          <span className="font-semibold text-sm sm:text-lg">Add Expense</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-6">
        <DialogTitle className="text-2xl font-bold text-center mb-6 bg-gradient-to-r bg-clip-text ">
          Add New Expense
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Select or Add */}
          {!addCategoryMode ? (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category
              </Label>

              {/* Custom Category Dropdown */}
              <Popover
                open={categoryDropdownOpen}
                onOpenChange={setCategoryDropdownOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between border-2 border-gray-200 hover:border-blue-400",
                      !watch("categoryId") && "text-gray-400"
                    )}
                  >
                    <div className="flex items-center">
                      {selectedCategory ? (
                        <span className="font-medium">
                          {selectedCategory.name}
                        </span>
                      ) : (
                        "Select a category"
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="max-h-60 overflow-y-auto">
                    {categories.length === 0 && (
                      <p className="text-sm p-4">No categories available</p>
                    )}
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className={cn(
                          "flex items-center justify-between p-3 dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer",
                          watch("categoryId") === cat.id &&
                            "dark:bg-gray-800 bg-gray-200 "
                        )}
                        onClick={() => {
                          setValue("categoryId", cat.id);
                          trigger("categoryId");
                          setCategoryDropdownOpen(false);
                        }}
                      >
                        <span className="font-medium">{cat.name}</span>
                        <div className="flex items-center gap-2">
                          {watch("categoryId") === cat.id && (
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
                                  Delete Category
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
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deletingCategory}
                                >
                                  {deletingCategory ? "Deleting..." : "Delete"}
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
                        setAddCategoryMode(true);
                        setCategoryDropdownOpen(false);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add new category
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {errors.categoryId && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <X className="w-3 h-3" />
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                New Category Name
              </Label>
              <div className="relative">
                <Input
                  placeholder="Enter category name"
                  {...register("newCategory")}
                  className="border-2 border-gray-200 focus:border-blue-400 transition-colors pl-10"
                />
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={addingCategory || !watch("newCategory")}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  {addingCategory ? "Adding..." : "Add Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setAddCategoryMode(false);
                    setValue("newCategory", "");
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
              placeholder="What was this expense for?"
              {...register("description")}
              className="border-2 rounded-2xl p-2 border-gray-200 focus:border-blue-400 transition-colors w-full"
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
              disabled={!isValid || addingExpense}
              className="px-6"
            >
              {addingExpense ? "Adding..." : "Add Expense"}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
                setAddCategoryMode(false);
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
