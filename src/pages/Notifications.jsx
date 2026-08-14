import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Plus,
  Trash2,
  X,
  Save,
  RefreshCw,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

import Topbar from "../components/common/Topbar";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { notificationService } from "../services/notificationService";

export default function Notifications() {
  const { onMenu } = useOutletContext() || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  // Local read state.
  // This is ready for future backend persistence.
  const [readIds, setReadIds] = useState(
    new Set()
  );

  const loadNotifications = async () => {
    setLoading(true);

    try {
      const response =
        await notificationService.getNotifications();

      const notifications =
        response?.data ||
        response ||
        [];

      const normalized = Array.isArray(
        notifications
      )
        ? notifications.map(
            (notification) => ({
              ...notification,
              id:
                notification.id ||
                notification._id,
              time:
                notification.time ||
                notification.date ||
                "Recently",
            })
          )
        : [];

      setData(normalized);
    } catch (error) {
      console.error(
        "Notifications error:",
        error
      );

      toast.error(
        "Unable to load notifications."
      );

      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // -------------------------------------------------
  // FORM
  // -------------------------------------------------

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
    });

    setShowForm(false);
  };

  const handleFormChange = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // -------------------------------------------------
  // CREATE NOTIFICATION
  // -------------------------------------------------

  const createNotification = async () => {
    if (!form.title.trim()) {
      toast.error(
        "Notification title is required."
      );
      return;
    }

    if (!form.message.trim()) {
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
            title: form.title.trim(),
            message: form.message.trim(),
            date: new Date()
              .toISOString()
              .slice(0, 10),
          }
        );

      const created =
        response?.data?.notification ||
        response?.data ||
        null;

      if (created) {
        setData((current) => [
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
        ]);
      }

      resetForm();

      toast.success(
        "Notification created."
      );
    } catch (error) {
      console.error(
        "Create notification error:",
        error
      );

      toast.error(
        "Create notification endpoint is not available in the current backend yet."
      );
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------
  // DELETE NOTIFICATION
  // -------------------------------------------------

  const deleteNotification = async (
    notification
  ) => {
    const id =
      notification.id ||
      notification._id;

    if (!id) {
      toast.error(
        "This notification does not have an ID."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${notification.title || "this notification"}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await notificationService.deleteNotification(
        id
      );

      setData((current) =>
        current.filter(
          (item) =>
            (item.id || item._id) !== id
        )
      );

      setReadIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });

      toast.success(
        "Notification deleted."
      );
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      toast.error(
        "Delete notification endpoint is not available in the current backend yet."
      );
    }
  };

  // -------------------------------------------------
  // READ / UNREAD
  // -------------------------------------------------

  const isRead = (notification) => {
    const id =
      notification.id ||
      notification._id;

    if (
      typeof notification.read ===
      "boolean"
    ) {
      return notification.read;
    }

    return readIds.has(id);
  };

  const markAsRead = (notification) => {
    const id =
      notification.id ||
      notification._id;

    if (!id) {
      return;
    }

    setReadIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  };

  const markAllAsRead = () => {
    const ids = data
      .map(
        (notification) =>
          notification.id ||
          notification._id
      )
      .filter(Boolean);

    setReadIds(new Set(ids));

    toast.success(
      "Notifications marked as read locally."
    );
  };

  const unreadCount = useMemo(
    () =>
      data.filter(
        (notification) =>
          !isRead(notification)
      ).length,
    [data, readIds]
  );

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        title="Notifications"
        subtitle="Updates, reminders and activity"
      />

      {/* Actions */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            {unreadCount} unread
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Stay updated with StudentOS activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadNotifications}
            className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>

          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setForm({
                title: "",
                message: "",
              });
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90"
          >
            <Plus size={14} />
            Create
          </button>
        </div>
      </div>

      {/* Create notification form */}
      {showForm && (
        <Card className="mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Create Notification
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Ready for the future notification POST API.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-bg-hover hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            <div>
              <label className="text-xs font-medium text-gray-400">
                Title
              </label>

              <input
                value={form.title}
                onChange={(event) =>
                  handleFormChange(
                    "title",
                    event.target.value
                  )
                }
                placeholder="e.g. Assignment Due"
                className="mt-1.5 w-full rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400">
                Message
              </label>

              <textarea
                value={form.message}
                onChange={(event) =>
                  handleFormChange(
                    "message",
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Notification message..."
                className="mt-1.5 w-full resize-none rounded-xl border border-bg-border bg-bg-hover p-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white"
            >
              <X size={14} />
              Cancel
            </button>

            <button
              type="button"
              onClick={createNotification}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={14} />
              {saving
                ? "Saving..."
                : "Create Notification"}
            </button>
          </div>
        </Card>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid h-60 place-items-center">
          <Spinner />
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title="All caught up"
          description="You don't have any notifications."
        />
      ) : (
        <div className="space-y-3">
          {data.map((notification) => {
            const id =
              notification.id ||
              notification._id;

            const read =
              isRead(notification);

            return (
              <Card
                key={id}
                className={
                  !read
                    ? "border-accent/20"
                    : ""
                }
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Bell size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">
                            {notification.title ||
                              "Notification"}
                          </h3>

                          {!read && (
                            <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] text-accent-soft">
                              NEW
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {notification.message ||
                            ""}
                        </p>

                        <p className="mt-2 text-[10px] text-gray-700">
                          {notification.time ||
                            notification.date ||
                            "Recently"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!read && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(
                                notification
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-bg-border bg-bg-hover px-2.5 py-2 text-[10px] font-semibold text-gray-400 hover:text-white"
                          >
                            <Check
                              size={13}
                            />
                            Read
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteNotification(
                              notification
                            )
                          }
                          className="grid h-8 w-8 place-items-center rounded-lg text-gray-600 hover:bg-red-500/10 hover:text-red-400"
                          title="Delete notification"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Backend readiness note */}
      <div className="mt-5 rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-3 text-xs leading-5 text-gray-500">
        Notification viewing is connected to the current backend.
        Create and Delete are already prepared in the frontend
        and will become live when the corresponding backend APIs
        are implemented. Read/unread state is currently stored
        locally in the frontend.
      </div>
    </div>
  );
}