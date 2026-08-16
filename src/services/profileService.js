import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

export const profileService = {
  // ---------------------------------
  // PROFILE
  // ---------------------------------

  getProfile: () =>
    USE_MOCK_API
      ? mockClient.profile()
      : api.get("/student/me"),

  updateProfile: (data, rollNumber) =>
    USE_MOCK_API
      ? Promise.resolve({ data })
      : api.put("/student/me", data, {
          params: {
            roll_number: rollNumber,
          },
        }),

  // ---------------------------------
  // FILE UPLOADS
  // ---------------------------------

  uploadPhoto: (formData) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            message: "Demo photo upload complete",
            url: "#",
          },
        })
      : api.post("/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),

  uploadPdf: (formData) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            message: "Demo PDF upload complete",
            url: "#",
          },
        })
      : api.post("/upload/pdf", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),

  uploadResume: (formData) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            message: "Demo resume upload complete",
            url: "#",
          },
        })
      : api.post("/upload/resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),

  getAllFiles: () =>
    USE_MOCK_API
      ? Promise.resolve({
          data: [],
        })
      : api.get("/upload/all-files"),

  // ---------------------------------
  // DELETE FILE
  // ---------------------------------

  deleteFile: (fileId) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            id: fileId,
          },
        })
      : api.delete(`/upload/${fileId}`),

  // ---------------------------------
  // REPLACE / UPDATE FILE
  // ---------------------------------

  replaceFile: (fileId, formData) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            id: fileId,
            message: "Demo file replaced",
          },
        })
      : api.put(
          `/upload/${fileId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
};