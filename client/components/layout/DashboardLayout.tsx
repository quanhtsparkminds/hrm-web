import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon, Briefcase, LogOut, Menu, X } from "lucide-react";
import { images } from "@/assets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

export type NavItem = {
  id: string;
  label: string;
  icon:
    | LucideIcon
    | React.ComponentType<{ size?: number | string; className?: string }>;
  onClick: () => void;
  isActive: boolean;
  hasBadge?: boolean;
};

type DashboardLayoutProps = {
  children: ReactNode;
  user: any;
  navItems: NavItem[];
  onLogout: () => void;
  title?: string;
  avatarGradient?: string;
  sidebarTitle?: string;
};

export default function DashboardLayout({
  children,
  user,
  navItems,
  onLogout,
  title = "HRM Sparkminds System",
  avatarGradient = "from-blue-400 to-indigo-600",
  sidebarTitle = "HRM Sparkminds",
}: DashboardLayoutProps) {
  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img
                src={images.logo}
                alt="Team collaboration"
                className="w-full max-w-[360px] xl:max-w-[400px] h-auto  drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-float-img"
              />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg text-gray-900 truncate">
                {sidebarTitle}
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                item.isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon size={20} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
              {item.hasBadge && sidebarOpen && (
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              {item.hasBadge && !sidebarOpen && (
                <span className="absolute top-3 right-4 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className={`w-full ${sidebarOpen ? "justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" : "justify-center p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"}`}
              >
                <LogOut size={18} className="shrink-0" />
                {sidebarOpen && (
                  <span className="ml-2 font-medium">{t("logout")}</span>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold text-gray-900">
                  {t("logoutConfirmTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500">
                  {t("logoutConfirmMessage")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4 gap-3">
                <AlertDialogCancel className="rounded-xl border-gray-200 hover:bg-gray-50 font-medium">
                  {t("cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onLogout}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium border-none"
                >
                  {t("confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${avatarGradient} rounded-full flex items-center justify-center text-white font-bold`}
              >
                {user?.name?.charAt(0) || user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.fullName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">{children}</div>
      </div>
    </div>
  );
}
