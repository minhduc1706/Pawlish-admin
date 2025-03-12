import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import SearchBar from "../dashboard/SearchBar";
import { Bell, MessageSquare, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logoutApi } from "@/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const handleLogout = () => {
    // Add logout logic here
    logoutApi();
    dispatch(logout());
    navigate("/auth");
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center shadow-md justify-between px-4 bg-white">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-black hover:opacity-80 cursor-pointer" />
        <Separator orientation="vertical" className="h-6 bg-gray-600 mx-2" />
        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        <Bell className="size-6 cursor-pointer text-gray-700 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200" />
        <MessageSquare className="size-6 cursor-pointer text-gray-700 hover:bg-gray-200 rounded-full p-1 transition-colors duration-200" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <User className="size-7 rounded-full border text-black hover:bg-gray-200 p-1 transition-colors duration-200 cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="min-w-56 rounded-lg shadow-md mr-2">
            <DropdownMenuLabel className="text-sm font-semibold">
              User Options
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <span className="mr-2">👤</span>
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="mr-2">⚙️</span>
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="mr-2">❓</span>
              Need Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <span className="mr-2">🚪</span>
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
