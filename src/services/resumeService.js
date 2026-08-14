import api, { USE_MOCK_API } from "./api";

const defaultResume = {
  full_name: "",
  email: "",
  phone: "",
  education: "",
  skills: "",
  experience: "Fresher",
};

export const resumeService = {
  getResume: () =>
    USE_MOCK_API
      ? Promise.resolve({
          data: defaultResume,
        })
      : api.get("/resume/builder-data"),

  saveResume: (data) =>
    USE_MOCK_API
      ? Promise.resolve({
          data: {
            message: "Resume saved successfully",
            data,
          },
        })
      : api.post("/resume/builder-data", data),
};