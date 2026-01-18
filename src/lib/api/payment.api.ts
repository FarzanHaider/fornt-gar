/**
 * Payment API endpoints
 */

import api from "./index";

export interface IbanDepositRequest {
  amount: number | string;
  description?: string;
  transactionId?: string;
  transactionReference?: string;
  screenshotUrl?: string;
  slipImage?: string;
}

export interface IbanDepositResponse {
  message: string;
  depositRequest: any;
  newBalance?: number;
  transaction?: any;
}

export const paymentAPI = {
  /**
   * Create IBAN deposit request
   * POST /api/payment/iban-deposit
   */
  createIbanDeposit: (data: IbanDepositRequest) =>
    api.post<IbanDepositResponse>("/payment/iban-deposit", data),

  /**
   * Get IBAN information
   * GET /api/payment/iban-info
   */
  getIbanInfo: () =>
    api.get("/payment/iban-info"),

  /**
   * Get user's deposit requests
   * GET /api/payment/deposit-requests
   */
  getDepositRequests: () =>
    api.get("/payment/deposit-requests"),

  /**
   * Get available deposit methods
   * GET /api/payment/deposit-methods
   */
  getDepositMethods: () =>
    api.get("/payment/deposit-methods"),
};
