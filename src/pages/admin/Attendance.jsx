import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { dashboardService } from "../../services/dashboardService";

const getToday = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseRollNumbers = (value) => {
  return [
    ...new Set(
      value
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ];
};

export default function Attendance() {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(
    getToday()
  );

  const [presentText, setPresentText] =
    useState("");

  const [absentText, setAbsentText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const presentRollNumbers =
    parseRollNumbers(presentText);

  const absentRollNumbers =
    parseRollNumbers(absentText);

  const overlappingRollNumbers =
    presentRollNumbers.filter((rollNumber) =>
      absentRollNumbers.includes(
        rollNumber
      )
    );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!subject.trim()) {
      toast.error(
        "Subject is required."
      );
      return;
    }

    if (!date) {
      toast.error(
        "Attendance date is required."
      );
      return;
    }

    if (
      presentRollNumbers.length === 0 &&
      absentRollNumbers.length === 0
    ) {
      toast.error(
        "Add at least one present or absent roll number."
      );
      return;
    }

    if (
      overlappingRollNumbers.length > 0
    ) {
      toast.error(
        `These roll numbers are in both lists: ${overlappingRollNumbers.join(
          ", "
        )}`
      );
      return;
    }

    setLoading(true);

    const payload = {
      subject: subject.trim(),
      date,
      present_roll_numbers:
        presentRollNumbers,
      absent_roll_numbers:
        absentRollNumbers,
    };

    try {
      const response =
        await dashboardService.postBulkAttendance(
          payload
        );

      toast.success(
        response?.data?.message ||
          "Bulk attendance marked successfully."
      );

      setPresentText("");
      setAbsentText("");
    } catch (error) {
      console.error(
        "Bulk attendance error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      let message =
        "Could not mark bulk attendance.";

      if (Array.isArray(detail)) {
        message = detail
          .map(
            (item) =>
              item.msg || "Validation error"
          )
          .join(", ");
      } else if (
        typeof detail === "string"
      ) {
        message = detail;
      } else if (
        error?.response?.data?.message
      ) {
        message =
          error.response.data.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-violet-400">
          StudentOS Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white">
          Bulk Attendance
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          Mark attendance for multiple students in a single
          submission.
        </p>
      </div>

      <Card>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Subject + Date */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-400">
                Subject
              </label>

              <input
                value={subject}
                onChange={(event) =>
                  setSubject(
                    event.target.value
                  )
                }
                placeholder="e.g. DBMS"
                className="mt-1.5 w-full rounded-xl border border-bg-border bg-bg-hover px-3 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400">
                Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(
                      event.target.value
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-bg-border bg-bg-hover py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* Present / Absent */}
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Present Students
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500">
                    Enter roll numbers separated by commas or
                    new lines.
                  </p>
                </div>
              </div>

              <textarea
                value={presentText}
                onChange={(event) =>
                  setPresentText(
                    event.target.value
                  )
                }
                rows={10}
                placeholder={`CS-101
CS-102
CS-103`}
                className="mt-4 w-full resize-none rounded-xl border border-bg-border bg-bg-hover p-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-emerald-500/30"
              />

              <p className="mt-2 text-[11px] text-gray-600">
                {presentRollNumbers.length}{" "}
                student
                {presentRollNumbers.length ===
                1
                  ? ""
                  : "s"}
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-4">
              <div className="flex items-center gap-2">
                <XCircle
                  size={18}
                  className="text-red-400"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Absent Students
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500">
                    Enter roll numbers separated by commas or
                    new lines.
                  </p>
                </div>
              </div>

              <textarea
                value={absentText}
                onChange={(event) =>
                  setAbsentText(
                    event.target.value
                  )
                }
                rows={10}
                placeholder={`CS-104
CS-105
CS-106`}
                className="mt-4 w-full resize-none rounded-xl border border-bg-border bg-bg-hover p-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-red-500/30"
              />

              <p className="mt-2 text-[11px] text-gray-600">
                {absentRollNumbers.length}{" "}
                student
                {absentRollNumbers.length ===
                1
                  ? ""
                  : "s"}
              </p>
            </div>
          </div>

          {/* Overlap warning */}
          {overlappingRollNumbers.length >
            0 && (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
              These students appear in both
              lists:
              <span className="ml-1 font-semibold">
                {overlappingRollNumbers.join(
                  ", "
                )}
              </span>
            </div>
          )}

          {/* Summary */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-bg-border bg-bg-hover p-4">
              <p className="text-xs text-gray-500">
                Subject
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {subject || "Not selected"}
              </p>
            </div>

            <div className="rounded-xl border border-bg-border bg-bg-hover p-4">
              <p className="text-xs text-gray-500">
                Present
              </p>

              <p className="mt-1 text-lg font-bold text-emerald-400">
                {presentRollNumbers.length}
              </p>
            </div>

            <div className="rounded-xl border border-bg-border bg-bg-hover p-4">
              <p className="text-xs text-gray-500">
                Absent
              </p>

              <p className="mt-1 text-lg font-bold text-red-400">
                {absentRollNumbers.length}
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end border-t border-bg-border pt-5">
            <Button
              type="submit"
              disabled={loading}
            >
              <Send size={15} />

              {loading
                ? "Submitting..."
                : "Mark Bulk Attendance"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}