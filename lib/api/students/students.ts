import { IStudentPaymentDetails, IStudentRequest } from "@/types/student";
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
};
