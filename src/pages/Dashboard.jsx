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
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

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

  // --------------------------------------------------
  // GOALS STATE
  // --------------------------------------------------

  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [goalSaving, setGoalSaving] = useState(false);
  const [goalDeletingId, setGoalDeletingId] = useState(null);
  const [goalUpdatingId, setGoalUpdatingId] = useState(null);

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [goalTitle, setGoalTitle] = useState("");

  // --------------------------------------------------
  // LOAD MAIN DASHBOARD
  // --------------------------------------------------

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

  // --------------------------------------------------
  // LOAD GOALS
  // --------------------------------------------------

  const loadGoals = async () => {
    setGoalsLoading(true);

    try {
      const response =
        await dashboardService.getGoals();

      const rawGoals =
        response?.data?.goals ||
        response?.data ||
        response?.goals ||
        [];

      const normalizedGoals =
        Array.isArray(rawGoals)
          ? rawGoals.map((goal) => ({
              ...goal,
              id:
                goal.id ||
                goal._id ||
                goal.goal_id,
              title:
                goal.title || "",
              is_completed:
                Boolean(
                  goal.is_completed
                ),
            }))
          : [];

      setGoals(normalizedGoals);
    } catch (error) {
      console.error(
        "Goals load error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      if (
        typeof detail === "string"
      ) {
        toast.error(detail);
      } else {
        toast.error(
          "Could not load your goals."
        );
      }

      setGoals([]);
    } finally {
      setGoalsLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // --------------------------------------------------
  // GOAL HELPERS
  // --------------------------------------------------

  const resetGoalForm = () => {
    setGoalTitle("");
    setEditingGoalId(null);
    setShowGoalForm(false);
  };

  const openAddGoal = () => {
    setGoalTitle("");
    setEditingGoalId(null);
    setShowGoalForm(true);
  };

  const openEditGoal = (goal) => {
    setGoalTitle(goal.title || "");
    setEditingGoalId(goal.id);
    setShowGoalForm(true);
  };

  const saveGoal = async () => {
    const title = goalTitle.trim();

    if (!title) {
      toast.error(
        "Goal title is required."
      );
      return;
    }

    setGoalSaving(true);

    try {
      if (editingGoalId) {
        const existingGoal =
          goals.find(
            (goal) =>
              goal.id ===
              editingGoalId
          );

        const payload = {
          title,
          is_completed:
            Boolean(
              existingGoal?.is_completed
            ),
        };

        const response =
          await dashboardService.updateGoal(
            editingGoalId,
            payload
          );

        const updatedGoal =
          response?.data?.goal ||
          response?.data ||
          response?.goal;

        setGoals((current) =>
          current.map((goal) =>
            goal.id === editingGoalId
              ? {
                  ...goal,
                  ...(updatedGoal || {}),
                  title,
                  is_completed:
                    payload.is_completed,
                }
              : goal
          )
        );

        toast.success(
          response?.data?.message ||
            "Goal updated successfully."
        );
      } else {
        const payload = {
          title,
          is_completed: false,
        };

        const response =
          await dashboardService.createGoal(
            payload
          );

        const createdGoal =
          response?.data?.goal ||
          response?.data ||
          response?.goal;

        if (createdGoal) {
          setGoals((current) => [
            {
              ...createdGoal,
              id:
                createdGoal.id ||
                createdGoal._id ||
                createdGoal.goal_id,
              title:
                createdGoal.title ||
                title,
              is_completed:
                Boolean(
                  createdGoal.is_completed
                ),
            },
            ...current,
          ]);
        } else {
          await loadGoals();
        }

        toast.success(
          response?.data?.message ||
            "Goal added successfully."
        );
      }

      resetGoalForm();
    } catch (error) {
      console.error(
        "Save goal error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      let message =
        editingGoalId
          ? "Could not update goal."
          : "Could not add goal.";

      if (
        Array.isArray(detail)
      ) {
        message = detail
          .map(
            (item) =>
              item?.msg ||
              "Validation error"
          )
          .join(", ");
      } else if (
        typeof detail === "string"
      ) {
        message = detail;
      }

      toast.error(message);
    } finally {
      setGoalSaving(false);
    }
  };

  const toggleGoal = async (goal) => {
    if (!goal?.id) {
      toast.error(
        "Goal ID is missing."
      );
      return;
    }

    const newCompleted =
      !goal.is_completed;

    setGoalUpdatingId(goal.id);

    try {
      const payload = {
        title: goal.title,
        is_completed:
          newCompleted,
      };

      const response =
        await dashboardService.updateGoal(
          goal.id,
          payload
        );

      const updatedGoal =
        response?.data?.goal ||
        response?.data ||
        response?.goal;

      setGoals((current) =>
        current.map((item) =>
          item.id === goal.id
            ? {
                ...item,
                ...(updatedGoal || {}),
                title:
                  updatedGoal?.title ||
                  item.title,
                is_completed:
                  Boolean(
                    updatedGoal?.is_completed ??
                      newCompleted
                  ),
              }
            : item
        )
      );

      toast.success(
        newCompleted
          ? "Goal completed."
          : "Goal marked incomplete."
      );
    } catch (error) {
      console.error(
        "Toggle goal error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not update goal."
      );
    } finally {
      setGoalUpdatingId(null);
    }
  };

  const deleteGoal = async (goal) => {
    if (!goal?.id) {
      toast.error(
        "Goal ID is missing."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${goal.title}"?`
      );

    if (!confirmed) {
      return;
    }

    setGoalDeletingId(goal.id);

    try {
      const response =
        await dashboardService.deleteGoal(
          goal.id
        );

      setGoals((current) =>
        current.filter(
          (item) =>
            item.id !== goal.id
        )
      );

      toast.success(
        response?.data?.message ||
          "Goal deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete goal error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not delete goal."
      );
    } finally {
      setGoalDeletingId(null);
    }
  };

  // --------------------------------------------------
  // DASHBOARD DATA
  // --------------------------------------------------

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

  // --------------------------------------------------
  // TEMPORARY CGPA / STREAK
  // --------------------------------------------------

  const cgpa = 8.6;
  const streak = 12;

  // --------------------------------------------------
  // GOAL STATS
  // --------------------------------------------------

  const goalsCompleted =
    goals.filter(
      (goal) =>
        Boolean(goal.is_completed)
    ).length;

  const goalsTotal =
    goals.length;

  const goalPercentage =
    goalsTotal > 0
      ? Math.round(
          (goalsCompleted /
            goalsTotal) *
            100
        )
      : 0;

  // --------------------------------------------------
  // GRAPH
  // --------------------------------------------------

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
      progress:
        attendancePercentage,
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

      {/* Goals + Academic Snapshot */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Goals */}
        <Card>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Daily Goals
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Small wins compound.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">
                {goalPercentage}% complete
              </div>

              <button
                type="button"
                onClick={openAddGoal}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-3 py-2 text-xs font-semibold text-white"
              >
                <Plus size={14} />
                Add Goal
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-bg-border">
            <div
              className="h-full rounded-full bg-accent-gradient transition-all"
              style={{
                width: `${goalPercentage}%`,
              }}
            />
          </div>

          {/* Add/Edit form */}
          {showGoalForm && (
            <div className="mb-5 rounded-xl border border-bg-border bg-bg-hover p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {editingGoalId
                      ? "Edit Goal"
                      : "Add Goal"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Enter your goal below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    resetGoalForm
                  }
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-bg-card hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>

              <input
                value={goalTitle}
                onChange={(event) =>
                  setGoalTitle(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !goalSaving
                  ) {
                    saveGoal();
                  }
                }}
                placeholder="Enter goal title..."
                autoFocus
                className="mt-4 w-full rounded-xl border border-bg-border bg-bg-card px-3 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500/50"
              />

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={
                    resetGoalForm
                  }
                  disabled={goalSaving}
                  className="rounded-xl border border-bg-border bg-bg-card px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveGoal}
                  disabled={
                    goalSaving ||
                    !goalTitle.trim()
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {goalSaving ? (
                    <RefreshCw
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={14} />
                  )}

                  {editingGoalId
                    ? "Save Changes"
                    : "Add Goal"}
                </button>
              </div>
            </div>
          )}

          {/* Goal list */}
          {goalsLoading ? (
            <div className="grid h-40 place-items-center">
              <Spinner />
            </div>
          ) : goals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-bg-border bg-bg-hover p-6 text-center">
              <Target
                size={24}
                className="mx-auto text-gray-600"
              />

              <p className="mt-3 text-sm font-semibold text-gray-300">
                No goals yet
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Add your first goal to get started.
              </p>

              <button
                type="button"
                onClick={openAddGoal}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white"
              >
                <Plus size={14} />
                Add Goal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => {
                const completed =
                  Boolean(
                    goal.is_completed
                  );

                const updating =
                  goalUpdatingId ===
                  goal.id;

                const deleting =
                  goalDeletingId ===
                  goal.id;

                return (
                  <div
                    key={goal.id}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition ${
                      completed
                        ? "border-emerald-500/10 bg-emerald-500/5"
                        : "border-bg-border bg-bg-hover"
                    }`}
                  >
                    {/* Complete button */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleGoal(goal)
                      }
                      disabled={
                        updating ||
                        deleting
                      }
                      title={
                        completed
                          ? "Mark incomplete"
                          : "Mark complete"
                      }
                      className="shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updating ? (
                        <RefreshCw
                          size={19}
                          className="animate-spin text-violet-400"
                        />
                      ) : (
                        <CheckCircle2
                          size={19}
                          className={
                            completed
                              ? "text-emerald-400"
                              : "text-gray-600 hover:text-emerald-400"
                          }
                        />
                      )}
                    </button>

                    {/* Title */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleGoal(goal)
                      }
                      disabled={
                        updating ||
                        deleting
                      }
                      className={`min-w-0 flex-1 text-left text-sm ${
                        completed
                          ? "text-gray-500 line-through"
                          : "text-gray-200"
                      }`}
                    >
                      {goal.title}
                    </button>

                    {/* Actions */}
                    <button
                      type="button"
                      onClick={() =>
                        openEditGoal(goal)
                      }
                      disabled={
                        updating ||
                        deleting
                      }
                      title="Edit goal"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-600 transition hover:bg-violet-500/10 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteGoal(goal)
                      }
                      disabled={
                        updating ||
                        deleting
                      }
                      title="Delete goal"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deleting ? (
                        <RefreshCw
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 text-[10px] text-gray-600">
            Goals are synchronized with your StudentOS backend.
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
            CGPA and streak are still using the existing
            Dashboard values until their backend responses
            are verified.
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
                    background:
                      "#151823",
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
              Your weekly progress graph is currently
              powered by frontend data.
            </p>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              When the backend provides a progress endpoint,
              this section can be connected without redesigning
              the Dashboard.
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