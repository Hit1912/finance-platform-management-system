import { BaseQueryFn } from "@reduxjs/toolkit/query/react";

// Helper to delay response
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Mock Database in LocalStorage
const getDb = (key: string, defaultValue: any) => {
  const data = localStorage.getItem(`mock_finance_${key}`);
  if (!data) return defaultValue;
  const parsed = JSON.parse(data);
  // If it's an empty array but we have a non-empty default, use the default
  if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(defaultValue) && defaultValue.length > 0) {
    return defaultValue;
  }
  return parsed;
};

const saveDb = (key: string, data: any) => {
  localStorage.setItem(`mock_finance_${key}`, JSON.stringify(data));
};

// Initialize Mock Collections with Seed Data
let users = getDb("users", []);
let transactions = getDb("transactions", [
  { _id: "1", title: "Monthly Salary", amount: 5000, type: "INCOME", category: "Salary", date: new Date().toISOString() },
  { _id: "2", title: "House Rent", amount: 1200, type: "EXPENSE", category: "Housing", date: new Date().toISOString() },
  { _id: "3", title: "Grocery Shopping", amount: 150, type: "EXPENSE", category: "Food", date: new Date().toISOString() },
  { _id: "4", title: "Internet Bill", amount: 60, type: "EXPENSE", category: "Utilities", date: new Date().toISOString() },
]);
let budgets = getDb("budgets", [
  { _id: "1", category: "Food", limit: 500, spent: 150 },
  { _id: "2", category: "Housing", limit: 1500, spent: 1200 },
]);
let goals = getDb("goals", [
  { _id: "1", name: "New Car", targetAmount: 20000, currentAmount: 5000 },
]);
let bills = getDb("bills", [
  { _id: "1", title: "Electricity", amount: 100, dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), status: "PENDING" },
]);

export const mockBaseQuery: BaseQueryFn<
  { url: string; method?: string; body?: any; params?: any },
  unknown,
  unknown
> = async ({ url, method = "GET", body, params }) => {
  await delay(500); // Simulate network delay

  console.log(`[MOCK API] ${method} ${url}`, { body, params });

  try {
    // ----------------------------------------
    // AUTHENTICATION
    // ----------------------------------------
    if (url === "/auth/register" && method === "POST") {
      const { firstName, lastName, email, password } = body;
      if (users.find((u: any) => u.email === email)) {
        return { error: { status: 400, data: { message: "User already exists" } } };
      }
      const newUser = {
        id: Date.now(),
        name: `${firstName} ${lastName}`,
        email,
        password,
        profilePicture: "https://github.com/shadcn.png",
      };
      users.push(newUser);
      saveDb("users", users);
      return { data: { message: "Registered successfully", user: newUser } };
    }

    if (url === "/auth/login" && method === "POST") {
      const { email, password } = body;
      let user = users.find((u: any) => u.email === email && u.password === password);

      // Default user for easy testing
      if (!user && email === "test@example.com") {
        user = {
          id: Date.now(),
          name: "Test User",
          email,
          password,
          profilePicture: "https://github.com/shadcn.png",
        };
        users.push(user);
        saveDb("users", users);
      }

      if (!user) {
        return { error: { status: 401, data: { message: "Invalid credentials" } } };
      }

      return {
        data: {
          accessToken: "mock_jwt_token_" + Date.now(),
          expiresAt: Date.now() + 86400000, // Number
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
          },
        },
      };
    }

    if (url === "/auth/logout" && method === "POST") {
      return { data: { message: "Logged out successfully" } };
    }

    // ----------------------------------------
    // USER
    // ----------------------------------------
    if (url === "/user/update" && method === "PATCH") {
      return { data: { message: "Profile updated successfully" } };
    }

    // ----------------------------------------
    // TRANSACTIONS
    // ----------------------------------------
    if (url === "/transaction/all" && method === "GET") {
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      let filtered = [...transactions];
      
      // Simple text search
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter((t: any) => t.title.toLowerCase().includes(query) || t.category?.toLowerCase().includes(query));
      }

      const total = filtered.length;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      return {
        data: {
          message: "Transactions retrieved",
          transactions: paginated,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    }

    if (url === "/transaction/create" && method === "POST") {
      const newTransaction = {
        _id: Date.now().toString(),
        userId: "mock_user",
        createdAt: new Date().toISOString(),
        ...body,
      };
      transactions.unshift(newTransaction);
      saveDb("transactions", transactions);
      return { data: { message: "Transaction added successfully", transaction: newTransaction } };
    }

    if (url === "/transaction/bulk-delete" && method === "DELETE") {
      const { transactionIds } = body;
      transactions = transactions.filter((t: any) => !transactionIds.includes(t._id));
      saveDb("transactions", transactions);
      return { data: { message: "Transactions deleted successfully" } };
    }

    if (url === "/transaction/scan-receipt" && method === "POST") {
      return {
        data: {
          message: "Receipt scanned (Mock Data)",
          data: {
            title: "Mock AI Scanned Receipt",
            amount: 45.99,
            type: "EXPENSE",
            category: "Food",
            date: new Date().toISOString(),
            description: "Automatically parsed from receipt image",
          },
        },
      };
    }

    // ----------------------------------------
    // FINANCE & ANALYTICS
    // ----------------------------------------
    if (url === "/analytics/summary" && method === "GET") {
      const income = transactions.filter((t: any) => t.type === 'INCOME').reduce((acc: number, curr: any) => acc + curr.amount, 0);
      const expenses = transactions.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, curr: any) => acc + curr.amount, 0);
      const balance = income - expenses;

      return {
        data: {
          message: "Analytics summary retrieved",
          data: {
            availableBalance: balance,
            totalIncome: income,
            totalExpenses: expenses,
            transactionCount: transactions.length,
            savingRate: {
              percentage: income > 0 ? ((income - expenses) / income) * 100 : 0,
              expenseRatio: income > 0 ? (expenses / income) * 100 : 0,
            },
            percentageChange: {
              income: 15,
              expenses: -10,
              balance: 5,
              prevPeriodFrom: null,
              prevPeriodTo: null,
            },
            preset: {
              from: new Date().toISOString(),
              to: new Date().toISOString(),
              value: params?.preset || "ALL_TIME",
              label: "All Time",
            }
          },
        },
      };
    }

    if (url === "/finance/overview" && method === "GET") {
      const balance = transactions.reduce((acc: number, curr: any) => acc + (curr.type === 'INCOME' ? curr.amount : -curr.amount), 0);
      const income = transactions.filter((t: any) => t.type === 'INCOME').reduce((acc: number, curr: any) => acc + curr.amount, 0);
      const expenses = transactions.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, curr: any) => acc + curr.amount, 0);

      return {
        data: {
          message: "Finance overview retrieved",
          data: {
            balance,
            income,
            expenses,
            savings: income - expenses > 0 ? income - expenses : 0,
          },
        },
      };
    }

    if (url === "/finance/category" && method === "GET") {
      return {
        data: {
          message: "Categories retrieved",
          categories: [
            { _id: "1", name: "Housing", type: "EXPENSE", color: "#EF4444" },
            { _id: "2", name: "Food", type: "EXPENSE", color: "#F59E0B" },
            { _id: "3", name: "Salary", type: "INCOME", color: "#10B981" },
            { _id: "4", name: "Transportation", type: "EXPENSE", color: "#3B82F6" },
          ],
        },
      };
    }

    if (url === "/analytics/chart" && method === "GET") {
      const mockChart = [];
      for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        mockChart.push({
          date: d.toISOString().split('T')[0],
          income: Math.floor(Math.random() * 500) + 100,
          expenses: Math.floor(Math.random() * 300) + 50,
        });
      }
      return { 
        data: { 
          message: "Chart data retrieved",
          data: {
            chartData: mockChart,
            totalIncomeCount: 10,
            totalExpenseCount: 25,
            preset: { from: "", to: "", value: "ALL_TIME", label: "All Time" }
          }
        } 
      };
    }

    if (url === "/analytics/expense-breakdown" && method === "GET") {
      return {
        data: {
          message: "Expense breakdown retrieved",
          data: {
            totalSpent: 1650,
            breakdown: [
              { name: "Food", value: 300, percentage: 18 },
              { name: "Housing", value: 1200, percentage: 72 },
              { name: "Transport", value: 150, percentage: 10 },
            ],
            preset: { from: "", to: "", value: "ALL_TIME", label: "All Time" }
          }
        }
      }
    }

    // ----------------------------------------
    // BUDGETS, GOALS, BILLS
    // ----------------------------------------
    if (url === "/finance/budget" && method === "GET") {
      return { data: { budgets: budgets } };
    }
    
    if (url === "/finance/goal" && method === "GET") {
      return { data: { goals: goals } };
    }
    
    if (url === "/finance/bill" && method === "GET") {
      return { data: { bills: bills } };
    }

    // ----------------------------------------
    // FALLBACK
    // ----------------------------------------
    console.warn(`[MOCK API] Unhandled request: ${method} ${url}`);
    return { error: { status: 404, data: { message: "Not found in mock DB" } } };
  } catch (error: any) {
    console.error("[MOCK API Error]", error);
    return { error: { status: 500, data: { message: error.message } } };
  }
};
