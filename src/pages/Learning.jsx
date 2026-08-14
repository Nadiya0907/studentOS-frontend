import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  BookOpen,
  PlayCircle,
  Archive,
  Search,
  ExternalLink,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

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

export default function Learning() {
  const { onMenu } = useOutletContext() || {};

  const [active, setActive] = useState("notes");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Notes form state
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteSaving, setNoteSaving] = useState(false);

  const [noteForm, setNoteForm] = useState({
    title: "",
    subject: "",
    description: "",
    content: "",
  });

  // -------------------------------------------------
  // LOAD LEARNING DATA
  // -------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadResources = async () => {
      setLoading(true);
      setError("");

      try {
        let response;

        if (active === "notes") {
          response = await learningService.getNotes();

          const resources =
            response?.data?.resources ||
            response?.resources ||
            [];

          if (mounted) {
            setItems(
              Array.isArray(resources)
                ? resources.map((resource) => ({
                    ...resource,
                    id:
                      resource._id ||
                      resource.id,

                    title:
                      resource.title ||
                      "Academic Resource",

                    description:
                      resource.description ||
                      `${
                        resource.resource_type ||
                        "Academic"
                      } resource for ${
                        resource.subject ||
                        "your subject"
                      }.`,

                    subject:
                      resource.subject,

                    semester:
                      resource.semester,

                    resource_type:
                      resource.resource_type,

                    uploaded_by:
                      resource.uploaded_by,

                    file_url:
                      resource.file_url,
                  }))
                : []
            );
          }
        } else if (active === "subjects") {
          response =
            await learningService.getSubjects();

          const subjects =
            response?.data ||
            response ||
            [];

          if (mounted) {
            setItems(
              Array.isArray(subjects)
                ? subjects
                : []
            );
          }
        } else if (active === "pyqs") {
          response =
            await learningService.getPyqs();

          const pyqs =
            response?.data ||
            response ||
            [];

          if (mounted) {
            setItems(
              Array.isArray(pyqs)
                ? pyqs
                : []
            );
          }
        } else if (active === "videos") {
          response =
            await learningService.getVideos();

          const videos =
            response?.data ||
            response ||
            [];

          if (mounted) {
            setItems(
              Array.isArray(videos)
                ? videos
                : []
            );
          }
        }
      } catch (err) {
        console.error(
          `Learning ${active} error:`,
          err
        );

        if (mounted) {
          setItems([]);

          setError(
            "Unable to load this learning section from the backend."
          );
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

  // -------------------------------------------------
  // SEARCH
  // -------------------------------------------------

  const filteredItems = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      const searchableText = `
        ${item.title || ""}
        ${item.name || ""}
        ${item.subject_name || ""}
        ${item.subject || ""}
        ${item.description || ""}
        ${item.resource_type || ""}
        ${item.year || ""}
      `.toLowerCase();

      return searchableText.includes(
        query
      );
    });
  }, [items, search]);

  const activeTab = tabs.find(
    (tab) => tab.id === active
  );

  // -------------------------------------------------
  // DISPLAY HELPERS
  // -------------------------------------------------

  const getTitle = (item) => {
    if (active === "subjects") {
      return (
        item.subject_name ||
        item.subject_code ||
        "Subject"
      );
    }

    return (
      item.title ||
      item.name ||
      "Learning Resource"
    );
  };

  const getDescription = (item) => {
    if (active === "subjects") {
      return `Subject code: ${
        item.subject_code || "N/A"
      }`;
    }

    if (active === "pyqs") {
      return `Previous year paper for ${
        item.subject || "subject"
      }`;
    }

    if (active === "videos") {
      return `Video tutorial for ${
        item.subject || "subject"
      }`;
    }

    return (
      item.description ||
      `${
        item.resource_type ||
        "Academic"
      } resource`
    );
  };

  const getMetadata = (item) => {
    if (active === "subjects") {
      return `Semester ${
        item.semester ?? "N/A"
      }`;
    }

    if (active === "pyqs") {
      return `Year ${
        item.year ?? "N/A"
      }`;
    }

    if (active === "videos") {
      return (
        item.subject ||
        "Video tutorial"
      );
    }

    return (
      item.subject ||
      "Academic resource"
    );
  };

  // -------------------------------------------------
  // OPEN LEARNING RESOURCE
  // -------------------------------------------------

  const openResource = (item) => {
    if (active === "notes") {
      if (!item.title) {
        return;
      }

      const baseUrl =
        import.meta.env
          .VITE_API_BASE_URL ||
        "http://localhost:8000";

      const url =
        `${baseUrl}/academic/view-pdf?title=` +
        encodeURIComponent(
          item.title
        );

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    if (active === "pyqs") {
      if (item.download_url) {
        window.open(
          item.download_url,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        setError(
          "This previous year paper does not have a download URL."
        );
      }

      return;
    }

    if (active === "videos") {
      if (item.video_url) {
        window.open(
          item.video_url,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        setError(
          "This video does not have a video URL."
        );
      }
    }
  };

  // -------------------------------------------------
  // NOTE FORM
  // -------------------------------------------------

  const resetNoteForm = () => {
    setNoteForm({
      title: "",
      subject: "",
      description: "",
      content: "",
    });

    setEditingNote(null);
    setShowNoteForm(false);
    setError("");
  };

  const startCreateNote = () => {
    setEditingNote(null);

    setNoteForm({
      title: "",
      subject: "",
      description: "",
      content: "",
    });

    setShowNoteForm(true);
    setError("");
  };

  const startEditNote = (note) => {
    setEditingNote(note);

    setNoteForm({
      title: note.title || "",
      subject: note.subject || "",
      description:
        note.description || "",
      content: note.content || "",
    });

    setShowNoteForm(true);
    setError("");
  };

  const handleNoteChange = (
    field,
    value
  ) => {
    setNoteForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveNote = async () => {
    if (!noteForm.title.trim()) {
      setError(
        "Note title is required."
      );
      return;
    }

    if (!noteForm.subject.trim()) {
      setError(
        "Note subject is required."
      );
      return;
    }

    setNoteSaving(true);
    setError("");

    try {
      if (editingNote) {
        const noteId =
          editingNote.id ||
          editingNote._id;

        await learningService.updateNote(
          noteId,
          noteForm
        );

        // Prepare UI for the future backend.
        setItems((current) =>
          current.map((item) => {
            const itemId =
              item.id ||
              item._id;

            if (itemId !== noteId) {
              return item;
            }

            return {
              ...item,
              ...noteForm,
            };
          })
        );
      } else {
        await learningService.createNote(
          noteForm
        );
      }

      resetNoteForm();
    } catch (err) {
      console.error(
        "Note save error:",
        err
      );

      setError(
        "Note create/update API is not available in the current backend yet."
      );
    } finally {
      setNoteSaving(false);
    }
  };

  const deleteNote = async (note) => {
    const noteId =
      note.id || note._id;

    if (!noteId) {
      setError(
        "This note does not have an ID."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${note.title || "this note"}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await learningService.deleteNote(
        noteId
      );

      // Prepare UI for the future backend.
      setItems((current) =>
        current.filter(
          (item) =>
            (item.id ||
              item._id) !== noteId
        )
      );

      setError("");
    } catch (err) {
      console.error(
        "Note delete error:",
        err
      );

      setError(
        "Note delete API is not available in the current backend yet."
      );
    }
  };

  // -------------------------------------------------
  // UI
  // -------------------------------------------------

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
              Access your academic resources,
              subjects, previous papers and video
              tutorials.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-3">
            <BookOpen
              size={18}
              className="text-violet-400"
            />

            <div>
              <p className="text-xs text-gray-500">
                Your learning
              </p>

              <p className="text-sm font-semibold text-white">
                Real backend resources 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Backend error */}
      {error && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          {error}
        </div>
      )}

      {/* Tabs + Search */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              active === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActive(tab.id);
                  setSearch("");
                  setError("");
                  setShowNoteForm(false);
                  setEditingNote(null);
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
          <Search
            size={16}
            className="shrink-0 text-gray-500"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder={`Search ${
              activeTab?.label.toLowerCase()
            }...`}
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            {activeTab?.label}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {filteredItems.length} resource
            {filteredItems.length === 1
              ? ""
              : "s"}{" "}
            available
          </p>
        </div>

        {active === "notes" && (
          <button
            type="button"
            onClick={startCreateNote}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={14} />
            Add Note
          </button>
        )}
      </div>

      {/* Note form */}
      {active === "notes" &&
        showNoteForm && (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {editingNote
                    ? "Edit Note"
                    : "Create Note"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Your frontend is ready for the future Notes CRUD APIs.
                </p>
              </div>

              <button
                type="button"
                onClick={resetNoteForm}
                className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-bg-hover hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-400">
                  Title
                </label>

                <input
                  value={noteForm.title}
                  onChange={(event) =>
                    handleNoteChange(
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="e.g. DBMS Normalization"
                  className="mt-1.5 w-full rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400">
                  Subject
                </label>

                <input
                  value={noteForm.subject}
                  onChange={(event) =>
                    handleNoteChange(
                      "subject",
                      event.target.value
                    )
                  }
                  placeholder="e.g. DBMS"
                  className="mt-1.5 w-full rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-400">
                  Description
                </label>

                <input
                  value={noteForm.description}
                  onChange={(event) =>
                    handleNoteChange(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Short description"
                  className="mt-1.5 w-full rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-400">
                  Content
                </label>

                <textarea
                  value={noteForm.content}
                  onChange={(event) =>
                    handleNoteChange(
                      "content",
                      event.target.value
                    )
                  }
                  rows={7}
                  placeholder="Write your note content..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-bg-border bg-bg-hover p-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetNoteForm}
                className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-400 hover:text-white"
              >
                <X size={14} />
                Cancel
              </button>

              <button
                type="button"
                onClick={saveNote}
                disabled={noteSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-gradient px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={14} />

                {noteSaving
                  ? "Saving..."
                  : editingNote
                  ? "Update Note"
                  : "Create Note"}
              </button>
            </div>
          </Card>
        )}

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={`No ${activeTab?.label.toLowerCase()} found`}
          description="No matching resources were returned by the backend."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map(
            (item, index) => {
              const title =
                getTitle(item);

              const description =
                getDescription(item);

              const metadata =
                getMetadata(item);

              const itemId =
                item.id ||
                item._id ||
                item.subject_code ||
                item.title ||
                index;

              return (
                <Card
                  key={itemId}
                  className="group flex flex-col transition hover:-translate-y-0.5 hover:border-purple-500/30"
                >
                  {/* Icon */}
                  <div className="flex items-start justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
                      {active ===
                      "videos" ? (
                        <PlayCircle size={21} />
                      ) : active ===
                        "pyqs" ? (
                        <Archive size={21} />
                      ) : active ===
                        "subjects" ? (
                        <BookOpen size={21} />
                      ) : (
                        <FileText size={21} />
                      )}
                    </div>

                    <span className="rounded-full border border-bg-border bg-bg-hover px-2.5 py-1 text-[10px] font-medium text-gray-400">
                      {metadata}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-4 flex-1">
                    <h3 className="text-base font-semibold text-white">
                      {title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-500">
                      {description}
                    </p>

                    {active ===
                      "notes" &&
                      item.uploaded_by && (
                        <p className="mt-3 text-[10px] text-gray-600">
                          Uploaded by:{" "}
                          {item.uploaded_by}
                        </p>
                      )}
                  </div>

                  {/* Notes actions */}
                  {active ===
                    "notes" && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEditNote(
                            item
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-xs font-semibold text-gray-300 transition hover:text-white"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteNote(
                            item
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Main action */}
                  {active ===
                  "subjects" ? (
                    <div className="mt-5 rounded-xl border border-bg-border bg-bg-hover px-3 py-3 text-xs text-gray-400">
                      Semester{" "}
                      {item.semester ??
                        "N/A"}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openResource(
                          item
                        )
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-xs font-semibold text-gray-300 transition hover:border-purple-500/30 hover:text-white"
                    >
                      {active ===
                      "pyqs"
                        ? "Open Paper"
                        : active ===
                          "videos"
                        ? "Watch Video"
                        : "Open PDF"}

                      {active ===
                        "videos" ||
                      active ===
                        "pyqs" ? (
                        <ExternalLink
                          size={14}
                        />
                      ) : (
                        <ArrowRight
                          size={14}
                        />
                      )}
                    </button>
                  )}

                  {/* Extra metadata */}
                  {active ===
                    "notes" &&
                    item.semester !==
                      undefined && (
                      <p className="mt-2 text-center text-[10px] text-gray-600">
                        Semester{" "}
                        {item.semester}
                      </p>
                    )}
                </Card>
              );
            }
          )}
        </div>
      )}

      {/* Future backend note */}
      {active === "notes" && (
        <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-3 text-xs leading-5 text-gray-500">
          Notes reading and PDF opening use
          the current backend. Create, Edit and
          Delete are already prepared in the
          frontend and will become live when the
          backend provides the Notes CRUD APIs.
        </div>
      )}
    </div>
  );
}