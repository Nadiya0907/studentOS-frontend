import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Camera,
  Save,
  Plus,
  X,
  GraduationCap,
  Mail,
  Building2,
  CalendarDays,
  Code2,
  FileText,
  CheckCircle2,
  Phone,
  Hash,
} from "lucide-react";

import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import { profileService } from "../services/profileService";
import { useAuth } from "../context/AuthContext";

const demoProfile = {
  full_name: "Nadz",
  name: "Nadz",
  email: "student@college.edu",
  roll_number: "CS-101",
  department: "Computer Science",
  semester: 6,
  phone: "",
  college: "Your College",
  bio: "Computer Science student interested in software development, AI and building real-world applications.",
  skills: [
    "Java",
    "Spring Boot",
    "React",
    "JavaScript",
    "SQL",
    "Git",
  ],
};

export default function Profile() {
  const { onMenu } = useOutletContext() || {};
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState([]);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const rollNumber =
    user?.roll_number || "CS-101";

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setUsingDemoData(false);

      try {
        const response =
          await profileService.getProfile();

        const profile =
          response?.data || response;

        if (mounted && profile) {
          reset({
            ...profile,
            full_name:
              profile.full_name ||
              profile.name ||
              user?.name ||
              "",
            name:
              profile.name ||
              profile.full_name ||
              user?.name ||
              "",
            email:
              profile.email ||
              user?.email ||
              "",
            roll_number:
              profile.roll_number ||
              rollNumber,
            department:
              profile.department || "",
            semester:
              profile.semester || "",
            phone:
              profile.phone || "",
            college:
              profile.college || "",
            bio:
              profile.bio || "",
          });

          setSkills(
            Array.isArray(profile.skills)
              ? profile.skills
              : []
          );
        }
      } catch (error) {
        console.error(
          "Profile load error:",
          error
        );

        if (mounted) {
          reset(demoProfile);
          setSkills(demoProfile.skills);
          setUsingDemoData(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [reset, rollNumber, user?.email, user?.name]);

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) {
      return;
    }

    if (
      skills.some(
        (existingSkill) =>
          existingSkill.toLowerCase() ===
          skill.toLowerCase()
      )
    ) {
      toast.error("Skill already added.");
      return;
    }

    setSkills((current) => [
      ...current,
      skill,
    ]);

    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills((current) =>
      current.filter(
        (skill) => skill !== skillToRemove
      )
    );
  };

  const submit = async (formData) => {
    setSaving(true);

    const backendData = {
      roll_number:
        formData.roll_number?.trim() ||
        rollNumber,

      department:
        formData.department?.trim() || null,

      semester:
        formData.semester !== ""
          ? Number(formData.semester)
          : null,

      phone:
        formData.phone?.trim() || null,
    };

    try {
      await profileService.updateProfile(
        backendData,
        rollNumber
      );

      toast.success(
        "Profile updated successfully"
      );

      setUsingDemoData(false);

      /*
       * The backend currently supports only:
       * roll_number, department, semester, phone
       *
       * Other frontend-only fields are intentionally
       * preserved for future backend integration.
       */
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      let message =
        "Profile could not be saved.";

      if (Array.isArray(detail)) {
        message = detail
          .map((item) => item.msg)
          .join(", ");
      } else if (
        typeof detail === "string"
      ) {
        message = detail;
      }

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file."
      );
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await profileService.uploadPhoto(
        formData
      );

      toast.success(
        "Profile photo uploaded successfully"
      );
    } catch (error) {
      console.error(
        "Photo upload error:",
        error
      );

      toast.error(
        "Profile photo upload failed."
      );
    } finally {
      event.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
        <p className="text-sm font-medium text-violet-400">
          StudentOS Profile
        </p>

        <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
          Your student identity.
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          Keep your academic information, skills and personal details
          updated for learning and placement opportunities.
        </p>
      </section>

      {/* Demo notice */}
      {usingDemoData && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          Some profile fields are currently frontend-only because
          the backend profile schema supports only selected academic
          fields.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="grid h-28 w-28 place-items-center rounded-3xl bg-accent-gradient text-4xl font-black text-white shadow-glow">
                {(user?.name ||
                  demoProfile.name ||
                  "N")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <label className="absolute -bottom-2 -right-2 grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-bg-border bg-bg-card text-gray-300 shadow-lg transition hover:text-white">
                <Camera size={16} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadPhoto}
                />
              </label>
            </div>

            <h2 className="mt-5 text-lg font-bold text-white">
              {user?.name ||
                demoProfile.name ||
                "Student Profile"}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Keep your profile ready for placements.
            </p>
          </div>

          {/* Profile completion */}
          <div className="mt-7 rounded-xl border border-bg-border bg-bg-hover p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Profile completion
              </span>

              <span className="text-xs font-semibold text-emerald-400">
                85%
              </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-border">
              <div
                className="h-full rounded-full bg-accent-gradient"
                style={{ width: "85%" }}
              />
            </div>

            <p className="mt-3 text-[11px] leading-5 text-gray-600">
              Add a profile photo and resume to complete your profile.
            </p>
          </div>

          {/* Quick information */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3">
              <Mail
                size={15}
                className="text-gray-500"
              />

              <span className="text-xs text-gray-400">
                {user?.email ||
                  demoProfile.email}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Hash
                size={15}
                className="text-gray-500"
              />

              <span className="text-xs text-gray-400">
                Roll No: {rollNumber}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap
                size={15}
                className="text-gray-500"
              />

              <span className="text-xs text-gray-400">
                Academic profile
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Code2
                size={15}
                className="text-gray-500"
              />

              <span className="text-xs text-gray-400">
                Technical skills
              </span>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-white">
              Personal & Academic Information
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Update the information supported by the StudentOS backend.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(submit)}
            className="space-y-6"
          >
            {/* Basic information */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Basic information
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  {...register("name")}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="you@college.edu"
                  {...register("email")}
                />

                <Input
                  label="Roll Number"
                  placeholder="CS-101"
                  {...register(
                    "roll_number"
                  )}
                />

                <Input
                  label="Phone"
                  placeholder="9876543210"
                  {...register("phone")}
                />

                <Input
                  label="Department"
                  placeholder="Computer Science"
                  {...register(
                    "department"
                  )}
                />

                <Input
                  label="Semester"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="6"
                  {...register("semester")}
                />

                <Input
                  label="College"
                  placeholder="Your college name"
                  {...register("college")}
                />
              </div>
            </div>

            {/* Backend note */}
            <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={18}
                  className="mt-0.5 text-blue-400"
                />

                <div>
                  <p className="text-sm font-medium text-white">
                    Backend-supported profile fields
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Roll number, department, semester and phone are
                    currently saved to the backend. Name, email, college,
                    bio and skills remain available in the frontend for
                    future backend support.
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs font-medium text-gray-400">
                Bio
              </label>

              <textarea
                {...register("bio")}
                rows={4}
                placeholder="Tell us a little about yourself..."
                className="mt-1.5 w-full resize-none rounded-xl border border-bg-border bg-bg-hover p-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/50"
              />
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Technical skills
                  </p>

                  <p className="mt-1 text-[11px] text-gray-600">
                    Add skills that represent your current abilities.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-300"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(skill)
                      }
                      className="text-purple-400 transition hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}

                {skills.length === 0 && (
                  <p className="text-xs text-gray-600">
                    No skills added yet.
                  </p>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  value={newSkill}
                  onChange={(event) =>
                    setNewSkill(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. React"
                  className="min-w-0 flex-1 rounded-xl border border-bg-border bg-bg-hover px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:text-white"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>

            {/* Profile readiness */}
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 text-emerald-400"
                />

                <div>
                  <p className="text-sm font-medium text-white">
                    Placement ready profile
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Keep your academic information, technical skills,
                    resume and profile details updated.
                  </p>
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end border-t border-bg-border pt-5">
              <Button
                type="submit"
                disabled={saving}
              >
                <Save size={15} />

                {saving
                  ? "Saving..."
                  : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Additional profile sections */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
              <Building2 size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Academic Profile
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Keep your academic information updated.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-bg-border bg-bg-hover p-3">
              <p className="text-[10px] text-gray-600">
                Current semester
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {demoProfile.semester}th
              </p>
            </div>

            <div className="rounded-xl border border-bg-border bg-bg-hover p-3">
              <p className="text-[10px] text-gray-600">
                Academic status
              </p>

              <p className="mt-1 text-sm font-semibold text-emerald-400">
                Active
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
              <FileText size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Resume
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Manage the resume used for placement applications.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              toast(
                "Resume management is available in Resume Builder."
              )
            }
            className="mt-5 w-full rounded-xl border border-bg-border bg-bg-hover px-4 py-3 text-xs font-semibold text-gray-300 transition hover:text-white"
          >
            Manage Resume
          </button>
        </Card>
      </div>
    </div>
  );
}