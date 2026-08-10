import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  Briefcase,
  Users,
  Bot,
  User,
  Settings,
} from "lucide-react";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    to: "/learning",
    label: "Learning",
    icon: BookOpen,
  },
  {
    to: "/placement",
    label: "Placement",
    icon: Briefcase,
  },
  {
    to: "/community",
    label: "Community",
    icon: Users,
  },
  {
    to: "/ai",
    label: "AI Assistant",
    icon: Bot,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-bg-border bg-bg-card">
      {/* Logo */}
      <div className="border-b border-bg-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-gradient text-sm font-black text-white shadow-glow">
            S
          </div>

          <div>
            <p className="text-base font-bold text-white">
              StudentOS
            </p>

            <p className="text-[10px] text-gray-600">
              Student Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-accent-gradient font-semibold text-white shadow-glow"
                  : "text-gray-400 hover:bg-bg-hover hover:text-white"
              }`
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-bg-border px-4 py-4">
        <p className="text-center text-[10px] text-gray-600">
          v1.0 · SIH 2026
        </p>
      </div>
    </aside>
  );
}