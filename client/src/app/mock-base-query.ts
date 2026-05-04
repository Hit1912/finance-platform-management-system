import { BaseQueryFn } from "@reduxjs/toolkit/query/react";

// Helper to delay response
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Mock Database in LocalStorage
const getDb = (key: string, defaultValue: any) => {
  const data = localStorage.getItem(`mock_finance_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const saveDb = (key: string, data: any) => {
  localStorage.setItem(`mock_finance_${key}`, JSON.stringify(data));
};

// Initialize Mock Collections
let users = getDb("users", []);
let transactions = getDb("transactions", []);
let budgets = getDb("budgets", []);
let goals = getDb("goals", []);
let bills = getDb("bills", []);

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
        _id: Date.now().toString(),
        firstName,
        lastName,
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
          _id: Date.now().toString(),
          firstName: "Test",
          lastName: "User",
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
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
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
    if (url === "/finance/overview" && method === "GET") {
      const balance = transactions.reduce((acc, curr) => acc + (curr.type === 'INCOME' ? curr.amount : -curr.amount), 0);
      const income = transactions.filter((t) => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
      const expenses = transactions.filter((t) => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);

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
      // Mock chart data for last 7 days
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
      return { data: { data: mockChart } };
    }

    if (url === "/analytics/expense-breakdown" && method === "GET") {
      return {
        data: {
          data: [
            { category: "Food", amount: 300, color: "#F59E0B" },
            { category: "Housing", amount: 1200, color: "#EF4444" },
            { category: "Transport", amount: 150, color: "#3B82F6" },
          ]
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
