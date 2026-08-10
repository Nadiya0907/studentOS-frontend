import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import Topbar from "../components/common/Topbar";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { notificationService } from "../services/profileService";

const demoNotifications = [
  {
    id: 1,
    title: "Welcome to StudentOS",
    message: "Your StudentOS journey has started successfully.",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    title: "Keep learning",
    message: "You have learning resources waiting in your Learning section.",
    time: "Today",
    read: true,
  },
  {
    id: 3,
    title: "Placement reminder",
    message: "Keep your resume updated before applying for opportunities.",
    time: "Today",
    read: true,
  },
];

export default function Notifications() {
  const { onMenu } = useOutletContext() || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService
      .getNotifications()
      .then((response) => {
        setData(response.data?.items || response.data || []);
      })
      .catch(() => {
        setData(demoNotifications);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        title="Notifications"
        subtitle="Updates, reminders and activity"
      />

      {loading ? (
        <div className="grid h-60 place-items-center">
          <Spinner />
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title="All caught up"
          description="You don't have any new notifications."
        />
      ) : (
        <div className="space-y-3">
          {data.map((notification) => (
            <Card
              key={notification.id}
              className={
                !notification.read
                  ? "border-accent/20"
                  : ""
              }
            >
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Bell size={17} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <h3 className="font-semibold text-white">
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] text-accent-soft">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-[10px] text-gray-700">
                    {notification.time}
                  </p>
                </div>

                <Check
                  size={15}
                  className="text-gray-700"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}