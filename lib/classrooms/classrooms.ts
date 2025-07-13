import { IClassroomRequest, IClassroomResponse } from "@/types/classroom";
import { API_BASE_URL } from "../auth/auth";

export const classroomAPI = {
  getAllClassrooms: async (token: string): Promise<IClassroomResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/classroom`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }
    return data.data;
  },

  createClassroom: async (
    token: string,
    payload: IClassroomRequest
  ): Promise<IClassroomResponse> => {
    const response = await fetch(`${API_BASE_URL}/classroom`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }

    return data.data;
  },
};
