import { IPaymentRequest, IPaymentResponse } from "@/types/payment";
import { API_BASE_URL } from "../auth/auth";

export const paymentAPI = {
  createPayment: async (
    token: string,
    payload: IPaymentRequest
  ): Promise<IPaymentResponse> => {
    console.log("payload", payload);
    const response = await fetch(`${API_BASE_URL}/payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create payment");
    }
    return data.data;
  },
};
