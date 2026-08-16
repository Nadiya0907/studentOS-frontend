import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Plus,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { placementService } from "../../services/placementService";

const emptyForm = {
  title: "",
  company_name: "",
  role: "",
  location: "",
  stipend: "",
  duration: "",
};

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  // --------------------------------------------------
  // LOAD INTERNSHIPS
  // --------------------------------------------------

  const loadInternships = async () => {
    setLoading(true);

    try {
      const response =
        await placementService.getInternships();

      const items =
        response?.data?.internships ||
        response?.data ||
        response?.internships ||
        [];

      setInternships(
        Array.isArray(items) ? items : []
      );
    } catch (error) {
      console.error(
        "Internships load error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      let message =
        "Could not load internships.";

      if (Array.isArray(detail)) {
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
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const handleChange = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // --------------------------------------------------
  // CREATE INTERNSHIP
  // --------------------------------------------------

  const createInternship = async () => {
    if (!form.title.trim()) {
      toast.error(
        "Internship title is required."
      );
      return;
    }

    if (!form.company_name.trim()) {
      toast.error(
        "Company name is required."
      );
      return;
    }

    if (!form.role.trim()) {
      toast.error("Role is required.");
      return;
    }

    if (!form.location.trim()) {
      toast.error(
        "Location is required."
      );
      return;
    }

    if (!form.stipend.trim()) {
      toast.error(
        "Stipend is required."
      );
      return;
    }

    if (!form.duration.trim()) {
      toast.error(
        "Duration is required."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        company_name:
          form.company_name.trim(),
        role: form.role.trim(),
        location:
          form.location.trim(),
        stipend:
          form.stipend.trim(),
        duration:
          form.duration.trim(),
      };

      const response =
        await placementService.createInternship(
          payload
        );

      const created =
        response?.data?.internship ||
        response?.internship;

      if (created) {
        setInternships((current) => [
          created,
          ...current,
        ]);
      } else {
        await loadInternships();
      }

      toast.success(
        response?.data?.message ||
          response?.message ||
          "Internship added successfully."
      );

      setForm(emptyForm);
      setShowForm(false);
    } catch (error) {
      console.error(
        "Create internship error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      let message =
        "Could not add internship.";

      if (Array.isArray(detail)) {
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
      } else if (
        error?.response?.data?.message
      ) {
        message =
          error.response.data.message;
      }

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE INTERNSHIP
  // --------------------------------------------------

  const deleteInternship = async (
    internship
  ) => {
    const id =
      internship.id ||
      internship._id ||
      internship.internship_id;

    if (!id) {
      toast.error(
        "Internship ID is missing."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${
          internship.title ||
          internship.company_name ||
          internship.name ||
          "this internship"
        }"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await placementService.deleteInternship(
          id
        );

      setInternships((current) =>
        current.filter(
          (item) =>
            (item.id ||
              item._id ||
              item.internship_id) !== id
        )
      );

      toast.success(
        response?.data?.message ||
          "Internship deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete internship error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      let message =
        "Could not delete internship.";

      if (Array.isArray(detail)) {
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
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-400">
            StudentOS Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            Internships
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage internship opportunities for students.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadInternships}
            className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              setShowForm(
                (current) => !current
              )
            }
            className="inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white"
          >
            {showForm ? (
              <X size={14} />
            ) : (
              <Plus size={14} />
            )}

            {showForm
              ? "Close"
              : "Add Internship"}
          </button>
        </div>
      </div>

      {/* Add Internship Form */}
      {showForm && (
        <Card>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">
              Add Internship
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Create an internship entry for students.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <input
              value={form.title}
              onChange={(event) =>
                handleChange(
                  "title",
                  event.target.value
                )
              }
              placeholder="Internship title"
              className="rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
            />

            {/* Company */}
            <input
              value={form.company_name}
              onChange={(event) =>
                handleChange(
                  "company_name",
                  event.target.value
                )
              }
              placeholder="Company name"
              className="rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
            />

            {/* Role */}
            <input
              value={form.role}
              onChange={(event) =>
                handleChange(
                  "role",
                  event.target.value
                )
              }
              placeholder="Role"
              className="rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
            />

            {/* Location */}
            <input
              value={form.location}
              onChange={(event) =>
                handleChange(
                  "location",
                  event.target.value
                )
              }
              placeholder="Location"
              className="rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
            />

            {/* Stipend */}
            <input
              value={form.stipend}
              onChange={(event) =>
                handleChange(
                  "stipend",
                  event.target.value
                )
              }
              placeholder="Stipend"
              className="rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
            />

            {/* Duration */}
            <input
              value={form.duration}
              onChange={(event) =>
                handleChange(
                  "duration",
                  event.target.value
                )
              }
              placeholder="Duration (e.g. 3 months)"
              className="rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={createInternship}
              disabled={saving}
              className="rounded-xl bg-accent-gradient px-5 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Add Internship"}
            </button>
          </div>
        </Card>
      )}

      {/* Internship List */}
      {loading ? (
        <div className="grid h-60 place-items-center">
          <Spinner />
        </div>
      ) : internships.length === 0 ? (
        <EmptyState
          title="No internships found"
          description="Add an internship to get started."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {internships.map(
            (internship, index) => {
              const id =
                internship.id ||
                internship._id ||
                internship.internship_id ||
                index;

              return (
                <Card key={id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <BriefcaseBusiness
                        size={20}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteInternship(
                          internship
                        )
                      }
                      className="grid h-8 w-8 place-items-center rounded-lg text-gray-600 hover:bg-red-500/10 hover:text-red-400"
                      title="Delete internship"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-white">
                    {internship.title ||
                      internship.company_name ||
                      internship.name ||
                      "Internship"}
                  </h3>

                  <p className="mt-1 text-sm text-emerald-300">
                    {internship.role ||
                      "Role not specified"}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <p>
                      Company:{" "}
                      <span className="text-gray-300">
                        {internship.company_name ||
                          "N/A"}
                      </span>
                    </p>

                    <p>
                      Location:{" "}
                      <span className="text-gray-300">
                        {internship.location ||
                          "N/A"}
                      </span>
                    </p>

                    <p>
                      Stipend:{" "}
                      <span className="text-gray-300">
                        {internship.stipend ||
                          "N/A"}
                      </span>
                    </p>

                    <p>
                      Duration:{" "}
                      <span className="text-gray-300">
                        {internship.duration ||
                          "N/A"}
                      </span>
                    </p>
                  </div>
                </Card>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}