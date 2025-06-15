import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | SKY Membership",
  description: "Login page for SKY Membership system",
};

export default function HOME() {
  redirect("/signin");
}
