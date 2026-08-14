import { useEffect, useState } from "react";
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
} from "lucide-react";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { settingsService } from "../services/settingsService";

export default function Settings() {
  const { onMenu } = useOutletContext() || {};

  const [settings, setSettings] = useState({
    dark_mode: true,
    email_notifications: true,
    push_notifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const response = await settingsService.getSettings();

        const backendSettings = response?.data;

        if (mounted && backendSettings) {
          setSettings({
            dark_mode: backendSettings.dark_mode ?? true,
            email_notifications:
              backendSettings.email_notifications ?? true,
            push_notifications:
              backendSettings.push_notifications ?? true,
          });
        }
      } catch (error) {
        console.error("Settings load error:", error);
        toast.error("Could not load settings");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const toggle = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const saveSettings = async () => {
    setSaving(true);

    try {
      await settingsService.updateSettings(settings);

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Settings save error:", error);

      const detail = error?.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not save settings"
      );
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <div className="grid min-h-[400px] place-items-center">
        <div className="text-sm text-gray-500">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onMenu && (
        <button
          type="button"
          onClick={onMenu}
          className="rounded-lg border border-bg-border bg-bg-hover px-3 py-2 text-sm text-gray-300 md:hidden"
        >
          Menu
        </button>
      )}

      <section className="rounded-2xl border border-bg-border bg-bg-card p-6">
        <p className="text-sm font-medium text-violet-400">
          StudentOS Settings
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
          Customize your experience.
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          Manage your appearance and notification preferences.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
                Use the StudentOS dark dashboard theme.
              </p>
            </div>

            <Toggle
              enabled={settings.dark_mode}
              onClick={() => toggle("dark_mode")}
            />
          </div>
        </Card>

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
                enabled={settings.push_notifications}
                onClick={() =>
                  toggle("push_notifications")
                }
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
                enabled={settings.email_notifications}
                onClick={() =>
                  toggle("email_notifications")
                }
              />
            </div>
          </div>
        </Card>

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

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-4">
            <Lock size={16} className="text-gray-500" />

            <div>
              <p className="text-sm font-medium text-gray-200">
                Authentication
              </p>

              <p className="mt-1 text-[11px] text-gray-600">
                Authentication is handled by the backend API.
              </p>
            </div>
          </div>
        </Card>

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
                Your StudentOS account preferences.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-4">
            <Mail size={16} className="text-gray-500" />

            <p className="text-xs text-gray-400">
              Settings are synchronized with the StudentOS backend.
            </p>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>
          <Save size={15} />
          {saving ? "Saving..." : "Save preferences"}
        </Button>
      </div>
    </div>
  );
}