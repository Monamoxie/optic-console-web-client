"use client";

import { Suspense } from "react";

function VerificationLoading() {
  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
      Loading...
    </div>
  );
}

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<VerificationLoading />}>{children}</Suspense>;
}
