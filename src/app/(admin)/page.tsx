
import { Metadata } from "next";
import React from "react";
import AuthCustomer from "./Auth/customer/page";

export const metadata: Metadata = {
  title: "Login | SKY Membership",
  description: "Login page for SKY Membership system",
};

export default function Login() {
  
  return (
    <>
        <AuthCustomer/>
    </>
  );
}
