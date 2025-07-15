import {
  IAllClassroomsSummary,
  IClassroomExtendedResponse,
  IClassroomRequest,
} from "@/types/classroom";
import { API_BASE_URL } from "../auth/auth";

export const classroomAPI = {
  getAllClassrooms: async (
    token: string
  ): Promise<IClassroomExtendedResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/classroom`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch classrooms");
    }
    return data.data;
  },

  createClassroom: async (
    token: string,
    payload: IClassroomRequest
  ): Promise<IClassroomExtendedResponse> => {
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
      throw new Error(data.message || "Failed to create classroom");
    }

    return data.data;
  },

  getAllClassroomsSummary: async (
    token: string
  ): Promise<IAllClassroomsSummary> => {
    const response = await fetch(`${API_BASE_URL}/classroom/summary`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch classrooms");
    }

    return data.data;
  },

  deleteClassroom: async (
    token: string,
    classroomId: string
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/classroom/${classroomId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete classroom");
    }
  },

  updateClassroom: async (
    token: string,
    classroomId: string,
    payload: IClassroomRequest
  ): Promise<IClassroomExtendedResponse> => {
    const response = await fetch(`${API_BASE_URL}/classroom/${classroomId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update classroom");
    }
    return data.data;
  },

  getClassroomById: async (
    token: string,
    classroomId: string
  ): Promise<IClassroomExtendedResponse> => {
    const response = await fetch(`${API_BASE_URL}/classroom/${classroomId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch classroom");
    }
    return data.data;
  },
};
