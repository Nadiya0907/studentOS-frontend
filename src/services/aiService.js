import api, { USE_MOCK_API } from "./api";
import { mockClient } from "./mockClient";

const askBackend = async (
  question,
  module
) => {
  const finalQuestion = `[${module}]\n${question}`;

  if (USE_MOCK_API) {
    return mockClient.ai(
      question,
      module
    );
  }

  return api.post("/ai/chat", {
    question: finalQuestion,
  });
};

const normalizeResumeData = (
  resumeData
) => {
  if (!resumeData) {
    return {};
  }

  if (
    resumeData instanceof FormData
  ) {
    return Object.fromEntries(
      resumeData.entries()
    );
  }

  return resumeData;
};

export const aiService = {
  askMentor: (message) =>
    askBackend(
      message,
      "Academic Mentor"
    ),

  askCareer: (payload) =>
    askBackend(
      payload?.message ||
        "Give me career guidance.",
      "Career Mentor"
    ),

  askEnglishCoach: (payload) =>
    askBackend(
      payload?.message ||
        "Help me practice English.",
      "English Coach"
    ),

  askProjectMentor: (payload) =>
    askBackend(
      payload?.message ||
        "Help me with my project.",
      "Project Mentor"
    ),

  reviewResume: (resumeData) => {
    const data =
      normalizeResumeData(
        resumeData
      );

    const resumeText = `
Please review this resume for ATS readiness.

Name: ${data.name || data.full_name || ""}
Target Title: ${data.title || ""}
Email: ${data.email || ""}
Summary: ${data.summary || ""}
Skills: ${data.skills || ""}
Experience: ${data.experience || ""}
Question: ${data.question || ""}
`;

    return askBackend(
      resumeText,
      "Resume Reviewer"
    );
  },
};