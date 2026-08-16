import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
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

  // Read/unread state is currently maintained locally.
  const [readIds, setReadIds] = useState(
    new Set()
  );

  // -------------------------------------------------
  // LOAD NOTIFICATIONS
  // -------------------------------------------------

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

      const detail =
        error?.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Unable to load notifications."
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

    if (
      typeof notification.is_read ===
      "boolean"
    ) {
      return notification.is_read;
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
      "Notifications marked as read."
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

  // -------------------------------------------------
  // UI
  // -------------------------------------------------

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
          {/* Refresh */}
          <button
            type="button"
            onClick={loadNotifications}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* Mark all read */}
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications */}
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
                  {/* Notification icon */}
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Bell size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        {/* Title */}
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

                        {/* Message */}
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {notification.message ||
                            ""}
                        </p>

                        {/* Time */}
                        <p className="mt-2 text-[10px] text-gray-700">
                          {notification.time ||
                            notification.date ||
                            "Recently"}
                        </p>
                      </div>

                      {/* Mark as read */}
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
                          <Check size={13} />
                          Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Student information */}
      <div className="mt-5 rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-3 text-xs leading-5 text-gray-500">
        Notifications are managed by StudentOS.
        Students can view notifications and mark them as read,
        but cannot create, edit, or delete official notifications.
      </div>
    </div>
  );
}