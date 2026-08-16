import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Trash2,
  RefreshCw,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { notificationService } from "../../services/notificationService";

const emptyForm = {
  title: "",
  message: "",
};

export default function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  // ---------------------------------------------
  // LOAD
  // ---------------------------------------------

  const loadNotifications = async () => {
    setLoading(true);

    try {
      const response =
        await notificationService.getNotifications();

      const raw =
        response?.data ||
        response ||
        [];

      const items = Array.isArray(raw)
        ? raw.map((item) => ({
            ...item,
            id:
              item.id ||
              item._id,
            time:
              item.time ||
              item.date ||
              "Recently",
          }))
        : [];

      setNotifications(items);
    } catch (error) {
      console.error(
        "Admin notifications load error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not load notifications."
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ---------------------------------------------
  // FORM
  // ---------------------------------------------

  const handleChange = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
  };

  // ---------------------------------------------
  // CREATE
  // ---------------------------------------------

  const createNotification = async () => {
    const title = form.title.trim();
    const message = form.message.trim();

    if (!title) {
      toast.error(
        "Notification title is required."
      );
      return;
    }

    if (!message) {
      toast.error(
        "Notification message is required."
      );
      return;
    }

    setSaving(true);

    try {
      const response =
        await notificationService.createNotification(
          {
            title,
            message,
            date: new Date()
              .toISOString()
              .slice(0, 10),
          }
        );

      const created =
        response?.data?.notification ||
        response?.data ||
        response?.notification;

      if (created) {
        setNotifications(
          (current) => [
            {
              ...created,
              id:
                created.id ||
                created._id ||
                Date.now(),
              time:
                created.time ||
                created.date ||
                "Just now",
            },
            ...current,
          ]
        );
      } else {
        await loadNotifications();
      }

      toast.success(
        response?.data?.message ||
          "Notification created successfully."
      );

      resetForm();
    } catch (error) {
      console.error(
        "Create notification error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not create notification."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------

  const deleteNotification =
    async (notification) => {
      const id =
        notification.id ||
        notification._id;

      if (!id) {
        toast.error(
          "Notification ID is missing."
        );
        return;
      }

      const confirmed =
        window.confirm(
          `Delete "${
            notification.title ||
            "this notification"
          }"?`
        );

      if (!confirmed) {
        return;
      }

      setDeletingId(id);

      try {
        const response =
          await notificationService.deleteNotification(
            id
          );

        setNotifications(
          (current) =>
            current.filter(
              (item) =>
                (item.id ||
                  item._id) !== id
            )
        );

        toast.success(
          response?.data?.message ||
            "Notification deleted successfully."
        );
      } catch (error) {
        console.error(
          "Delete notification error:",
          error
        );

        const detail =
          error?.response?.data?.detail;

        toast.error(
          typeof detail === "string"
            ? detail
            : "Could not delete notification."
        );
      } finally {
        setDeletingId(null);
      }
    };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-400">
            StudentOS Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage official student notifications.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadNotifications}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              setShowForm(
                (current) => !current
              )
            }
            className="inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white"
          >
            {showForm ? (
              <X size={14} />
            ) : (
              <Plus size={14} />
            )}

            {showForm
              ? "Close"
              : "Create Notification"}
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <Card>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">
              Create Notification
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              This notification will be published for students.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400">
                Title
              </label>

              <input
                value={form.title}
                onChange={(event) =>
                  handleChange(
                    "title",
                    event.target.value
                  )
                }
                placeholder="e.g. Assignment Deadline"
                className="mt-1.5 w-full rounded-xl border border-bg-border bg-bg-hover px-3 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400">
                Message
              </label>

              <textarea
                value={form.message}
                onChange={(event) =>
                  handleChange(
                    "message",
                    event.target.value
                  )
                }
                rows={5}
                placeholder="Write the notification message..."
                className="mt-1.5 w-full resize-none rounded-xl border border-bg-border bg-bg-hover p-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white"
            >
              <X size={14} />
              Cancel
            </button>

            <button
              type="button"
              onClick={createNotification}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              <Save size={14} />
              {saving
                ? "Creating..."
                : "Create Notification"}
            </button>
          </div>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="grid h-60 place-items-center">
          <Spinner />
        </div>
      ) : notifications.length ===
        0 ? (
        <EmptyState
          title="No notifications"
          description="Create a notification to publish an update for students."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(
            (notification, index) => {
              const id =
                notification.id ||
                notification._id ||
                index;

              const deleting =
                deletingId === id;

              return (
                <Card key={id}>
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                      <Bell size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            {notification.title ||
                              "Notification"}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-gray-400">
                            {notification.message ||
                              ""}
                          </p>

                          <p className="mt-2 text-[10px] text-gray-600">
                            {notification.time ||
                              notification.date ||
                              "Recently"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deleteNotification(
                              notification
                            )
                          }
                          disabled={deleting}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-600 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                          title="Delete notification"
                        >
                          {deleting ? (
                            <RefreshCw
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={14}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            }
          )}
        </div>
      )}

      <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-3 text-xs leading-5 text-gray-500">
        Students can only view and mark notifications as read.
        Notification creation and deletion are managed from the Admin side.
      </div>
    </div>
  );
}