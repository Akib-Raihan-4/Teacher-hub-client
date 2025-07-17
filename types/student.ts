export interface IStudentRequest {
  name: string;
  parentPhone: string;
  email: string;
  monthlyFee: number;
  classroomId: string;
}

export interface IStudentResponse {
  id: string;
  name: string;
  parentPhone: string;
  email: string;
  monthlyFee: number;
  classroomId: string;
  createdAt: Date;
}

export interface IStudentPaymentDetails extends IStudentResponse {
  paid: boolean;
  totalPaid: number;
  dueAmount: number;
  unpaidMonths: string[];
}

export interface IStudentSummary extends IStudentResponse {
  unpaidMonthsCount: number;
  totalPayments: number;
  totalPaidAmount: number;
}
