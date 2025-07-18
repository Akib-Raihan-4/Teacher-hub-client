export interface IUnpaidRecord {
  studentId: string;
  unpaidMonths: string[];
}

export interface IUnpaidRecordResponse {
  id: string;
  studentId: string;
  unpaidMonths: string[];
  updatedAt: Date;
}