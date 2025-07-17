import {
  IStudentPaymentDetails,
  IStudentRequest,
  IStudentSummary,
} from "@/types/student";
import { API_BASE_URL } from "../auth/auth";

export const studentAPI = {
  addStudent: async (
    token: string,
    payload: IStudentRequest
  ): Promise<IStudentPaymentDetails> => {
    const response = await fetch(`${API_BASE_URL}/student`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add student");
    }
    return data.data;
  },

  removeStudent: async (token: string, studentId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to remove student");
    }
  },

  updateStudent: async (
    token: string,
    studentId: string,
    payload: IStudentRequest
  ): Promise<IStudentPaymentDetails> => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update student");
    }
    return data.data;
  },

  getStudentSummary: async (
    token: string,
    studentId: string
  ): Promise<IStudentSummary> => {
    const response = await fetch(
      `${API_BASE_URL}/student/${studentId}/summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to get student summary");
    }
    return data.data;
  },
};
