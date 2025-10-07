import type { NextRequest, NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import i18nConfig from "../i18n.config";

const middleware = async (request: NextRequest): Promise<NextResponse> => {
  return i18nRouter(request, i18nConfig);
};

// applies this middleware only to files in the app directory
export const config = {
  matcher: [
    // only match paths to the app directory
    {
      source: "/((?!api|static|.*\\..*|_next).*)",
    },
  ],
};

export default middleware;
