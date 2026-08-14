import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileText, Download, Save } from "lucide-react";
import toast from "react-hot-toast";

import Topbar from "../components/common/Topbar";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { resumeService } from "../services/resumeService";

export default function ResumeBuilder() {
  const { onMenu } = useOutletContext() || {};

  const [data, setData] = useState({
    full_name: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    experience: "Fresher",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadResume = async () => {
      try {
        const response = await resumeService.getResume();
        const savedResume = response?.data;

        if (
          mounted &&
          savedResume &&
          !savedResume.message
        ) {
          setData((current) => ({
            ...current,
            ...savedResume,
          }));
        }
      } catch (error) {
        console.error("Resume load error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadResume();

    return () => {
      mounted = false;
    };
  }, []);

  const updateField = (field, value) => {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveResume = async () => {
    if (!data.full_name.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!data.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    if (!data.phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (!data.education.trim()) {
      toast.error("Education is required.");
      return;
    }

    if (!data.skills.trim()) {
      toast.error("Skills are required.");
      return;
    }

    setSaving(true);

    try {
      await resumeService.saveResume(data);
      toast.success("Resume saved successfully.");
    } catch (error) {
      console.error("Resume save error:", error);

      const detail = error?.response?.data?.detail;

      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not save resume."
      );
    } finally {
      setSaving(false);
    }
  };

  const exportResume = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="grid min-h-[400px] place-items-center">
        <div className="text-sm text-gray-500">
          Loading resume...
        </div>
      </div>
    );
  }

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
                Enter the information used by your StudentOS resume.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <Input
              label="Full Name"
              value={data.full_name}
              onChange={(event) =>
                updateField(
                  "full_name",
                  event.target.value
                )
              }
              placeholder="Your full name"
            />

            <Input
              label="Email"
              type="email"
              value={data.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value
                )
              }
              placeholder="you@example.com"
            />

            <Input
              label="Phone"
              value={data.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                )
              }
              placeholder="9876543210"
            />

            <Input
              label="Education"
              value={data.education}
              onChange={(event) =>
                updateField(
                  "education",
                  event.target.value
                )
              }
              placeholder="B.Tech Computer Science"
            />

            <Input
              label="Skills"
              value={data.skills}
              onChange={(event) =>
                updateField(
                  "skills",
                  event.target.value
                )
              }
              placeholder="Java, Spring Boot, React, SQL"
            />

            <div>
              <label className="text-xs font-medium text-gray-400">
                Experience
              </label>

              <textarea
                value={data.experience}
                onChange={(event) =>
                  updateField(
                    "experience",
                    event.target.value
                  )
                }
                rows={5}
                placeholder="Fresher or describe your experience..."
                className="mt-1.5 w-full resize-none rounded-xl border border-bg-border bg-bg-hover p-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-accent"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={saveResume}
                disabled={saving}
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save Resume"}
              </Button>

              <Button
                variant="secondary"
                onClick={exportResume}
              >
                <Download size={15} />
                Export / Print
              </Button>
            </div>
          </div>
        </Card>

        {/* Resume Preview */}
        <Card className="bg-white text-gray-900">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold">
              {data.full_name || "Your Name"}
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              {data.education || "Education"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {data.email || "email@example.com"}
              {data.phone
                ? ` • ${data.phone}`
                : ""}
            </p>
          </div>

          <section className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Education
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {data.education ||
                "Add your education details."}
            </p>
          </section>

          <section className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Skills
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {data.skills || "Add your skills."}
            </p>
          </section>

          <section className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Experience
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              {data.experience || "Fresher"}
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}