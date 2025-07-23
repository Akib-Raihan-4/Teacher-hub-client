export interface IExpenseRequest {
  categoryId: string;
  amount: number;
  description: string;
  date: Date;
}

export interface IExpenseResponse {
  id: string;
  teacherId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface IExpenseWithCategory extends IExpenseResponse {
  category: {
    name: string;
  };
}

export interface IExpenseCategoryRequest {
  name: string;
}

export interface IExpenseCategoryResponse {
  id: string;
  name: string;
}

export interface IIncomeRequest {
  teacherId: string;
  incomeSourceId: string;
  amount: number;
  description: string;
  date: Date;
}

export interface IIncomeResponse {
  id: string;
  teacherId: string;
  incomeSourceId: string;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface IIncomeSourceRequest {
  teacherId: string;
  name: string;
}

export interface IIncomeSourceResponse {
  id: string;
  name: string;
}
