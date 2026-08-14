import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

export const profileService = {
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
};