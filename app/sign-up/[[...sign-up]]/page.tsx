//app/sign-up/[[...sign-up]]/page.tsx
"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-[calc(100vh-96px)] flex items-center justify-center">
      <SignUp />
    </div>
  );
}
