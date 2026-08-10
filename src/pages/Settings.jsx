import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Moon,
  Bell,
  ShieldCheck,
  Save,
  Mail,
  Lock,
  UserRound,
  LogOut,
  ChevronRight,
} from "lucide-react";

import Card from "../components/common/Card";
import Button from "../components/common/Button";

export default function Settings() {
  const { onMenu } = useOutletContext() || {};

  const [settings, setSettings] = useState({
    dark: true,
    notifications: true,
    email: true,
    placementAlerts: true,
    learningReminders: true,
  });

  const toggle = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const saveSettings = () => {
    localStorage.setItem(
      "studentos_settings",
      JSON.stringify(settings)
    );

    toast.success("Settings saved successfully");
  };

  const Toggle = ({ enabled, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative h-6 w-11 rounded-full p-1 transition ${
        enabled ? "bg-accent" : "bg-bg-border"
      }`}
    >
      <span
        className={`block h-4 w-4 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Mobile menu */}
      {onMenu && (
        <button
          type="button"
          onClick={onMenu}
          className="rounded-lg border border-bg-border bg-bg-hover px-3 py-2 text-sm text-gray-300 md:hidden"
        >
          Menu
        </button>
      )}

      {/* Header */}
      <section className="rounded-2xl border border-bg-border bg-bg-card p-6">
        <p className="text-sm font-medium text-violet-400">
          StudentOS Settings
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
          Customize your experience.
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          Manage your appearance, notifications and account preferences.
        </p>
      </section>

      {/* Settings grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Appearance */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
              <Moon size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Appearance
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Customize how StudentOS looks.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-bg-border bg-bg-hover p-4">
            <div>
              <p className="text-sm font-medium text-white">
                Dark mode
              </p>

              <p className="mt-1 text-[11px] text-gray-600">
                Use the SIH StudentOS dashboard theme.
              </p>
            </div>

            <Toggle
              enabled={settings.dark}
              onClick={() => toggle("dark")}
            />
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
              <Bell size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Notifications
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Choose how StudentOS keeps you updated.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-hover p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Push notifications
                </p>

                <p className="mt-1 text-[11px] text-gray-600">
                  Receive important updates inside StudentOS.
                </p>
              </div>

              <Toggle
                enabled={settings.notifications}
                onClick={() => toggle("notifications")}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-hover p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Email notifications
                </p>

                <p className="mt-1 text-[11px] text-gray-600">
                  Receive important updates by email.
                </p>
              </div>

              <Toggle
                enabled={settings.email}
                onClick={() => toggle("email")}
              />
            </div>
          </div>
        </Card>

        {/* Placement notifications */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Mail size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Career Alerts
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Stay informed about placement opportunities.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-hover p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Placement alerts
                </p>

                <p className="mt-1 text-[11px] text-gray-600">
                  Get notified about relevant jobs and internships.
                </p>
              </div>

              <Toggle
                enabled={settings.placementAlerts}
                onClick={() => toggle("placementAlerts")}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-hover p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Learning reminders
                </p>

                <p className="mt-1 text-[11px] text-gray-600">
                  Receive reminders to continue your learning goals.
                </p>
              </div>

              <Toggle
                enabled={settings.learningReminders}
                onClick={() => toggle("learningReminders")}
              />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500/10 text-orange-400">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Security
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Manage your account security.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() =>
                toast("Password management will be connected to the backend.")
              }
              className="flex w-full items-center justify-between rounded-xl border border-bg-border bg-bg-hover p-4 text-left transition hover:border-orange-500/20"
            >
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-gray-500" />

                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Change password
                  </p>

                  <p className="mt-1 text-[11px] text-gray-600">
                    Update your account password.
                  </p>
                </div>
              </div>

              <ChevronRight
                size={16}
                className="text-gray-600"
              />
            </button>

            <div className="flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-4">
              <UserRound size={16} className="text-gray-500" />

              <div>
                <p className="text-sm font-medium text-gray-200">
                  Authentication
                </p>

                <p className="mt-1 text-[11px] text-gray-600">
                  Authentication will use JWT through the backend API.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Account */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gray-500/10 text-gray-400">
            <UserRound size={19} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Account
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Manage your StudentOS account.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-300">
              Student account
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Your account preferences are stored locally for now.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              toast("Logout will be connected to the authentication backend.")
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings}>
          <Save size={15} />
          Save preferences
        </Button>
      </div>
    </div>
  );
}