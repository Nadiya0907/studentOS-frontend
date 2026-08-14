import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  CalendarCheck2,
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  UserCircle,
  Brain,
  FileText,
  Flame,
  Target,
  CheckCircle2,
} from "lucide-react";

import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import { dashboardService } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { onMenu } = useOutletContext() || {};
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      if (!user?.roll_number) {
        setError(
          "Student roll number is not available."
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response =
          await dashboardService.getDashboard(
            user.roll_number
          );

        if (mounted) {
          setData(
            response?.data || response
          );
        }
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load dashboard data."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [user?.roll_number]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const studentInfo =
    data?.student_info || {};

  const attendanceSummary =
    data?.attendance_summary || {};

  const academicSummary =
    data?.academic_summary || {};

  const attendancePercentage = Number(
    String(
      attendanceSummary.overall_percentage ||
        "0"
    ).replace("%", "")
  );

  const totalClasses = Number(
    attendanceSummary.total_classes || 0
  );

  const totalResources = Number(
    academicSummary.total_pdfs_available ||
      0
  );

  const studentName =
    studentInfo.name &&
    studentInfo.name !== "Student"
      ? studentInfo.name
      : user?.name || "Student";

  const rollNumber =
    studentInfo.roll_number ||
    user?.roll_number ||
    "N/A";

  const department =
    studentInfo.department || "N/A";

  const semester =
    studentInfo.semester || "N/A";

  /*
   * ----------------------------------------------------
   * TEMPORARY FRONTEND VALUES
   * ----------------------------------------------------
   *
   * The current backend does not yet provide:
   * GET /cgpa
   * GET /streak
   * GET /goals
   *
   * These values are kept here so the Dashboard UI
   * already contains the roadmap features.
   *
   * Later we will replace these with real API data.
   */

  const cgpa = 8.6;

  const streak = 12;

  const goals = [
    {
      id: 1,
      title: "Complete DBMS notes",
      done: true,
    },
    {
      id: 2,
      title: "Solve 10 DSA problems",
      done: true,
    },
    {
      id: 3,
      title: "Practice SQL queries",
      done: true,
    },
    {
      id: 4,
      title: "Apply to 2 internships",
      done: true,
    },
    {
      id: 5,
      title: "Revise Operating Systems",
      done: false,
    },
    {
      id: 6,
      title: "Watch React lecture",
      done: false,
    },
  ];

  const goalsCompleted =
    goals.filter(
      (goal) => goal.done
    ).length;

  const goalsTotal = goals.length;

  const goalPercentage =
    goalsTotal > 0
      ? Math.round(
          (goalsCompleted / goalsTotal) *
            100
        )
      : 0;

  /*
   * Existing graph preserved.
   * Later it can be replaced by a real progress API.
   */
  const progressData = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 55 },
    { day: "Wed", value: 48 },
    { day: "Thu", value: 70 },
    { day: "Fri", value: 65 },
    { day: "Sat", value: 82 },
    { day: "Sun", value: 90 },
  ];

  const cards = [
    {
      label: "Attendance",
      value: `${attendancePercentage}%`,
      icon: CalendarCheck2,
      iconClass: "text-cyan-300",
      progress: attendancePercentage,
      description: `${totalClasses} classes recorded`,
    },

    {
      label: "CGPA",
      value: cgpa.toFixed(1),
      icon: GraduationCap,
      iconClass: "text-violet-300",
      progress: (cgpa / 10) * 100,
      description:
        "Current academic score",
    },

    {
      label: "Streak",
      value: `${streak} days`,
      icon: Flame,
      iconClass: "text-orange-300",
      progress: null,
      description:
        "Keep the momentum",
    },

    {
      label: "Daily Goals",
      value: `${goalsCompleted}/${goalsTotal}`,
      icon: Target,
      iconClass: "text-emerald-300",
      progress: goalPercentage,
      description: `${goalPercentage}% completed`,
    },
  ];

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

      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl border border-bg-border bg-bg-card p-6">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              StudentOS Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              Welcome back, {studentName} 👋
            </h1>

            <p className="mt-2 max-w-xl text-sm text-gray-400">
              Here is your current academic overview.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-bg-border bg-bg-hover px-3 py-1.5 text-gray-400">
                Roll No: {rollNumber}
              </span>

              <span className="rounded-full border border-bg-border bg-bg-hover px-3 py-1.5 text-gray-400">
                Department: {department}
              </span>

              <span className="rounded-full border border-bg-border bg-bg-hover px-3 py-1.5 text-gray-400">
                Semester: {semester}
              </span>
            </div>
          </div>

          <Link
            to="/ai"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-gradient px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Brain size={17} />
            Ask AI Mentor
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.label}
              className="relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    {card.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {card.value}
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    {card.description}
                  </p>
                </div>

                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl bg-bg-hover ${card.iconClass}`}
                >
                  <Icon size={20} />
                </div>
              </div>

              {card.progress !== null && (
                <div className="mt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-bg-border">
                    <div
                      className="h-full rounded-full bg-accent-gradient transition-all"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            card.progress,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </section>

      {/* Attendance + Academic Resources */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Attendance */}
        <Card className="xl:col-span-2">
          <div className="mb-5">
            <p className="text-sm font-semibold text-white">
              Attendance Overview
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Live data from your StudentOS backend
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-bg-border bg-bg-hover p-4">
              <p className="text-xs text-gray-500">
                Overall attendance
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {attendancePercentage}%
              </p>
            </div>

            <div className="rounded-xl border border-bg-border bg-bg-hover p-4">
              <p className="text-xs text-gray-500">
                Total classes
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalClasses}
              </p>
            </div>

            <div className="rounded-xl border border-bg-border bg-bg-hover p-4">
              <p className="text-xs text-gray-500">
                Exam eligibility
              </p>

              <p
                className={`mt-2 text-xl font-bold ${
                  attendanceSummary.is_eligible
                    ? "text-emerald-400"
                    : "text-orange-400"
                }`}
              >
                {attendanceSummary.is_eligible
                  ? "Eligible"
                  : "Not eligible"}
              </p>
            </div>
          </div>
        </Card>

        {/* Academic resources */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <FileText size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Academic Resources
              </p>

              <p className="text-xs text-gray-500">
                Available learning material
              </p>
            </div>
          </div>

          <div className="mt-5 flex-1 rounded-xl border border-bg-border bg-bg-hover p-5">
            <p className="text-4xl font-black text-white">
              {totalResources}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              PDF resources available
            </p>
          </div>

          <Link
            to="/learning"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent-gradient px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Open Learning
            <ArrowUpRight size={16} />
          </Link>
        </Card>
      </section>

      {/* Goals */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Daily Goals
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Small wins compound.
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">
              {goalPercentage}% complete
            </div>
          </div>

          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-bg-border">
            <div
              className="h-full rounded-full bg-accent-gradient"
              style={{
                width: `${goalPercentage}%`,
              }}
            />
          </div>

          <div className="space-y-3">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover px-3 py-3"
              >
                <CheckCircle2
                  size={18}
                  className={
                    goal.done
                      ? "text-emerald-400"
                      : "text-gray-600"
                  }
                />

                <span
                  className={`flex-1 text-sm ${
                    goal.done
                      ? "text-gray-500 line-through"
                      : "text-gray-200"
                  }`}
                >
                  {goal.title}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-yellow-500/10 bg-yellow-500/5 px-3 py-3 text-[10px] leading-5 text-gray-500">
            Goals are currently displayed using frontend data.
            They will become live when the backend Goals API is added.
          </div>
        </Card>

        {/* Academic snapshot */}
        <Card>
          <div className="mb-5">
            <p className="text-sm font-semibold text-white">
              Academic Snapshot
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Your current study indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-bg-border bg-bg-hover p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  CGPA
                </p>

                <GraduationCap
                  size={18}
                  className="text-violet-400"
                />
              </div>

              <p className="mt-3 text-3xl font-bold text-white">
                {cgpa.toFixed(1)}
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-border">
                <div
                  className="h-full rounded-full bg-accent-gradient"
                  style={{
                    width: `${Math.min(
                      (cgpa / 10) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] text-gray-600">
                Current academic score
              </p>
            </div>

            <div className="rounded-xl border border-bg-border bg-bg-hover p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Study Streak
                </p>

                <Flame
                  size={18}
                  className="text-orange-400"
                />
              </div>

              <p className="mt-3 text-3xl font-bold text-white">
                {streak}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                consecutive days
              </p>

              <div className="mt-4 rounded-lg bg-orange-500/5 px-3 py-2 text-[10px] text-orange-300">
                Keep the momentum going 🔥
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-yellow-500/10 bg-yellow-500/5 px-3 py-3 text-[10px] leading-5 text-gray-500">
            CGPA and streak are currently frontend values.
            They will be connected to the backend once the
            corresponding APIs are implemented.
          </div>
        </Card>
      </section>

      {/* Progress Overview */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Progress Overview
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Weekly learning momentum
              </p>
            </div>

            <div className="text-xs font-medium text-violet-400">
              Weekly progress
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={progressData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#6b7280",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#6b7280",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#151823",
                    border:
                      "1px solid #272b39",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{
                    color: "#ffffff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: "#8b5cf6",
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <Brain size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Progress Insights
              </p>

              <p className="text-xs text-gray-500">
                Keep building consistent study habits.
              </p>
            </div>
          </div>

          <div className="mt-5 flex-1 rounded-xl border border-bg-border bg-bg-hover p-4">
            <p className="text-sm leading-6 text-gray-300">
              Your weekly progress graph is currently powered by
              frontend data.
            </p>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              Later, when the backend provides a progress endpoint,
              we can replace the frontend data without redesigning
              this section.
            </p>
          </div>

          <Link
            to="/ai"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-3 text-sm font-semibold text-gray-300 transition hover:text-white"
          >
            Ask AI Mentor
            <ArrowUpRight size={16} />
          </Link>
        </Card>
      </section>

      {/* Quick Actions */}
      <section>
        <Card>
          <div className="mb-5">
            <p className="text-sm font-semibold text-white">
              Quick Actions
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Continue your StudentOS journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/learning"
              className="group flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-4 transition hover:border-purple-500/30"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
                <BookOpen size={19} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Study now
                </p>

                <p className="text-xs text-gray-500">
                  Continue learning
                </p>
              </div>

              <ArrowUpRight
                size={16}
                className="text-gray-600 transition group-hover:text-white"
              />
            </Link>

            <Link
              to="/placement"
              className="group flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-4 transition hover:border-purple-500/30"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Briefcase size={19} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Find jobs
                </p>

                <p className="text-xs text-gray-500">
                  Explore opportunities
                </p>
              </div>

              <ArrowUpRight
                size={16}
                className="text-gray-600 transition group-hover:text-white"
              />
            </Link>

            <Link
              to="/community"
              className="group flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-4 transition hover:border-purple-500/30"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-500/10 text-pink-400">
                <Users size={19} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Community
                </p>

                <p className="text-xs text-gray-500">
                  Connect with students
                </p>
              </div>

              <ArrowUpRight
                size={16}
                className="text-gray-600 transition group-hover:text-white"
              />
            </Link>

            <Link
              to="/profile"
              className="group flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-4 transition hover:border-purple-500/30"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
                <UserCircle size={19} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Profile
                </p>

                <p className="text-xs text-gray-500">
                  Update your details
                </p>
              </div>

              <ArrowUpRight
                size={16}
                className="text-gray-600 transition group-hover:text-white"
              />
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}