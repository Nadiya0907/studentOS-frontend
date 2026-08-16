import {
  NavLink,
  Outlet,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  CalendarCheck2,
  Building2,
  BriefcaseBusiness,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const links = [
  [
    "/admin",
    "Dashboard",
    LayoutDashboard,
  ],
  [
    "/admin/users",
    "Users",
    Users,
  ],
  [
    "/admin/reports",
    "Reports",
    FileText,
  ],
  [
    "/admin/analytics",
    "Analytics",
    BarChart3,
  ],
  [
    "/admin/feedback",
    "Feedback",
    MessageSquare,
  ],
  [
    "/admin/attendance",
    "Attendance",
    CalendarCheck2,
  ],
   [
    "/admin/companies",
    "Companies",
    Building2,
  ],
  [
    "/admin/internships",
    "Internships",
    BriefcaseBusiness,
  ],
];

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg text-gray-200 md:flex">
      <aside className="hidden h-screen w-64 shrink-0 border-r border-bg-border bg-bg-sidebar md:flex md:flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-bg-border p-5">
          <div className="text-lg font-bold text-white">
            StudentOS Admin
          </div>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="space-y-1">
            {links.map(
              ([to, label, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/admin"}
                  className={({
                    isActive,
                  }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-bg-hover text-white"
                        : "text-gray-400 hover:bg-bg-hover hover:text-white"
                    }`
                  }
                >
                  <Icon size={17} />
                  <span>{label}</span>
                </NavLink>
              )
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-bg-border p-5">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition hover:bg-bg-hover hover:text-white"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 overflow-auto p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}