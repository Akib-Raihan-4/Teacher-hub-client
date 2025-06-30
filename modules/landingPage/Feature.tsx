import { Card, CardContent } from "@/components/ui/card";
import { Calculator, DollarSign, Mail, Users } from "lucide-react";

export default function Features() {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <Card className="border border-border hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600 dark:text-yellow-500" />
            </div>
            <h3 className="font-semibold mb-2">Manage Students</h3>
            <p className="text-sm text-muted-foreground">
              Create classrooms and organize student details
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-yellow-500" />
            </div>
            <h3 className="font-semibold mb-2">Track Fees</h3>
            <p className="text-sm text-muted-foreground">
              Set monthly fees and monitor payments
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-blue-600 dark:text-yellow-500" />
            </div>
            <h3 className="font-semibold mb-2">Auto Reminders</h3>
            <p className="text-sm text-muted-foreground">
              Automatic payment reminders to parents
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-yellow-500/30">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-6 w-6 text-blue-600 dark:text-yellow-500" />
            </div>
            <h3 className="font-semibold mb-2">Track Expenses</h3>
            <p className="text-sm text-muted-foreground">
              Monitor costs and financial insights
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
