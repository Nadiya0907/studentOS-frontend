import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  RefreshCw,
  ExternalLink,
  Trash2,
  Pencil,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

import Topbar from "../components/common/Topbar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { profileService } from "../services/profileService";

export default function FileManagement() {
  const { onMenu } = useOutletContext() || {};

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const [uploading, setUploading] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [replacingId, setReplacingId] = useState(null);

  const [replaceTarget, setReplaceTarget] = useState(null);

  // --------------------------------------------------
  // COMMON ERROR HANDLER
  // --------------------------------------------------

  const showFileError = (error, action) => {
    console.error(`${action} error:`, error);

    const status = error?.response?.status;
    const detail = error?.response?.data?.detail;

    // Hide backend/cloud configuration details.
    if (
      typeof detail === "string" &&
      detail.toLowerCase().includes("api_key")
    ) {
      toast.error(
        "File upload service is temporarily unavailable. Please try again later."
      );
      return;
    }

    if (status === 404) {
      toast.error(
        "This file operation is not available yet."
      );
      return;
    }

    if (status === 405) {
      toast.error(
        "This file operation is not supported by the current backend."
      );
      return;
    }

    if (status === 401 || status === 403) {
      toast.error(
        "You are not authorized to perform this file operation."
      );
      return;
    }

    if (Array.isArray(detail)) {
      toast.error(
        detail
          .map(
            (item) =>
              item?.msg || "Validation error"
          )
          .join(", ")
      );
      return;
    }

    if (typeof detail === "string") {
      toast.error(detail);
      return;
    }

    toast.error(
      `Could not ${action.toLowerCase()}.`
    );
  };

  // --------------------------------------------------
  // LOAD FILES
  // --------------------------------------------------

  const loadFiles = async () => {
    setLoadingFiles(true);

    try {
      const response =
        await profileService.getAllFiles();

      const rawFiles =
        response?.data?.files ||
        response?.data?.items ||
        response?.data ||
        response?.files ||
        [];

      setFiles(
        Array.isArray(rawFiles)
          ? rawFiles
          : []
      );
    } catch (error) {
      showFileError(
        error,
        "load files"
      );
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // --------------------------------------------------
  // UPLOAD
  // --------------------------------------------------

  const uploadFile = async (
    file,
    type
  ) => {
    if (!file) return;

    setUploading(type);

    try {
      const formData = new FormData();

      // Backend Swagger uses "file".
      formData.append("file", file);

      let response;

      if (type === "image") {
        response =
          await profileService.uploadPhoto(
            formData
          );
      } else if (type === "pdf") {
        response =
          await profileService.uploadPdf(
            formData
          );
      } else if (type === "resume") {
        response =
          await profileService.uploadResume(
            formData
          );
      }

      toast.success(
        response?.data?.message ||
          "File uploaded successfully."
      );

      await loadFiles();
    } catch (error) {
      showFileError(
        error,
        `upload ${type}`
      );
    } finally {
      setUploading("");
    }
  };

  const handleImageChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image file."
      );
      event.target.value = "";
      return;
    }

    await uploadFile(file, "image");
    event.target.value = "";
  };

  const handlePdfChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      toast.error(
        "Please select a PDF file."
      );
      event.target.value = "";
      return;
    }

    await uploadFile(file, "pdf");
    event.target.value = "";
  };

  const handleResumeChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      toast.error(
        "Only PDF resumes are allowed."
      );
      event.target.value = "";
      return;
    }

    await uploadFile(file, "resume");
    event.target.value = "";
  };

  // --------------------------------------------------
  // FILE HELPERS
  // --------------------------------------------------

  const getFileId = (item) =>
    item?.id ||
    item?._id ||
    item?.file_id;

  const getFileName = (item) =>
    item?.filename ||
    item?.file_name ||
    item?.name ||
    item?.title ||
    "Uploaded file";

  const getFileType = (item) =>
    String(
      item?.file_type ||
        item?.type ||
        item?.content_type ||
        item?.category ||
        "File"
    );

  const getFileUrl = (item) =>
    item?.file_url ||
    item?.url ||
    item?.download_url ||
    item?.path ||
    "";

  const isResumeFile = (item) =>
    getFileType(item)
      .toLowerCase()
      .includes("resume");

  const getIcon = (item) => {
    const type =
      getFileType(item).toLowerCase();

    if (
      type.includes("image") ||
      type.includes("png") ||
      type.includes("jpg") ||
      type.includes("jpeg")
    ) {
      return (
        <ImageIcon
          size={20}
          className="text-cyan-400"
        />
      );
    }

    if (
      type.includes("pdf") ||
      type.includes("resume") ||
      type.includes("document")
    ) {
      return (
        <FileText
          size={20}
          className="text-orange-400"
        />
      );
    }

    return (
      <File
        size={20}
        className="text-violet-400"
      />
    );
  };

  // --------------------------------------------------
  // OPEN
  // --------------------------------------------------

  const openFile = (item) => {
    const url = getFileUrl(item);

    if (!url) {
      toast.error(
        "No file URL is available."
      );
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (
    item
  ) => {
    const fileId = getFileId(item);

    if (!fileId) {
      toast.error(
        "This file does not have a file ID."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${getFileName(item)}"?`
    );

    if (!confirmed) return;

    setDeletingId(fileId);

    try {
      const response =
        await profileService.deleteFile(
          fileId
        );

      setFiles((current) =>
        current.filter(
          (file) =>
            getFileId(file) !== fileId
        )
      );

      toast.success(
        response?.data?.message ||
          "File deleted successfully."
      );
    } catch (error) {
      showFileError(
        error,
        "delete file"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------------------------
  // REPLACE
  // --------------------------------------------------

  const startReplace = (item) => {
    const fileId = getFileId(item);

    if (!fileId) {
      toast.error(
        "This file does not have a file ID."
      );
      return;
    }

    setReplaceTarget(item);

    setTimeout(() => {
      replaceInputRef.current?.click();
    }, 0);
  };

  const handleReplaceChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file || !replaceTarget) {
      event.target.value = "";
      return;
    }

    const fileId =
      getFileId(replaceTarget);

    if (!fileId) {
      event.target.value = "";
      return;
    }

    if (
      isResumeFile(replaceTarget)
    ) {
      const isPdf =
        file.type ===
          "application/pdf" ||
        file.name
          .toLowerCase()
          .endsWith(".pdf");

      if (!isPdf) {
        toast.error(
          "Resume replacement must be a PDF."
        );
        event.target.value = "";
        return;
      }
    }

    setReplacingId(fileId);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response =
        await profileService.replaceFile(
          fileId,
          formData
        );

      toast.success(
        response?.data?.message ||
          "File replaced successfully."
      );

      setReplaceTarget(null);

      await loadFiles();
    } catch (error) {
      showFileError(
        error,
        "replace file"
      );
    } finally {
      setReplacingId(null);
      event.target.value = "";
    }
  };

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        title="File Management"
        subtitle="Upload and manage your StudentOS files"
      />

      <div className="space-y-5">
        {/* Upload Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {/* IMAGE */}
          <Card>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-500/10">
              <ImageIcon
                size={21}
                className="text-cyan-400"
              />
            </div>

            <h2 className="mt-4 font-semibold text-white">
              Upload Image
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Upload profile or academic images.
            </p>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={
                handleImageChange
              }
            />

            <Button
              type="button"
              onClick={() =>
                imageInputRef.current?.click()
              }
              disabled={
                uploading === "image"
              }
              className="mt-4 w-full"
            >
              <Upload size={15} />
              {uploading === "image"
                ? "Uploading..."
                : "Choose Image"}
            </Button>
          </Card>

          {/* PDF */}
          <Card>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500/10">
              <FileText
                size={21}
                className="text-orange-400"
              />
            </div>

            <h2 className="mt-4 font-semibold text-white">
              Upload PDF
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Upload study materials and academic PDFs.
            </p>

            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handlePdfChange}
            />

            <Button
              type="button"
              onClick={() =>
                pdfInputRef.current?.click()
              }
              disabled={
                uploading === "pdf"
              }
              className="mt-4 w-full"
            >
              <Upload size={15} />
              {uploading === "pdf"
                ? "Uploading..."
                : "Choose PDF"}
            </Button>
          </Card>

          {/* RESUME */}
          <Card>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/10">
              <FileText
                size={21}
                className="text-violet-400"
              />
            </div>

            <h2 className="mt-4 font-semibold text-white">
              Upload Resume
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Upload your latest PDF resume.
            </p>

            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleResumeChange}
            />

            <Button
              type="button"
              onClick={() =>
                resumeInputRef.current?.click()
              }
              disabled={
                uploading === "resume"
              }
              className="mt-4 w-full"
            >
              <Upload size={15} />
              {uploading === "resume"
                ? "Uploading..."
                : "Choose Resume"}
            </Button>
          </Card>
        </div>

        {/* Files */}
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-white">
                Uploaded Files
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Manage your uploaded StudentOS files.
              </p>
            </div>

            <button
              type="button"
              onClick={loadFiles}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          <input
            ref={replaceInputRef}
            type="file"
            accept="image/*,.pdf,application/pdf"
            className="hidden"
            onChange={handleReplaceChange}
          />

          {loadingFiles ? (
            <div className="grid h-48 place-items-center">
              <Spinner />
            </div>
          ) : files.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                title="No uploaded files"
                description="Upload an image, PDF or resume to see it here."
              />
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {files.map(
                (item, index) => {
                  const fileId =
                    getFileId(item);

                  const name =
                    getFileName(item);

                  const type =
                    getFileType(item);

                  const url =
                    getFileUrl(item);

                  const deleting =
                    deletingId === fileId;

                  const replacing =
                    replacingId === fileId;

                  return (
                    <div
                      key={
                        fileId || index
                      }
                      className="flex flex-col gap-4 rounded-xl border border-bg-border bg-bg-hover p-4 lg:flex-row lg:items-center"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bg-card">
                        {getIcon(item)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {type}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {url && (
                          <button
                            type="button"
                            onClick={() =>
                              openFile(item)
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-card px-3 py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
                          >
                            <ExternalLink
                              size={14}
                            />
                            Open
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            startReplace(item)
                          }
                          disabled={
                            !fileId ||
                            replacing ||
                            deleting
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2.5 text-xs font-semibold text-violet-300 hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {replacing ? (
                            <RefreshCw
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Pencil
                              size={14}
                            />
                          )}
                          Replace
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item)
                          }
                          disabled={
                            !fileId ||
                            deleting ||
                            replacing
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deleting ? (
                            <RefreshCw
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={14}
                            />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}