import { Metadata } from "next";
import SignInPage from "./SignInPage";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "SKY Parking | Login Page",
  description: "SKY PARKING Membership System",
};

export default function SignIn() {
  return (
    <AuthProvider>
      <SignInPage />
    </AuthProvider>
  );
}
