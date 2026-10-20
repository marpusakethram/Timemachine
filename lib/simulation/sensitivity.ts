import { simulate } from "./engine";
import { Values } from "./models";
export const growthGrid = [0, 2, 4, 6, 8, 10, 12];
export function sensitivity(values: Values) {
  const expenses = [...new Set([0.5, 0.75, 1, 1.25, 1.5].map(f => Math.min(10000000, Math.round(Math.max(values.expenses, 1000) * f))))];
  return {
    growth: growthGrid.map(growth => ({ growth, endingCash: simulate({ ...values, growth }).endingCash })),
    grid: expenses.map(expense => ({
      expense, cells: growthGrid.map(growth => ({ growth, runway: simulate({ ...values, growth, expenses: expense }).runway })),
    })),
  };
}
