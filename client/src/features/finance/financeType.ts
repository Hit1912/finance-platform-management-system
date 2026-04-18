export interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Budget {
  _id: string;
  amount: number;
  period: string;
  categoryId?: string;
}

export interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string;
}

export interface Bill {
  _id: string;
  provider: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  categoryId?: string;
}

export interface FinanceOverviewResponse {
  message: string;
  data: {
    categories: Array<{ name: string; total: number; count: number }>;
    budgets: Budget[];
    goals: Goal[];
    bills: Bill[];
  }
}
