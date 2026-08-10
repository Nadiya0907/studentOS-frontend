import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  BookOpen,
  PlayCircle,
  Archive,
  Search,
  ExternalLink,
  Clock3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";

import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { learningService } from "../services/learningService";

const tabs = [
  {
    id: "notes",
    label: "Notes",
    icon: FileText,
  },
  {
    id: "subjects",
    label: "Subjects",
    icon: BookOpen,
  },
  {
    id: "pyqs",
    label: "Previous Papers",
    icon: Archive,
  },
  {
    id: "videos",
    label: "Video Tutorials",
    icon: PlayCircle,
  },
];

const mockData = {
  notes: [
    {
      id: 1,
      title: "DBMS Normalization",
      description:
        "Complete notes covering 1NF, 2NF, 3NF and BCNF with examples.",
      subject: "DBMS",
      progress: 72,
      duration: "25 min",
    },
    {
      id: 2,
      title: "Operating Systems",
      description:
        "Processes, threads, scheduling algorithms and synchronization.",
      subject: "Operating Systems",
      progress: 48,
      duration: "35 min",
    },
    {
      id: 3,
      title: "Java Collections",
      description:
        "Understand List, Set, Map and the most commonly used collection classes.",
      subject: "Java",
      progress: 65,
      duration: "30 min",
    },
    {
      id: 4,
      title: "Computer Networks",
      description:
        "OSI model, TCP/IP, protocols and networking fundamentals.",
      subject: "Networks",
      progress: 31,
      duration: "40 min",
    },
  ],

  subjects: [
    {
      id: 1,
      title: "Data Structures",
      description:
        "Arrays, linked lists, stacks, queues, trees and graphs.",
      subject: "DSA",
      progress: 72,
      duration: "12 topics",
    },
    {
      id: 2,
      title: "Database Management Systems",
      description:
        "SQL, normalization, transactions, indexing and database design.",
      subject: "DBMS",
      progress: 45,
      duration: "15 topics",
    },
    {
      id: 3,
      title: "Java Programming",
      description:
        "Core Java, OOP, collections, exceptions and modern Java concepts.",
      subject: "Java",
      progress: 61,
      duration: "18 topics",
    },
    {
      id: 4,
      title: "React Development",
      description:
        "Components, hooks, routing, state management and API integration.",
      subject: "React",
      progress: 38,
      duration: "14 topics",
    },
  ],

  pyqs: [
    {
      id: 1,
      title: "DBMS Previous Year Paper",
      description:
        "University examination paper covering SQL, normalization and transactions.",
      subject: "DBMS",
      progress: 0,
      duration: "2025",
    },
    {
      id: 2,
      title: "Data Structures Previous Paper",
      description:
        "Practice questions on trees, graphs, sorting and searching.",
      subject: "DSA",
      progress: 0,
      duration: "2025",
    },
    {
      id: 3,
      title: "Operating Systems Previous Paper",
      description:
        "Previous examination questions on processes, memory and scheduling.",
      subject: "OS",
      progress: 0,
      duration: "2024",
    },
  ],

  videos: [
    {
      id: 1,
      title: "React Hooks Explained",
      description:
        "Learn useState, useEffect and custom hooks with practical examples.",
      subject: "React",
      progress: 55,
      duration: "42 min",
    },
    {
      id: 2,
      title: "SQL Crash Course",
      description:
        "A practical introduction to SELECT, JOIN, GROUP BY and subqueries.",
      subject: "DBMS",
      progress: 20,
      duration: "55 min",
    },
    {
      id: 3,
      title: "DSA Interview Preparation",
      description:
        "Important data structure concepts frequently asked in interviews.",
      subject: "DSA",
      progress: 80,
      duration: "1 hr 10 min",
    },
    {
      id: 4,
      title: "Java OOP Concepts",
      description:
        "Classes, objects, inheritance, abstraction, interfaces and polymorphism.",
      subject: "Java",
      progress: 35,
      duration: "48 min",
    },
  ],
};

export default function Learning() {
  const { onMenu } = useOutletContext() || {};

  const [active, setActive] = useState("notes");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadResources = async () => {
      setLoading(true);
      setUsingDemoData(false);

      const services = {
        notes: learningService.getNotes,
        subjects: learningService.getSubjects,
        pyqs: learningService.getPyqs,
        videos: learningService.getVideos,
      };

      try {
        const service = services[active];

        if (!service) {
          throw new Error("Unknown learning category");
        }

        const response = await service();

        const responseItems =
          response?.data?.items ||
          response?.data ||
          [];

        if (mounted) {
          if (Array.isArray(responseItems) && responseItems.length > 0) {
            setItems(responseItems);
          } else {
            setItems(mockData[active]);
            setUsingDemoData(true);
          }
        }
      } catch (error) {
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

    loadResources();

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
        ${item.description || ""}
        ${item.subject || ""}
      `.toLowerCase();

      return text.includes(query);
    });
  }, [items, search]);

  const activeTab = tabs.find((tab) => tab.id === active);

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
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              StudentOS Learning
            </p>

            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              Keep learning, keep growing.
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              Access your notes, subjects, previous papers and video
              tutorials in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-3">
            <BookOpen size={18} className="text-violet-400" />

            <div>
              <p className="text-xs text-gray-500">
                Your learning
              </p>

              <p className="text-sm font-semibold text-white">
                Stay consistent 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo data notice */}
      {usingDemoData && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          Backend learning data is not connected yet, so demo resources
          are being displayed.
        </div>
      )}

      {/* Tabs + Search */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActive(tab.id);
                  setSearch("");
                }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                  isActive
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

        <div className="flex w-full items-center gap-2 rounded-xl border border-bg-border bg-bg-card px-3 py-2.5 lg:w-72">
          <Search size={16} className="shrink-0 text-gray-500" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search resources..."
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
      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            {activeTab?.label}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {filteredItems.length} resource
            {filteredItems.length === 1 ? "" : "s"} available
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={`No ${activeTab?.label.toLowerCase()} found`}
          description="Try another search term or connect the backend to load your real learning resources."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item, index) => {
            const title = item.title || item.name || "Learning Resource";

            const description =
              item.description ||
              "Continue exploring this learning resource.";

            const progress = Math.min(
              Math.max(Number(item.progress || 0), 0),
              100
            );

            return (
              <Card
                key={item.id || index}
                className="group flex flex-col transition hover:-translate-y-0.5 hover:border-purple-500/30"
              >
                {/* Icon */}
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
                    {active === "videos" ? (
                      <PlayCircle size={21} />
                    ) : active === "pyqs" ? (
                      <Archive size={21} />
                    ) : active === "subjects" ? (
                      <BookOpen size={21} />
                    ) : (
                      <FileText size={21} />
                    )}
                  </div>

                  {item.subject && (
                    <span className="rounded-full border border-bg-border bg-bg-hover px-2.5 py-1 text-[10px] font-medium text-gray-400">
                      {item.subject}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="mt-4 flex-1">
                  <h3 className="text-base font-semibold text-white">
                    {title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                    {description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="mt-5 flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock3 size={13} />

                    <span>
                      {item.duration ||
                        (active === "subjects"
                          ? "Multiple topics"
                          : "Self paced")}
                    </span>
                  </div>

                  {progress >= 100 && (
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 size={13} />
                      Complete
                    </div>
                  )}
                </div>

                {/* Progress */}
                {active !== "pyqs" && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-600">
                        Progress
                      </span>

                      <span className="text-[10px] font-medium text-gray-400">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-bg-border">
                      <div
                        className="h-full rounded-full bg-accent-gradient transition-all"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action */}
                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-xs font-semibold text-gray-300 transition hover:border-purple-500/30 hover:text-white"
                >
                  {active === "pyqs"
                    ? "Open Paper"
                    : progress > 0
                    ? "Continue Learning"
                    : "Start Learning"}

                  {active === "pyqs" ? (
                    <ExternalLink size={14} />
                  ) : (
                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-0.5"
                    />
                  )}
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}