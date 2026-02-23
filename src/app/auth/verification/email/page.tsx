"use client";

import { useSearchParams } from "next/navigation";
import { EmailVerificationForm } from "./EmailVerificationForm";

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return <EmailVerificationForm token={token} />;
}
