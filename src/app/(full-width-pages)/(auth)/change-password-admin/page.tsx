// app/(full-width-pages)/(auth)/change-password-admin/page.tsx
"use client";

import ForgotPasswordPage from "@/components/forgotPassword";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
