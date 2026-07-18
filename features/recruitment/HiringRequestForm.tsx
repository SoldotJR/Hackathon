"use client";

import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Upload,
  FileText,
  Mic,
  MicOff,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRecruitmentStore } from "@/store/recruitment-store";
import {
  generateRecruitmentPlan,
  simulateAgentWorkflow,
  uploadResume,
} from "@/services/recruitment";
import { notify } from "@/services/notifications";
import { cn } from "@/utils/cn";

const schema = z.object({
  request: z
    .string()
    .min(20, "Please describe the role in more detail (at least 20 characters)"),
});

type FormValues = z.infer<typeof schema>;

const PLACEHOLDER = `We need to hire two Junior Frontend Developers.

Required Skills:
• React
• TypeScript
• TailwindCSS

Budget:
Under $1500/month

English communication required.`;

interface UploadedFile {
  id: string;
  name: string;
  preview: string;
}

export function HiringRequestForm() {
  const { setRequest, setPhase, setAgents, setPlan } = useRecruitmentStore();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [listening, setListening] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { request: "" },
  });

  const requestValue = watch("request");

  const handleFiles = useCallback(async (list: FileList | File[]) => {
    const arr = Array.from(list).filter(
      (f) =>
        f.type === "application/pdf" ||
        f.name.toLowerCase().endsWith(".pdf") ||
        f.name.toLowerCase().endsWith(".txt")
    );
    if (!arr.length) return;
    setUploading(true);
    try {
      const uploaded: UploadedFile[] = [];
      for (const file of arr) {
        const res = await uploadResume(file);
        if (res.success) {
          uploaded.push({
            id: res.data.id,
            name: res.data.filename,
            preview: res.data.textPreview,
          });
        }
      }
      setFiles((prev) => [...prev, ...uploaded]);
      if (uploaded.length) {
        notify.resumeUploaded(
          uploaded.length === 1 ? uploaded[0].name : `${uploaded.length} files`
        );
      }
    } finally {
      setUploading(false);
    }
  }, []);

  const toggleVoice = () => {
    type SpeechRecConstructor = new () => {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      start: () => void;
      stop: () => void;
      onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
    };

    const w = window as Window & {
      SpeechRecognition?: SpeechRecConstructor;
      webkitSpeechRecognition?: SpeechRecConstructor;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setError("Voice input is not supported in this browser.");
      return;
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue("request", transcript, { shouldValidate: true });
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setRequest(values.request);
    setPhase("processing");
    setPlan(null);

    try {
      const workflowPromise = simulateAgentWorkflow((agents, activeId) => {
        setAgents(agents, activeId);
      });

      const [res] = await Promise.all([
        generateRecruitmentPlan({
          request: values.request,
          resume_ids: files.map((f) => f.id),
        }),
        workflowPromise,
      ]);

      if (res.success) {
        setPlan(res.data);
        setPhase("complete");
        notify.workflowCompleted();
      } else {
        setError(res.message || "Failed to generate plan");
        setPhase("idle");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("idle");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass gradient-border relative overflow-hidden rounded-[24px] p-6 sm:p-8"
    >
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-secondary/15 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-2xl bg-primary/20 p-3">
            <Wand2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold">
              Hiring Request
            </h2>
            <p className="mt-1 text-sm text-subtext">
              Describe who you need. Upload resumes optionally — our multi-agent
              system handles the rest.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder={PLACEHOLDER}
              aria-label="Hiring request"
              {...register("request")}
              className="min-h-[200px] pr-12 text-[15px] leading-relaxed"
            />
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={listening ? "Stop voice input" : "Start voice input"}
              className={cn(
                "absolute right-3 top-3 rounded-xl p-2 transition-colors",
                listening
                  ? "bg-danger/20 text-danger"
                  : "bg-surface/80 text-subtext hover:text-text"
              )}
            >
              {listening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.request && (
            <p className="text-sm text-danger" role="alert">
              {errors.request.message}
            </p>
          )}

          {/* Resume upload */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-6 transition-colors",
              dragOver
                ? "border-primary bg-primary/10"
                : "border-border bg-surface/40"
            )}
          >
            <Upload className="h-5 w-5 text-secondary" />
            <p className="text-sm text-subtext">
              Drag & drop resumes (PDF) or{" "}
              <button
                type="button"
                className="text-primary underline-offset-2 hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            {uploading && (
              <p className="flex items-center gap-2 text-xs text-secondary">
                <Loader2 className="h-3 w-3 animate-spin" /> Uploading…
              </p>
            )}
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {files.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-3 rounded-xl bg-surface/60 px-3 py-2 text-sm"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate flex-1">{f.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${f.name}`}
                      onClick={() =>
                        setFiles((prev) => prev.filter((x) => x.id !== f.id))
                      }
                      className="rounded-lg p-1 text-subtext hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || !requestValue}
              className="w-full sm:w-auto"
            >
              <Sparkles className="h-5 w-5" />
              Generate Recruitment Plan
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setValue("request", PLACEHOLDER, { shouldValidate: true })
              }
            >
              Use sample request
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

