import AuthLayout from "../AuthLayout";

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
