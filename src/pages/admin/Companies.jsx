import { useEffect, useState } from "react";
import {
  Building2,
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
  name: "",
  role: "",
  location: "",
  package: "",
};

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState(emptyForm);

  const loadCompanies = async () => {
    setLoading(true);

    try {
      const response =
        await placementService.getCompanies();

      const items =
        response?.data?.companies ||
        response?.data ||
        response?.companies ||
        [];

      setCompanies(
        Array.isArray(items)
          ? items
          : []
      );
    } catch (error) {
      console.error(
        "Companies error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          "Could not load companies."
      );

      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleChange = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const createCompany = async () => {
    if (!form.name.trim()) {
      toast.error(
        "Company name is required."
      );
      return;
    }

    if (!form.role.trim()) {
      toast.error(
        "Role is required."
      );
      return;
    }

    if (!form.location.trim()) {
      toast.error(
        "Location is required."
      );
      return;
    }

    if (!form.package.trim()) {
      toast.error(
        "Package is required."
      );
      return;
    }

    setSaving(true);

    try {
      const response =
        await placementService.createCompany(
          {
            name: form.name.trim(),
            role: form.role.trim(),
            location:
              form.location.trim(),
            package:
              form.package.trim(),
          }
        );

      const created =
        response?.data?.company ||
        response?.company;

      if (created) {
        setCompanies((current) => [
          created,
          ...current,
        ]);
      } else {
        await loadCompanies();
      }

      toast.success(
        response?.data?.message ||
          "Company added successfully."
      );

      setForm(emptyForm);
      setShowForm(false);
    } catch (error) {
      console.error(
        "Create company error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Could not add company."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteCompany = async (
    company
  ) => {
    const id =
      company.id ||
      company._id;

    if (!id) {
      toast.error(
        "Company ID is missing."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${
          company.name ||
          "this company"
        }"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await placementService.deleteCompany(
        id
      );

      setCompanies((current) =>
        current.filter(
          (item) =>
            (item.id ||
              item._id) !== id
        )
      );

      toast.success(
        "Company deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete company error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          "Could not delete company."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-400">
            StudentOS Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            Companies
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage companies and placement opportunities.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadCompanies}
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
              : "Add Company"}
          </button>
        </div>
      </div>

      {showForm && (
        <Card>
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">
              Add Company
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Create a company entry for students.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(event) =>
                handleChange(
                  "name",
                  event.target.value
                )
              }
              placeholder="Company name"
              className="rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
            />

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

            <input
              value={form.package}
              onChange={(event) =>
                handleChange(
                  "package",
                  event.target.value
                )
              }
              placeholder="Package"
              className="rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={createCompany}
              disabled={saving}
              className="rounded-xl bg-accent-gradient px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Add Company"}
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="grid h-60 place-items-center">
          <Spinner />
        </div>
      ) : companies.length ===
        0 ? (
        <EmptyState
          title="No companies found"
          description="Add a company to get started."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {companies.map(
            (company, index) => {
              const id =
                company.id ||
                company._id ||
                index;

              return (
                <Card key={id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
                      <Building2 size={20} />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteCompany(
                          company
                        )
                      }
                      className="grid h-8 w-8 place-items-center rounded-lg text-gray-600 hover:bg-red-500/10 hover:text-red-400"
                      title="Delete company"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-white">
                    {company.name ||
                      company.title ||
                      "Company"}
                  </h3>

                  <p className="mt-1 text-sm text-violet-300">
                    {company.role ||
                      "Role not specified"}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <p>
                      Location:{" "}
                      <span className="text-gray-300">
                        {company.location ||
                          "N/A"}
                      </span>
                    </p>

                    <p>
                      Package:{" "}
                      <span className="text-gray-300">
                        {company.package ||
                          company.salary ||
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