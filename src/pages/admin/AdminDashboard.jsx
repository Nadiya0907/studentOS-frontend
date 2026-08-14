import { useEffect, useState } from "react";
import {
  Users,
  BarChart3,
  FileText,
  MessageSquare,
  Activity,
} from "lucide-react";

import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import { adminService } from "../../services/adminService";

export default function AdminDashboard() {
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
          "Admin dashboard error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load admin analytics."
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

  const totalStudents = Number(
    analytics?.total_students || 0
  );

  const activeCourses = Number(
    analytics?.active_courses || 0
  );

  const totalUploads = Number(
    analytics?.total_uploads || 0
  );

  const systemStatus =
    analytics?.system_status || "Unknown";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-400">
          StudentOS Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Monitor the StudentOS platform and its activity.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Total Students
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {totalStudents}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
              <Users size={19} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Active Courses
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {activeCourses}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
              <BarChart3 size={19} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Total Uploads
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {totalUploads}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500/10 text-orange-400">
              <FileText size={19} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                System Status
              </p>

              <p className="mt-2 text-lg font-bold text-emerald-400">
                {systemStatus}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Activity size={19} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-500/10 text-pink-400">
            <MessageSquare size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Administration Overview
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Use the sidebar to manage users, reports, analytics
              and feedback.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}