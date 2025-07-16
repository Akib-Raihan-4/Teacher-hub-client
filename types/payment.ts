export interface IPaymentRequest {
  studentId: string;
  amount: number;
  forMonth: Date;
  status: "paid" | "unpaid" | "partial";
}

export interface IPaymentResponse {
  id: string;
  studentId: string;
  amount: number;
  forMonth: Date;
  status: "paid" | "unpaid" | "partial";
  createdAt: Date;
}
