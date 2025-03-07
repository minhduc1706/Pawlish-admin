import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import DashboardBreadcrumb from "../dashboard/DashboardBreadcrumb";
import AppSidebar from "./AppSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardFooter from "../dashboard/DashboardFooter";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <Separator />
        <DashboardBreadcrumb />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col">
          <Outlet />
        </main>
      <DashboardFooter/>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
