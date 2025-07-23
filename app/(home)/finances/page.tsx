import ExpenseTable from "@/modules/financesPage/ExpenseTable/ExpenseTable";

export default function FinancesPage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-4xl font-bold mb-2">Financial Tracker</h1>
        <p className="text-lg font-semibold mb-8 text-gray-500 ">
          Track your teaching income and expenses
        </p>
      </div>
      <h1 className="text-4xl font-bold mb-8">Expenses</h1>
      <ExpenseTable />
    </>
  );
}
