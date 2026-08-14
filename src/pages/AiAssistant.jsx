import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Bot,
  User,
  Paperclip,
  Sparkles,
  FileText,
  Briefcase,
  MessageCircle,
  Code2,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

import { aiService } from "../services/aiService";
import { AI_MODULES } from "../constants";

const suggestions = [
  "What should I study this week?",
  "Suggest internships for a React developer",
  "Give me a mock HR interview question",
  "Suggest a final-year project architecture",
  "Explain DBMS normalization in simple words",
];

export default function AiAssistant() {
  const { onMenu } = useOutletContext() || {};

  const [active, setActive] = useState("mentor");

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your StudentOS AI Mentor. What are you working on today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  const getModuleIcon = (id) => {
    switch (id) {
      case "career":
        return <Briefcase size={15} />;

      case "english":
        return <MessageCircle size={15} />;

      case "project":
        return <Code2 size={15} />;

      case "resume":
      case "resume-reviewer":
        return <FileText size={15} />;

      default:
        return <Sparkles size={15} />;
    }
  };

  const sendMessage = async (text = input) => {
    const message = text.trim();

    if (!message || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      let response;

      /*
       * Current backend has one real AI endpoint:
       * POST /ai/chat
       *
       * aiService sends the selected module along
       * with the question so the backend can understand
       * which StudentOS AI role is being requested.
       */

      if (active === "career") {
        response = await aiService.askCareer({
          message,
        });
      } else if (active === "english") {
        response = await aiService.askEnglishCoach({
          message,
        });
      } else if (active === "project") {
        response = await aiService.askProjectMentor({
          message,
        });
      } else if (
        active === "resume" ||
        active === "resume-reviewer"
      ) {
        response = await aiService.reviewResume({
          name: "",
          title: "",
          email: "",
          summary: "",
          skills: "",
          experience: "",
          question: message,
        });
      } else {
        response = await aiService.askMentor(message);
      }

      const answer =
        response?.data?.answer ||
        response?.answer ||
        response?.data?.message ||
        response?.message ||
        "I could not generate a response.";

      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          text: answer,
        },
      ]);
    } catch (error) {
      console.error(
        "AI Assistant error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      const errorMessage =
        typeof detail === "string"
          ? detail
          : "I could not reach the AI service. Please try again.";

      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  const activeModule =
    AI_MODULES?.find(
      (module) =>
        module.id === active
    );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
            StudentOS Intelligence
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            AI Assistant
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Your academic, career and project mentor.
          </p>
        </div>

        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            className="rounded-lg border border-bg-border bg-bg-hover px-3 py-2 text-sm text-gray-300 md:hidden"
          >
            Menu
          </button>
        )}
      </div>

      {/* AI modules */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {AI_MODULES?.map((module) => (
          <button
            key={module.id}
            type="button"
            onClick={() =>
              setActive(module.id)
            }
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              active === module.id
                ? "bg-accent-gradient text-white shadow-lg"
                : "border border-bg-border bg-bg-hover text-gray-400 hover:text-white"
            }`}
          >
            {getModuleIcon(module.id)}
            {module.label}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="overflow-hidden rounded-2xl border border-bg-border bg-bg-card">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-bg-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <Bot size={20} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                {activeModule?.label ||
                  "AI Mentor"}
              </h2>

              <p className="text-xs text-gray-500">
                Powered by StudentOS AI backend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Ready
          </div>
        </div>

        {/* Messages */}
        <div className="h-[420px] space-y-4 overflow-y-auto p-5">
          {messages.map(
            (message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-3 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role === "ai" && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple-500/10 text-purple-400">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role ===
                    "user"
                      ? "bg-accent-gradient text-white"
                      : "bg-bg-hover text-gray-300"
                  }`}
                >
                  {message.text}
                </div>

                {message.role ===
                  "user" && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bg-hover text-gray-400">
                    <User size={16} />
                  </div>
                )}
              </div>
            )
          )}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-purple-500/10 text-purple-400">
                <Bot size={16} />
              </div>

              <div className="rounded-2xl bg-bg-hover px-4 py-3 text-sm text-gray-400">
                AI is thinking...
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        <div className="border-t border-bg-border px-5 py-4">
          <p className="mb-2 text-xs text-gray-500">
            Try asking:
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestions.map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    sendMessage(
                      suggestion
                    )
                  }
                  disabled={loading}
                  className="whitespace-nowrap rounded-full border border-bg-border bg-bg-hover px-3 py-2 text-[11px] text-gray-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-bg-border p-4">
          <div className="flex items-center gap-2 rounded-xl border border-bg-border bg-bg-hover p-2">
            <button
              type="button"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-500 transition hover:bg-bg-card hover:text-white"
              title="Attachment"
            >
              <Paperclip size={17} />
            </button>

            <input
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask your AI mentor..."
              className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-gray-600 disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() =>
                sendMessage()
              }
              disabled={
                !input.trim() ||
                loading
              }
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-gradient text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-gray-600">
            AI responses may need verification. Use StudentOS as a learning
            assistant, not a replacement for official academic guidance.
          </p>
        </div>
      </div>
    </div>
  );
}