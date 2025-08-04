import {
  IExpenseCategoryRequest,
  IExpenseCategoryResponse,
  IExpenseRequest,
  IExpenseResponse,
  IExpenseWithCategory,
  IIncomeRequest,
  IIncomeResponse,
  IIncomeSourceRequest,
  IIncomeSourceResponse,
  IIncomeWithSource,
} from "@/types/finances";
import { API_BASE_URL } from "../auth/auth";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { fetchWithAuth } from "@/lib/hooks/fetchWithAuth";

export const financesAPI = {
  //  EXPENSES FETCHING
  addExpense: async (
    token: string,
    payload: IExpenseRequest
  ): Promise<IExpenseResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/expense`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add expense");
    }
    return data.data;
  },

  getTeacherExpense: async (
    token: string,
    paginationParams?: PaginationParams,
    searchTerm?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<PaginatedResponse<IExpenseWithCategory[]>> => {
    const url = new URL(`${API_BASE_URL}/expense`);

    if (paginationParams?.page) {
      url.searchParams.append("page", paginationParams.page.toString());
    }
    if (paginationParams?.limit) {
      url.searchParams.append("limit", paginationParams.limit.toString());
    }
    if (searchTerm) {
      url.searchParams.append("searchTerm", searchTerm);
    }
    if (dateFrom) {
      url.searchParams.append("dateFrom", dateFrom);
    }
    if (dateTo) {
      url.searchParams.append("dateTo", dateTo);
    }

    const response = await fetchWithAuth(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to get teacher expenses");
    }
    return { data: data.data, pagination: data.pagination };
  },

  updateExpense: async (
    token: string,
    expenseId: string,
    payload: IExpenseRequest
  ): Promise<IExpenseResponse> => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/expense/${expenseId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update expense");
    }
    return data.data;
  },

  deleteExpense: async (token: string, expenseId: string): Promise<void> => {
    console.log("delete expense", expenseId);
    const response = await fetchWithAuth(
      `${API_BASE_URL}/expense/${expenseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete expense");
    }
  },

  //  EXPENSE CATEGORIES FETCHING

  addExpenseCategory: async (
    token: string,
    payload: IExpenseCategoryRequest
  ): Promise<IExpenseCategoryResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/expense-category`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add expense category");
    }
    return data.data;
  },

  getTeacherExpenseCategories: async (
    token: string
  ): Promise<IExpenseCategoryResponse[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/expense-category`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to get teacher expense categories"
      );
    }
    return data.data;
  },

  deleteExpenseCategory: async (
    token: string,
    expenseCategoryId: string
  ): Promise<void> => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/expense-category/${expenseCategoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete expense category");
    }
  },

  //  INCOMES FETCHING

  addIncome: async (
    token: string,
    payload: IIncomeRequest
  ): Promise<IIncomeResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/income`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add income");
    }
    return data.data;
  },

  getTeacherIncome: async (
    token: string,
    paginationParams?: PaginationParams,
    searchTerm?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<PaginatedResponse<IIncomeWithSource[]>> => {
    const url = new URL(`${API_BASE_URL}/income`);

    if (paginationParams?.page) {
      url.searchParams.append("page", paginationParams.page.toString());
    }
    if (paginationParams?.limit) {
      url.searchParams.append("limit", paginationParams.limit.toString());
    }
    if (searchTerm) {
      url.searchParams.append("searchTerm", searchTerm);
    }
    if (dateFrom) {
      url.searchParams.append("dateFrom", dateFrom);
    }
    if (dateTo) {
      url.searchParams.append("dateTo", dateTo);
    }

    const response = await fetchWithAuth(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to get teacher income");
    }
    return { data: data.data, pagination: data.pagination };
  },

  updateIncome: async (
    token: string,
    incomeId: string,
    payload: IIncomeRequest
  ): Promise<IIncomeResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/income/${incomeId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update income");
    }
    return data.data;
  },

  deleteIncome: async (token: string, incomeId: string): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/income/${incomeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete income");
    }
  },

  //  INCOME SOURCES FETCHING

  addIncomeSource: async (
    token: string,
    payload: IIncomeSourceRequest
  ): Promise<IIncomeSourceResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/income-source`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add income source");
    }
    return data.data;
  },

  getTeacherIncomeSources: async (
    token: string
  ): Promise<IIncomeSourceResponse[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/income-source`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to get teacher income sources");
    }
    return data.data;
  },

  deleteIncomeSource: async (
    token: string,
    incomeSourceId: string
  ): Promise<void> => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/income-source/${incomeSourceId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete income source");
    }
  },
};
