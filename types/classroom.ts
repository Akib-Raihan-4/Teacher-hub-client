
export interface IClassroomResponse {
  id: string;
  name: string;
  teacherId: string;
  days: string[];
  subject: string;
  createdAt: Date;
}

export interface IClassroomExtendedResponse extends IClassroomResponse {
  studentsCount: number;
  totalMonthlyFee: number;
}

export interface IClassroomRequest {
  name: string;
  days: string[];
  subject: string;
}

export interface IAllClassroomsSummary {
  totalClassrooms: number;
  totalStudents: number;
  totalRevenue: number;
  currentMonth: {
    currentMonthStudents: number;
    currentMonthClassrooms: number;
    currentMonthRevenue: number;
  };
}