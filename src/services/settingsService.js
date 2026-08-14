import api, { USE_MOCK_API } from "./api";

const defaultSettings = {
  dark_mode: true,
  email_notifications: true,
  push_notifications: true,
};

export const settingsService = {
  getSettings: () =>
    USE_MOCK_API
      ? Promise.resolve({ data: defaultSettings })
      : api.get("/settings/"),

  updateSettings: (data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            message: "Settings updated successfully",
            settings: data,
          },
        })
      : api.put("/settings/", data),
};