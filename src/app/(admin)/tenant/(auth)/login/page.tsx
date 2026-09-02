import { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import SignInPage from "./Signin";

export const metadata: Metadata = {
  title: "Login Tenant | SKY Membership",
  description: "SKY PARKING Membership System",
};

export default function SignIn() {
  return (
    <AuthProvider>
      <SignInPage />
    </AuthProvider>
  );
}
