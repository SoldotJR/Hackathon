"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Bot,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NeuralNetworkScene = dynamic(
  () =>
    import("@/components/3d/NeuralNetwork").then((m) => m.NeuralNetworkScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-mesh" /> }
);

const workflowSteps = [
  "Master Agent",
  "Requirement",
  "Matching",
  "Ranking",
  "Hiring Report",
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh">
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight">
            TalentPilot AI
          </span>
        </div>
        <Link href="/dashboard">
          <Button variant="glass" size="sm">
            Launch Dashboard
          </Button>
        </Link>
      </nav>

      {/* Hero — brand first, one composition */}
      <section className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 pb-20 pt-8 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <NeuralNetworkScene />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl"
        >
          <motion.h1
            className="font-[family-name:var(--font-syne)] text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            <span className="gradient-text">TalentPilot AI</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-xl text-base text-subtext sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The Future of Autonomous Recruitment
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Link href="/dashboard/recruitment">
              <Button size="lg" className="min-w-[200px]">
                Launch Dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/workflow">
              <Button size="lg" variant="outline" className="min-w-[180px]">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Workflow animation strip */}
      <section className="relative z-10 border-t border-white/5 bg-background/60 px-6 py-16 backdrop-blur-sm lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center text-sm text-subtext">
            Recruitment workflow
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {workflowSteps.map((step, i) => (
              <motion.div
                key={step}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="glass flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm">
                  <Bot className="h-4 w-4 text-primary" />
                  {step}
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 text-subtext sm:block" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Agentic pipeline",
                body: "Ten specialized agents collaborate from requirement parsing to final hire report.",
              },
              {
                icon: Users,
                title: "Ranked matches",
                body: "Skill, salary, and culture signals fused into transparent candidate rankings.",
              },
              {
                icon: Sparkles,
                title: "Interview-ready",
                body: "Questions, schedules, and salary analysis delivered in one dashboard.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="glass glass-hover rounded-[24px] p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <f.icon className="mb-4 h-6 w-6 text-secondary" />
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-subtext">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center text-sm text-subtext">
        TalentPilot AI · Agentic HR Recruitment Manager
      </footer>
    </div>
  );
}
