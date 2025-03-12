import type React from "react";
import {
  Users,
  Scissors,
  BarChart,
  Package,
  Settings,
  Bell,
  Calendar,
  CheckCircle,
  PawPrint,
  MessageSquare,
  DollarSign,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import NavMain from "@/components/dashboard/NavMain";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import NavUser from "@/components/dashboard/NavUser";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import TeamSwitcher from "../dashboard/TeamSwitcher";
import { logoutApi } from "@/api/authApi";
import { logout } from "@/redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

const adminData = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  navMain: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/dashboard",
    },
    {
      title: "User Management",
      icon: Users,
      url: "#",
      items: [
        { title: "Customers", url: "/customers" },
        { title: "Employees", url: "/employees" },
      ],
    },
    {
      title: "Services",
      icon: Scissors,
      url: "#",
      items: [
        { title: "Service List", url: "/services" },
        { title: "Pricing", url: "/pricing" },
        { title: "Appointments", url: "/appointments" },
        { title: "Special Approvals", url: "/appointments/special" },
      ],
    },
    {
      title: "Analytics",
      icon: BarChart,
      url: "#",
      items: [
        { title: "Revenue", url: "/revenue" },
        { title: "Statistics", url: "/statistics" },
        { title: "Export Reports", url: "/export" },
      ],
    },
    {
      title: "Inventory",
      icon: Package,
      url: "#",
      items: [
        { title: "Products", url: "/products" },
        { title: "Restock Orders", url: "/restocks" },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      url: "#",
      items: [
        { title: "Payment", url: "/payment" },
        { title: "Transactions", url: "/transactions" },
        { title: "Employee Schedules", url: "/employee-schedules" },
        { title: "Content", url: "/content" },
        { title: "Chatbot", url: "/chatbot" },
      ],
    },
    {
      title: "Marketing",
      icon: Bell,
      url: "#",
      items: [
        { title: "Promotions", url: "/promotions" },
        { title: "Notifications", url: "/notifications" },
      ],
    },
  ],
};

// Staff navigation data
const staffData = {
  user: {
    name: "Staff Member",
    email: "staff@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  navMain: [
    {
      title: "Appointments",
      icon: Calendar,
      url: "#",
      items: [
        { title: "Schedule", url: "/staff/appointments" },
        { title: "Manage", url: "/staff/appointments/manage" },
        { title: "Notifications", url: "/staff/appointments/notify" },
      ],
    },
    {
      title: "Services",
      icon: CheckCircle,
      url: "#",
      items: [
        { title: "Status Updates", url: "/staff/services/status" },
        { title: "Reports", url: "/staff/services/report" },
      ],
    },
    {
      title: "Pets",
      icon: PawPrint,
      url: "#",
      items: [
        { title: "Information", url: "/staff/pets" },
        { title: "Special Notes", url: "/staff/pets/notes" },
      ],
    },
    {
      title: "Feedback",
      icon: MessageSquare,
      url: "#",
      items: [
        { title: "Customer Reviews", url: "/staff/feedback" },
        { title: "Ratings", url: "/staff/ratings" },
      ],
    },
    {
      title: "Inventory",
      icon: Package,
      url: "/staff/inventory",
    },
    {
      title: "Reports",
      icon: BarChart,
      url: "/staff/reports",
    },
    {
      title: "Alerts",
      icon: Bell,
      url: "/staff/notifications",
    },
    {
      title: "Earnings",
      icon: DollarSign,
      url: "/staff/earnings",
    },
  ],
};

const getSidebarData = (role: string) => {
  switch (role) {
    case "admin":
      return adminData;
    case "staff":
      return staffData;
    default:
      return adminData;
  }
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const handleLogout = () => {
      // Add logout logic here
      logoutApi();
      dispatch(logout());
      navigate("/auth");
    };
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const role = user?.role || "admin";
  const sidebarData = getSidebarData(role);

  const mainNavItems = sidebarData.navMain.slice(0, 4);
  const secondaryNavItems = sidebarData.navMain.slice(4);

  if (!isAuthenticated && process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pb-0">
        <TeamSwitcher
          teams={[
            {
              name: role.charAt(0).toUpperCase() + role.slice(1),
              logo: role === "admin" ? Users : PawPrint,
              plan: `${role === "admin" ? "Full" : "Staff"} Access`,
            },
          ]}
        />
      </SidebarHeader>
      <SidebarSeparator className="my-2" />
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <NavMain items={mainNavItems} groupLabel="Main" />

          {secondaryNavItems.length > 0 && (
            <>
              <SidebarSeparator className="my-2" />
              <NavMain items={secondaryNavItems} groupLabel="System" />
            </>
          )}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="my-2" />
        <NavUser
          user={sidebarData.user}
          actions={[
            {
              label: "Logout",
              icon: LogOut,
              onClick: () => handleLogout(),
            },
          ]}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
