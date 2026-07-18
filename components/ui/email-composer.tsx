"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, Check, Send, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { EmailStatus } from "@/types/automation";
import { cn } from "@/utils/cn";

export function emailStatusClass(status: EmailStatus) {
  switch (status) {
    case "Sent":
      return "border-accent/30 bg-accent/10 text-accent";
    case "Scheduled":
      return "border-secondary/30 bg-secondary/10 text-secondary";
    case "Pending":
      return "border-warning/30 bg-warning/10 text-warning";
    case "Failed":
      return "border-danger/30 bg-danger/10 text-danger";
  }
}

interface EmailComposerProps {
  subject: string;
  body: string;
  status?: EmailStatus;
  onSubjectChange?: (v: string) => void;
  onBodyChange?: (v: string) => void;
  onSend?: () => void;
  editable?: boolean;
}

export function EmailComposer({
  subject,
  body,
  status,
  onSubjectChange,
  onBodyChange,
  onSend,
  editable = true,
}: EmailComposerProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    const blob = new Blob([`Subject: ${subject}\n\n${body}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass space-y-3 rounded-[24px] p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {status && (
            <Badge className={emailStatusClass(status)}>{status}</Badge>
          )}
          {editable && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing((e) => !e)}
            >
              <Pencil className="h-3.5 w-3.5" />
              {editing ? "Preview" : "Edit"}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" variant="outline" onClick={download}>
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          {onSend && (
            <Button size="sm" onClick={onSend}>
              <Send className="h-3.5 w-3.5" />
              Send
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        <>
          <Input
            value={subject}
            onChange={(e) => onSubjectChange?.(e.target.value)}
            aria-label="Subject"
          />
          <Textarea
            value={body}
            onChange={(e) => onBodyChange?.(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            aria-label="Body"
          />
        </>
      ) : (
        <>
          <p className="text-sm font-medium">{subject}</p>
          <pre
            className={cn(
              "whitespace-pre-wrap rounded-2xl bg-surface/50 p-4 text-sm leading-relaxed text-subtext"
            )}
          >
            {body}
          </pre>
        </>
      )}
    </motion.div>
  );
}
