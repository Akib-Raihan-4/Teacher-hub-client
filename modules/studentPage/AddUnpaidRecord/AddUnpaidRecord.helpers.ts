import { z } from "zod";

export const unpaidRecordSchema = z.object({
  unpaidMonths: z
    .array(z.string())
    .min(1, "At least one month must be selected"),
});

export type UnpaidRecordFormValues = z.infer<typeof unpaidRecordSchema>;

export interface MonthYear {
  month: number;
  year: number;
  label: string;
  value: string;
}

export const months = [
  { value: 0, label: "January", short: "Jan" },
  { value: 1, label: "February", short: "Feb" },
  { value: 2, label: "March", short: "Mar" },
  { value: 3, label: "April", short: "Apr" },
  { value: 4, label: "May", short: "May" },
  { value: 5, label: "June", short: "Jun" },
  { value: 6, label: "July", short: "Jul" },
  { value: 7, label: "August", short: "Aug" },
  { value: 8, label: "September", short: "Sep" },
  { value: 9, label: "October", short: "Oct" },
  { value: 10, label: "November", short: "Nov" },
  { value: 11, label: "December", short: "Dec" },
];

export const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 2; year <= currentYear + 2; year++) {
    years.push(year);
  }
  return years;
};

export const generateMonthYearOptions = (): MonthYear[] => {
  const options: MonthYear[] = [];
  const years = generateYears();

  years.forEach((year) => {
    months.forEach((month) => {
      new Date(year, month.value, 1);
      const label = `${month.label} ${year}`;
      const value = `${month.label} ${year}`;

      options.push({
        month: month.value,
        year,
        label,
        value,
      });
    });
  });

  return options.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
};

export const formatMonthYear = (month: number, year: number): string => {
  const monthName = months.find((m) => m.value === month)?.label || "";
  return `${monthName} ${year}`;
};
