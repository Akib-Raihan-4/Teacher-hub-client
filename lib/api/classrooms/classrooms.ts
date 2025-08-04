import {
  IAllClassroomsSummary,
  IClassroomExtendedResponse,
  IClassroomRequest,
  IClassroomWithSummary,
} from "@/types/classroom";
import { API_BASE_URL } from "../auth/auth";
import { IStudentPaymentDetails } from "@/types/student";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { fetchWithAuth } from "@/lib/hooks/fetchWithAuth";

export const classroomAPI = {
  getAllClassrooms: async (
    token: string
  ): Promise<IClassroomExtendedResponse[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/classroom`, {
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
    const response = await fetchWithAuth(`${API_BASE_URL}/classroom`, {
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
    const response = await fetchWithAuth(`${API_BASE_URL}/classroom/summary`, {
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
    const response = await fetchWithAuth(`${API_BASE_URL}/classroom/${classroomId}`, {
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
    const response = await fetchWithAuth(`${API_BASE_URL}/classroom/${classroomId}`, {
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
  ): Promise<IClassroomWithSummary> => {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/classroom/${classroomId}/summary`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch classroom");
    }
    return data.data;
  },

  getStudentsByClassroom: async (
    token: string,
    classroomId: string,
    paginationParams?: PaginationParams,
    search?: string
  ): Promise<PaginatedResponse<IStudentPaymentDetails[]>> => {
    const url = new URL(`${API_BASE_URL}/classroom/${classroomId}/students`);

    if (paginationParams?.page) {
      url.searchParams.append("page", paginationParams.page.toString());
    }
    if (paginationParams?.limit) {
      url.searchParams.append("limit", paginationParams.limit.toString());
    }
    if (search) {
      url.searchParams.append("search", search);
    }

    const response = await fetchWithAuth(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch students");
    }

    return {
      data: data.data,
      pagination: data.pagination,
    };
  },
};
