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
  Flame,
  Target,
  CalendarCheck2,
  GraduationCap,
  Brain,
  Plus,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Users,
  UserCircle,
} from "lucide-react";

import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import { dashboardService } from "../services/dashboardService";

export default function Dashboard() {
  const { onMenu } = useOutletContext() || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const response = await dashboardService.getDashboard();

        if (mounted) {
          setData(response?.data || response);
        }
      } catch (err) {
        if (mounted) {
          setError("Live dashboard unavailable; showing demo data.");
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
  }, []);

  const demoData = {
    attendance: 87,
    cgpa: 8.6,
    streak: 12,
    goalsCompleted: 4,
    goalsTotal: 6,

    progress: [
      { day: "Mon", value: 40 },
      { day: "Tue", value: 55 },
      { day: "Wed", value: 48 },
      { day: "Thu", value: 70 },
      { day: "Fri", value: 65 },
      { day: "Sat", value: 82 },
      { day: "Sun", value: 90 },
    ],

    goals: [
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
        title: "Watch React lecture",
        done: true,
      },
      {
        id: 4,
        title: "Apply to 2 internships",
        done: false,
      },
      {
        id: 5,
        title: "Practice SQL queries",
        done: false,
      },
      {
        id: 6,
        title: "Revise operating systems",
        done: false,
      },
    ],
  };

  const stats = {
    ...demoData,
    ...(data || {}),
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const attendance = Number(stats.attendance || 0);
  const cgpa = Number(stats.cgpa || 0);
  const streak = Number(stats.streak || 0);
  const goalsCompleted = Number(stats.goalsCompleted || 0);
  const goalsTotal = Number(stats.goalsTotal || 0);

  const goalPercentage =
    goalsTotal > 0
      ? Math.round((goalsCompleted / goalsTotal) * 100)
      : 0;

  const cards = [
    {
      label: "Attendance",
      value: `${attendance}%`,
      icon: CalendarCheck2,
      iconClass: "text-cyan-300",
      progress: attendance,
      description: "Overall attendance",
    },
    {
      label: "CGPA",
      value: cgpa.toFixed(1),
      icon: GraduationCap,
      iconClass: "text-violet-300",
      progress: (cgpa / 10) * 100,
      description: "Current academic score",
    },
    {
      label: "Streak",
      value: `${streak} days`,
      icon: Flame,
      iconClass: "text-orange-300",
      progress: null,
      description: "Keep the momentum",
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

  const goals =
    Array.isArray(stats.goals) && stats.goals.length > 0
      ? stats.goals
      : demoData.goals;

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

      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-2xl border border-bg-border bg-bg-card p-6">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              StudentOS Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              Good evening 👋
            </h1>

            <p className="mt-2 max-w-xl text-sm text-gray-400">
              Keep your momentum going. Here’s what your StudentOS week
              looks like.
            </p>
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

      {/* Error / mock data notice */}
      {error && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          {error}
        </div>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.label} className="relative overflow-hidden">
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
                          Math.max(card.progress, 0),
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

      {/* Main dashboard content */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Progress */}
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

            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <ArrowUpRight size={14} />
              +18% this week
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.progress || demoData.progress}
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
                    border: "1px solid #272b39",
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

        {/* AI Mentor */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <Brain size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                AI Mentor
              </p>

              <p className="text-xs text-gray-500">
                Personalized next step
              </p>
            </div>
          </div>

          <div className="mt-5 flex-1 rounded-xl border border-bg-border bg-bg-hover p-4">
            <p className="text-sm leading-6 text-gray-300">
              You’re 2 topics behind in DBMS. Want a 3-day catch-up plan?
            </p>
          </div>

          <Link
            to="/ai"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent-gradient px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Open AI Mentor
            <ArrowUpRight size={16} />
          </Link>
        </Card>
      </section>

      {/* Goals + Quick actions */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Daily Goals */}
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Daily Goals
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Small wins compound
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border border-bg-border bg-bg-hover px-3 py-2 text-xs text-gray-400 transition hover:text-white"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {goals.slice(0, 6).map((goal, index) => (
              <div
                key={goal.id || index}
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
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="mb-5">
            <p className="text-sm font-semibold text-white">
              Quick Actions
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Jump back into your student journey
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  Join community
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
                  Update profile
                </p>
                <p className="text-xs text-gray-500">
                  Keep your profile fresh
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