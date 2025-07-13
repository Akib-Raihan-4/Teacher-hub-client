
export interface IClassroomResponse {
  id: string;
  name: string;
  teacherId: string;
  days: string[];
  subject: string;
  createdAt: Date;
}

export interface IClassroomRequest {
  name: string;
  days: string[];
  subject: string;
}