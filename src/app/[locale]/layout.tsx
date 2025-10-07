"use server";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "next-themes";
import type { FunctionComponent, PropsWithChildren } from "react";
import i18nConfig from "../../../i18n.config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export interface Params {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

const RootLayout: FunctionComponent<PropsWithChildren<Params>> = async ({
  children,
  params,
}) => {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
