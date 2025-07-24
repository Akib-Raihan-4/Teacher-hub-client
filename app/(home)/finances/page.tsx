import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddExpenseFormModal } from "@/modules/financesPage/AddExpenseFormModal/AddExpenseFormModal";
import { AddIncomeFormModal } from "@/modules/financesPage/AddIncomeFormModal/AddIncomeFormModal";
import ExpenseTable from "@/modules/financesPage/ExpenseTable/ExpenseTable";
import IncomeTable from "@/modules/financesPage/IncomeTable/IncomeTable";

export default function FinancesPage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-4xl font-bold mb-2">Financial Tracker</h1>
        <p className="text-lg font-semibold mb-8 text-gray-500 ">
          Track your teaching income and expenses
        </p>
      </div>
      <Tabs defaultValue="expense">
        <TabsList className="mb-4 w-full py-8 px-0 shadow-xl">
          <TabsTrigger value="expense" className="cursor-pointer py-8">
            Expense
          </TabsTrigger>
          <TabsTrigger value="income" className="cursor-pointer py-8">
            Income
          </TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Expenses</h1>
            <AddExpenseFormModal />
          </div>
          <ExpenseTable />
        </TabsContent>
        <TabsContent value="income">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Income</h1>
            <AddIncomeFormModal />
          </div>
          <IncomeTable />
        </TabsContent>
      </Tabs>
    </>
  );
}
