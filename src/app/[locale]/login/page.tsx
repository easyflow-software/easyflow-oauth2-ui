"use cache";
import type { FunctionComponent } from "react";
import initTranslations from "@/app/i18n";
import LoginForm from "@/components/login-form/form";
import TranslationProvider from "@/providers/translations-provider/translations-provider";
import type { Params } from "../layout";

const I18N_NAMESPACES = ["login"];

const LoginPage: FunctionComponent<Params> = async ({ params }) => {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, I18N_NAMESPACES);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <TranslationProvider
        locale={locale}
        namespaces={I18N_NAMESPACES}
        resources={resources}
      >
        <LoginForm />
      </TranslationProvider>
    </div>
  );
};

export default LoginPage;
