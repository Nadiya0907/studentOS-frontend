import { useEffect, useState } from "react";
import {
  FileText,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { adminService } from "../../services/adminService";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);

    try {
      const response =
        await adminService.getReports();

      const data =
        response?.data || response;

      setReports(
        Array.isArray(data?.reports)
          ? data.reports
          : []
      );
    } catch (error) {
      console.error(
        "Admin reports error:",
        error
      );

      toast.error(
        "Unable to load reports."
      );

      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-400">
            StudentOS Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            Reports
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Available administrative reports.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReports}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports found"
          description="The backend did not return any reports."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report, index) => (
            <Card key={`${report}-${index}`}>
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
                  <FileText size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {report}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Administrative report
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