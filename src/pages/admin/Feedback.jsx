import { useEffect, useState } from "react";
import {
  MessageSquare,
  CalendarDays,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { adminService } from "../../services/adminService";

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadFeedback = async () => {
      try {
        const response =
          await adminService.getFeedback();

        const data =
          response?.data || response;

        if (mounted) {
          setFeedback(
            Array.isArray(data)
              ? data
              : []
          );
        }
      } catch (error) {
        console.error(
          "Admin feedback error:",
          error
        );

        if (mounted) {
          toast.error(
            "Unable to load feedback."
          );

          setFeedback([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFeedback();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-400">
          StudentOS Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Feedback
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Review feedback submitted by students.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      ) : feedback.length === 0 ? (
        <EmptyState
          title="No feedback found"
          description="The backend did not return any feedback."
        />
      ) : (
        <div className="space-y-4">
          {feedback.map((item, index) => (
            <Card key={item.id || index}>
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pink-500/10 text-pink-400">
                  <MessageSquare size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <User
                        size={14}
                        className="text-gray-600"
                      />

                      <p className="text-sm font-semibold text-white">
                        {item.user || "Student"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                      <CalendarDays size={12} />
                      {item.date || "N/A"}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-300">
                    {item.feedback ||
                      "No feedback text available."}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}