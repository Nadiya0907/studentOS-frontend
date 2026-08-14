import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Briefcase,
  GraduationCap,
  Upload,
  MapPin,
  FileText,
  Star,
  Search,
  Clock3,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { placementService } from "../services/placementService";

const tabs = [
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
  },
  {
    id: "companies",
    label: "Companies",
    icon: Building2,
  },
  {
    id: "internships",
    label: "Internships",
    icon: GraduationCap,
  },
];

const mockData = {
  jobs: [
    {
      id: 1,
      title: "Junior React Developer",
      company: "TechNova Solutions",
      location: "Bengaluru, India",
      skills: ["React", "JavaScript", "REST API"],
      type: "Full Time",
      experience: "0-2 years",
      salary: "₹5-8 LPA",
      posted: "2 days ago",
      recommended: true,
    },
    {
      id: 2,
      title: "Java Backend Developer",
      company: "CloudBridge Technologies",
      location: "Hyderabad, India",
      skills: ["Java", "Spring Boot", "SQL"],
      type: "Full Time",
      experience: "0-2 years",
      salary: "₹6-9 LPA",
      posted: "4 days ago",
      recommended: true,
    },
    {
      id: 3,
      title: "Software Engineer",
      company: "Innovate Labs",
      location: "Pune, India",
      skills: ["Java", "Python", "DSA"],
      type: "Full Time",
      experience: "Fresher",
      salary: "₹4-7 LPA",
      posted: "1 week ago",
      recommended: false,
    },
  ],

  companies: [
    {
      id: 1,
      name: "TechNova Solutions",
      industry: "Information Technology",
      location: "Bengaluru",
      openings: 12,
      rating: 4.5,
    },
    {
      id: 2,
      name: "CloudBridge Technologies",
      industry: "Software & Cloud",
      location: "Hyderabad",
      openings: 8,
      rating: 4.3,
    },
    {
      id: 3,
      name: "Innovate Labs",
      industry: "Technology",
      location: "Pune",
      openings: 15,
      rating: 4.6,
    },
  ],

  internships: [
    {
      id: 1,
      title: "Frontend Development Intern",
      company: "TechNova Solutions",
      location: "Remote",
      skills: ["React", "JavaScript", "HTML", "CSS"],
      duration: "6 months",
      stipend: "₹20,000/month",
      posted: "1 day ago",
      recommended: true,
    },
    {
      id: 2,
      title: "Java Development Intern",
      company: "CloudBridge Technologies",
      location: "Hyderabad",
      skills: ["Java", "Spring Boot", "MySQL"],
      duration: "4 months",
      stipend: "₹15,000/month",
      posted: "3 days ago",
      recommended: true,
    },
    {
      id: 3,
      title: "Software Engineering Intern",
      company: "Innovate Labs",
      location: "Remote",
      skills: ["Python", "DSA", "Git"],
      duration: "3 months",
      stipend: "₹12,000/month",
      posted: "5 days ago",
      recommended: false,
    },
  ],
};

const normalizeJobs = (jobs) =>
  jobs.map((job) => ({
    ...job,
    id: job._id || job.id,
    title: job.title || "Job Opportunity",
    company:
      job.company_name ||
      job.company ||
      "Company not specified",
    location: job.location || "Location not specified",
    type: job.job_type || job.type || "Job",
    salary:
      job.stipend_salary ||
      job.salary ||
      "Salary not specified",
    description: job.description || "",
    skills: job.skills_required
      ? String(job.skills_required)
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : Array.isArray(job.skills)
      ? job.skills
      : [],
    posted: job.posted_date || job.posted || "",
    apply_link: job.apply_link || "",
    posted_by: job.posted_by || "Placement Cell",
    recommended: Boolean(job.recommended),
  }));

export default function Placement() {
  const { onMenu } = useOutletContext() || {};

  const [active, setActive] = useState("jobs");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPlacementData = async () => {
      setLoading(true);
      setUsingDemoData(false);

      try {
        let response;

        if (active === "jobs") {
          response = await placementService.getJobs();

          const jobs =
            response?.data?.jobs ||
            response?.jobs ||
            [];

          if (mounted) {
            if (Array.isArray(jobs) && jobs.length > 0) {
              setItems(normalizeJobs(jobs));
            } else {
              setItems(mockData.jobs);
              setUsingDemoData(true);
            }
          }
        } else if (active === "companies") {
          response = await placementService.getCompanies();

          const companies =
            response?.data?.companies ||
            response?.data ||
            response?.companies ||
            [];

          if (mounted) {
            if (
              Array.isArray(companies) &&
              companies.length > 0
            ) {
              setItems(companies);
            } else {
              setItems(mockData.companies);
              setUsingDemoData(true);
            }
          }
        } else if (active === "internships") {
          response = await placementService.getInternships();

          const internships =
            response?.data?.internships ||
            response?.data ||
            response?.internships ||
            [];

          if (mounted) {
            if (
              Array.isArray(internships) &&
              internships.length > 0
            ) {
              setItems(internships);
            } else {
              setItems(mockData.internships);
              setUsingDemoData(true);
            }
          }
        }
      } catch (error) {
        console.error(
          `Placement ${active} error:`,
          error
        );

        if (mounted) {
          setItems(mockData[active]);
          setUsingDemoData(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPlacementData();

    return () => {
      mounted = false;
    };
  }, [active]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      const text = `
        ${item.title || ""}
        ${item.name || ""}
        ${item.company || ""}
        ${item.company_name || ""}
        ${item.industry || ""}
        ${item.location || ""}
        ${Array.isArray(item.skills)
          ? item.skills.join(" ")
          : item.skills_required || ""}
        ${item.description || ""}
      `.toLowerCase();

      return text.includes(query);
    });
  }, [items, search]);

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Please upload your resume as a PDF.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await placementService.uploadResume(formData);

      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Resume upload error:", error);

      toast.error(
        "Resume upload endpoint is not available in the current backend yet."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const openJob = (item) => {
    if (item.apply_link) {
      window.open(
        item.apply_link,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      toast("This job does not have an application link yet.");
    }
  };

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

      {/* Header */}
      <section className="rounded-2xl border border-bg-border bg-bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              StudentOS Placement
            </p>

            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              Find your next opportunity.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Discover jobs, internships and companies that match your
              skills and career goals.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-bg-border bg-bg-hover p-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles size={21} />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Career readiness
              </p>

              <p className="text-sm font-semibold text-white">
                Build your profile
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resume + ATS */}
      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
              <FileText size={22} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Resume + ATS Review
              </h2>

              <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500">
                Upload your latest resume and prepare for applications.
                Your AI-powered ATS review can help identify areas for
                improvement.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-bg-border bg-bg-hover px-3 py-1 text-[10px] text-gray-400">
                  ATS friendly
                </span>

                <span className="rounded-full border border-bg-border bg-bg-hover px-3 py-1 text-[10px] text-gray-400">
                  PDF
                </span>

                <span className="rounded-full border border-bg-border bg-bg-hover px-3 py-1 text-[10px] text-gray-400">
                  Max 5 MB
                </span>
              </div>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent-gradient px-4 py-3 text-xs font-semibold text-white transition hover:opacity-90">
            <Upload size={16} />

            {uploading
              ? "Uploading..."
              : "Upload Resume"}

            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={uploadResume}
              disabled={uploading}
            />
          </label>
        </div>
      </Card>

      {/* Demo / pending backend notice */}
      {usingDemoData && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          This section is currently using frontend demo data because
          the corresponding backend endpoint is not available yet.
        </div>
      )}

      {/* Search + tabs */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActive(tab.id);
                  setSearch("");
                }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                  active === tab.id
                    ? "bg-accent-gradient text-white"
                    : "border border-bg-border bg-bg-hover text-gray-500 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex w-full items-center gap-2 rounded-xl border border-bg-border bg-bg-card px-3 py-2.5 lg:w-80">
          <Search
            size={16}
            className="shrink-0 text-gray-500"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={`Search ${active}...`}
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs text-gray-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Section heading */}
      <div>
        <h2 className="text-lg font-semibold text-white">
          {active === "jobs"
            ? "Recommended Jobs"
            : active === "companies"
            ? "Companies"
            : "Internship Opportunities"}
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          {filteredItems.length} opportunity
          {filteredItems.length === 1
            ? ""
            : "ies"}{" "}
          available
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={`No ${active} found`}
          description="Try another search term or check the backend availability."
        />
      ) : active === "companies" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((company, index) => (
            <Card
              key={company.id || company._id || index}
              className="group transition hover:-translate-y-0.5 hover:border-purple-500/30"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Building2 size={22} />
                </div>

                <div className="flex items-center gap-1 rounded-full border border-bg-border bg-bg-hover px-2.5 py-1 text-[10px] text-yellow-400">
                  <Star size={12} fill="currentColor" />
                  {company.rating || "4.5"}
                </div>
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                {company.name || "Company"}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {company.industry || "Technology"}
              </p>

              {company.location && (
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={14} />
                  {company.location}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between rounded-xl border border-bg-border bg-bg-hover px-3 py-3">
                <span className="text-xs text-gray-500">
                  Open positions
                </span>

                <span className="text-sm font-semibold text-white">
                  {company.openings || 0}
                </span>
              </div>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-xs font-semibold text-gray-300 transition hover:text-white"
              >
                View Company
                <ExternalLink size={14} />
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id || item._id || index}
              className="group transition hover:border-purple-500/30"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
                  {active === "jobs" ? (
                    <Briefcase size={21} />
                  ) : (
                    <GraduationCap size={21} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {item.title ||
                          item.name ||
                          "Opportunity"}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-violet-400">
                        {item.company ||
                          item.company_name ||
                          "Student opportunity"}
                      </p>
                    </div>

                    {item.recommended && (
                      <span className="flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                        <Sparkles size={11} />
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                    {item.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        {item.location}
                      </span>
                    )}

                    {(item.type || item.job_type) && (
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={13} />
                        {item.type ||
                          item.job_type}
                      </span>
                    )}

                    {item.experience && (
                      <span className="flex items-center gap-1.5">
                        <GraduationCap size={13} />
                        {item.experience}
                      </span>
                    )}

                    {item.duration && (
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {item.duration}
                      </span>
                    )}
                  </div>

                  {Array.isArray(item.skills) &&
                    item.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-bg-border bg-bg-hover px-2.5 py-1 text-[10px] text-gray-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                  {item.skills_required &&
                    !Array.isArray(item.skills) && (
                      <div className="mt-4">
                        <p className="text-[10px] uppercase tracking-wide text-gray-600">
                          Skills required
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-400">
                          {item.skills_required}
                        </p>
                      </div>
                    )}

                  {item.description && (
                    <p className="mt-4 text-xs leading-5 text-gray-500">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-5 flex flex-col gap-3 border-t border-bg-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.salary ||
                          item.stipend ||
                          item.stipend_salary ||
                          "Opportunity available"}
                      </p>

                      {(
                        item.posted ||
                        item.posted_date
                      ) && (
                        <p className="mt-1 text-[10px] text-gray-600">
                          Posted{" "}
                          {item.posted ||
                            item.posted_date}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          active === "jobs"
                        ) {
                          openJob(item);
                        } else {
                          toast(
                            "Internship application endpoint is not available yet."
                          );
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      View Opportunity
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Career readiness */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Career readiness
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Keep your resume, skills and profile updated before applying.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
          >
            Review Profile
          </button>
        </div>
      </Card>
    </div>
  );
}