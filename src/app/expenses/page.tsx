import { prisma } from "@/lib/prisma";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
    const expenses = await prisma.expense.findMany({
        orderBy: {
            date: "desc",
        },
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                <AddExpenseDialog />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell>{format(new Date(expense.date), "dd MMM yyyy")}</TableCell>
                                <TableCell className="font-medium">{expense.title}</TableCell>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell className="text-right text-red-500 font-semibold">
                                    -₹{expense.amount.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {expenses.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No expenses recorded.
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow className="bg-muted/50 font-bold">
                            <TableCell colSpan={4} className="text-right">Total Expenses</TableCell>
                            <TableCell className="text-right text-red-600">-₹{totalExpenses.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
