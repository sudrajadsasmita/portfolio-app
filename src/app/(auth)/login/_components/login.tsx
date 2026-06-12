"use client";

import FormInput from "@/components/common/form-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constants";
import { LoginForm, loginSchemaForm } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Login() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM,
  );

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([Key, value]) => {
      formData.append(Key, value as string);
    });

    startTransition(() => {
      loginAction(formData);
    });
  });

  useEffect(() => {
    if (loginState.status == "error") {
      toast.error("Login failed", {
        description: loginState.errors?._form?.[0],
      });

      startTransition(() => {
        loginAction(null);
      });
    }
    console.log(loginState.status === "error");
  }, [loginState]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Selamat Datang</CardTitle>
        <CardDescription>
          Ayokk login segera perbarui portofoliomu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            form={form}
            label="Email"
            name="email"
            placeholder="Please insert your email..."
            type="email"
          />
          <FormInput
            form={form}
            label="Password"
            name="password"
            placeholder="Please insert your password..."
            type="password"
          />
          <Button type="submit" className="w-full">
            {isPendingLogin ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
