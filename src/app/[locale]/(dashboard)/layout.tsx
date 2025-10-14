import React, { ReactNode } from "react";
import { getUserInfo } from "@/services/user";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

const DashboardLayout = async ({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) => {
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.email) {
    redirect("/auth/signin?redirect=/dashboard");
  }

  return (
    <>
      <DashboardClient>{children}</DashboardClient>
    </>
  );
};

export default DashboardLayout;
