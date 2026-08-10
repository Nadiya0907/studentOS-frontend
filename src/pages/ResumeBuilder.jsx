import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileText, Download, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import Topbar from "../components/common/Topbar";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { aiService } from "../services/aiService";

export default function ResumeBuilder() {
  const { onMenu } = useOutletContext() || {};

  const [data, setData] = useState({
    name: "Nadz",
    title: "Computer Science Student",
    email: "student@example.com",
    summary:
      "Motivated student building full-stack applications and learning modern software engineering.",
    skills:
      "React, JavaScript, Python, FastAPI, MongoDB",
    experience:
      "StudentOS — Frontend Developer",
  });

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const reviewResume = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("title", data.title);
      formData.append("email", data.email);
      formData.append("summary", data.summary);
      formData.append("skills", data.skills);
      formData.append("experience", data.experience);

      const response = await aiService.reviewResume(formData);

      setReview(
        response.data?.reply ||
          response.data?.message ||
          "Demo ATS review: strengthen quantified impact and keep skills aligned with the job description."
      );
    } catch (error) {
      setReview(
        "Demo ATS review: strengthen quantified impact, use measurable achievements, and keep your skills aligned with the target job description."
      );

      toast.error(
        "Live AI review unavailable. Showing demo feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  const exportResume = () => {
    window.print();
  };

  return (
    <div>
      <Topbar
        onMenu={onMenu}
        title="Resume Builder"
        subtitle="Build a clean, placement-ready resume"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Resume Form */}
        <Card>
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Resume details
              </h2>

              <p className="text-xs text-gray-500">
                Keep the content concise and measurable.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <Input
              label="Name"
              value={data.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
            />

            <Input
              label="Target title"
              value={data.title}
              onChange={(e) =>
                updateField("title", e.target.value)
              }
            />

            <Input
              label="Email"
              type="email"
              value={data.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
            />

            <Input
              label="Skills"
              value={data.skills}
              onChange={(e) =>
                updateField("skills", e.target.value)
              }
            />

            <div>
              <label className="text-xs font-medium text-gray-400">
                Summary
              </label>

              <textarea
                value={data.summary}
                onChange={(e) =>
                  updateField("summary", e.target.value)
                }
                rows={4}
                className="mt-1.5 w-full rounded-xl border border-bg-border bg-bg-hover p-3 text-sm text-white outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400">
                Experience
              </label>

              <textarea
                value={data.experience}
                onChange={(e) =>
                  updateField("experience", e.target.value)
                }
                rows={4}
                className="mt-1.5 w-full rounded-xl border border-bg-border bg-bg-hover p-3 text-sm text-white outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={exportResume}>
                <Download size={15} />
                Export / Print
              </Button>

              <Button
                variant="secondary"
                onClick={reviewResume}
                disabled={loading}
              >
                <Sparkles size={15} />

                {loading
                  ? "Reviewing..."
                  : "AI Review"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Resume Preview */}
        <Card className="bg-white text-gray-900">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold">
              {data.name}
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              {data.title}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {data.email}
            </p>
          </div>

          <section className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Summary
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {data.summary}
            </p>
          </section>

          <section className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Skills
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {data.skills}
            </p>
          </section>

          <section className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Experience
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {data.experience}
            </p>
          </section>

          {review && (
            <section className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-4">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={16}
                  className="text-violet-600"
                />

                <h3 className="font-bold text-violet-700">
                  AI Resume Review
                </h3>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-700">
                {review}
              </p>
            </section>
          )}
        </Card>
      </div>
    </div>
  );
}