"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getRemoteUrl } from "@/config/config";
import { APIOperation, ErrorCode } from "@/services/api/definitions";
import { apiRequest } from "@/services/api/request";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { t } = useTranslation("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Create validation schema with translated messages
  const formSchema = z.object({
    email: z.email(t("email.invalid")).min(1, t("email.required")),
    password: z
      .string()
      .min(1, t("password.required"))
      .min(6, t("password.minLength")),
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest({
        op: APIOperation.LOGIN,
        payload: {
          email: data.email,
          password: data.password,
        },
      });

      if (response.success) {
        console.log("Login successful:", response.data);
        const remoteUrl = await getRemoteUrl();
        const query = new URLSearchParams(window.location.search);
        if (!query.has("next")) {
          // Show invalid redirect error
          return;
        }
        console.log(remoteUrl + query.get("next"));
        window.location.href = remoteUrl + query.get("next");
      } else {
        console.error("Login failed:", response.errorCode);
        // TODO: Handle login error based on errorCode
        // You can show different messages based on response.errorCode
        switch (response.errorCode) {
          case ErrorCode.UNAUTHORIZED:
            // Show "Invalid credentials" message
            break;
          case ErrorCode.INVALID_REQUEST_BODY:
            // Show "Invalid input" message
            break;
          default:
            // Show generic error message
            break;
        }
      }
    } catch (error) {
      console.error("Login request failed:", error);
      // Handle network or other errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("email.placeholder")}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password.label")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder={t("password.placeholder")}
                        disabled={isLoading}
                        autoComplete="current-password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("submitButton")}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <Button variant="link" className="text-sm">
            {t("forgotPassword")}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">{t("signUp.text")} </span>
          <Button variant="link" className="p-0 h-auto font-normal">
            {t("signUp.link")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
