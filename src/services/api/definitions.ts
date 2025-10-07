enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_ALLOWED = "NOT_ALLOWED",
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  INVALID_REQUEST_BODY = "INVALID_REQUEST_BODY",
}

enum APIOperation {
  LOGIN = "POST:/auth/login",
}

type APIContext = {
  [APIOperation.LOGIN]: RequestContext<
    APIOperation.LOGIN,
    { sessionToken: string; expiresIn: number },
    { email: string; password: string }
  >;
};

type WithPayload<TBase, TPayload> = TPayload extends void
  ? TBase
  : TBase & {
      payload: TPayload;
    };

type WithURLParams<TBase, TURLParams> = TURLParams extends void
  ? TBase
  : TBase & {
      params: TURLParams;
    };

type WithQueryParams<TBase, TQuery> = TQuery extends void
  ? TBase
  : TBase & {
      query: TQuery;
    };

type RequestContext<
  TEndpoint extends APIOperation,
  TResponse = void,
  TPayload = void,
  TURLParams = void,
  TQuery = void,
> = WithQueryParams<
  WithURLParams<
    WithPayload<
      {
        op: TEndpoint;
        responseType: TResponse;
        headers?: Record<string, string>;
      },
      TPayload
    >,
    TURLParams
  >,
  TQuery
>;

export { APIOperation, ErrorCode };
export type { APIContext };
