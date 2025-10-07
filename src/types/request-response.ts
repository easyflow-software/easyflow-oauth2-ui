import type { ErrorCode } from "@/services/api/definitions";

export type RequestResponse<T> =
  | {
      success: false;
      errorCode: ErrorCode;
    }
  | {
      success: true;
      data: T;
    };
