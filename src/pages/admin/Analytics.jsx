import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  Upload,
  Activity,
} from "lucide-react";

import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import { adminService } from "../../services/adminService";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      try {
        const response =
          await adminService.getStatistics();

        const data =
          response?.data || response;

        if (mounted) {
          setAnalytics(data);
        }
      } catch (err) {
        console.error(
          "Analytics error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load analytics."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-400">
          StudentOS Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Admin Analytics
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Platform statistics and system-level metrics.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Users
            size={20}
            className="text-blue-400"
          />

          <p className="mt-4 text-xs text-gray-500">
            Total Students
          </p>

          <p className="mt-1 text-2xl font-bold text-white">
            {analytics?.total_students || 0}
          </p>
        </Card>

        <Card>
          <BookOpen
            size={20}
            className="text-violet-400"
          />

          <p className="mt-4 text-xs text-gray-500">
            Active Courses
          </p>

          <p className="mt-1 text-2xl font-bold text-white">
            {analytics?.active_courses || 0}
          </p>
        </Card>

        <Card>
          <Upload
            size={20}
            className="text-orange-400"
          />

          <p className="mt-4 text-xs text-gray-500">
            Total Uploads
          </p>

          <p className="mt-1 text-2xl font-bold text-white">
            {analytics?.total_uploads || 0}
          </p>
        </Card>

        <Card>
          <Activity
            size={20}
            className="text-emerald-400"
          />

          <p className="mt-4 text-xs text-gray-500">
            System Status
          </p>

          <p className="mt-1 text-lg font-bold text-emerald-400">
            {analytics?.system_status ||
              "Unknown"}
          </p>
        </Card>
      </div>
    </div>
  );
}