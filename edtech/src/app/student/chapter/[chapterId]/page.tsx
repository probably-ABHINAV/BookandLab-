"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Brain, Lightbulb,
  Microscope, Rocket, Sparkles, Send, Lock,
} from "lucide-react";
import { StepProgress } from "@/components/ui";

const STEP_NAMES = ["Context", "Concept", "Thinking", "Deep Dive", "Project", "Reflection"];
const STEP_ICONS = [BookOpen, Lightbulb, Brain, Microscope, Rocket, Sparkles];
const STEP_COLORS = ["bg-blue-50 text-blue-600", "bg-amber-50 text-amber-600", "bg-purple-50 text-purple-600", "bg-green-50 text-green-600", "bg-red-50 text-red-600", "bg-indigo-50 text-indigo-600"];

export default function ChapterPage() {
  const { chapterId } = useParams();
  const qc = useQueryClient();
  const [activeStep, setActiveStep] = useState(1);
  const [projectText, setProjectText] = useState("");
  const [reflectionText, setReflectionText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => fetch(`/api/student/chapter/${chapterId}`).then((r) => r.json()),
    staleTime: 30_000,
  });

  const completeStep = useMutation({
    mutationFn: (step: number) =>
      fetch("/api/student/step-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter_id: chapterId, step }),
      }).then((r) => r.json()),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["chapter", chapterId] });
      if (res.chapter_completed) {
        alert(`🎉 Chapter Complete! Streak: ${res.streak} days`);
      } else if (activeStep < 6) {
        setActiveStep(activeStep + 1);
      }
    },
  });

  const submitProject = useMutation({
    mutationFn: () =>
      fetch("/api/student/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter_id: chapterId, text_answer: projectText, reflection: reflectionText || undefined }),
      }).then((r) => r.json()),
    onSuccess: () => {
      completeStep.mutate(5);
    },
  });

  if (isLoading) return <div className="skeleton h-96" />;
  if (data?.error) return <div className="text-center py-20"><p className="text-red-500">{data.error}</p><Link href="/student/subjects" className="btn-pill btn-primary mt-4">Go Back</Link></div>;

  const chapter = data?.chapter;
  const content = data?.content;
  const progress = data?.progress;
  const stepsCompleted: number[] = progress?.steps_completed ?? [];

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="prose max-w-none">
            <h2 className="font-heading text-2xl font-bold mb-4">📍 Context</h2>
            <div className="bg-cream-50 rounded-2xl p-6 text-navy-700 leading-relaxed whitespace-pre-wrap">
              {content?.step1_context || "No context content yet. Your admin will add this."}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-4">💡 Core Concept</h2>
            <div className="bg-cream-50 rounded-2xl p-6 text-navy-700 leading-relaxed whitespace-pre-wrap">
              {content?.step2_concept || "No concept content yet."}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-4">🧠 Critical Thinking</h2>
            <div className="space-y-4">
              {(content?.step3_thinking ?? []).length > 0 ? (
                (content.step3_thinking as Array<{ id: string; text: string }>).map((prompt, i) => (
                  <div key={prompt.id || i} className="card-flat">
                    <p className="font-medium mb-2">{prompt.text}</p>
                    <textarea className="w-full p-3 rounded-xl border border-cream-200 min-h-[80px] focus:ring-2 focus:ring-primary-400 focus:outline-none" placeholder="Write your response..." />
                  </div>
                ))
              ) : (
                <p className="text-navy-600">No thinking prompts added yet.</p>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-4">🔬 Deep Dive</h2>
            <div className="bg-cream-50 rounded-2xl p-6 text-navy-700 leading-relaxed whitespace-pre-wrap">
              {content?.step4_deep || "No deep dive content yet."}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-4">🚀 Project Submission</h2>
            <div className="bg-cream-50 rounded-2xl p-6 mb-4 text-navy-700 whitespace-pre-wrap">
              {content?.step5_project || "Complete the project below."}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Your Answer</label>
                <textarea
                  value={projectText}
                  onChange={(e) => setProjectText(e.target.value)}
                  className="w-full p-4 rounded-xl border border-cream-200 min-h-[150px] focus:ring-2 focus:ring-primary-400 focus:outline-none"
                  placeholder="Write your project response (min 10 characters)..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Reflection (optional)</label>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  className="w-full p-4 rounded-xl border border-cream-200 min-h-[80px] focus:ring-2 focus:ring-primary-400 focus:outline-none"
                  placeholder="What did you learn?"
                />
              </div>
              <button
                onClick={() => submitProject.mutate()}
                disabled={projectText.length < 10 || submitProject.isPending}
                className="btn-pill btn-primary"
              >
                <Send className="w-4 h-4" />
                {submitProject.isPending ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-4">✨ Reflection</h2>
            <div className="space-y-4">
              {(content?.step6_reflection ?? []).length > 0 ? (
                (content.step6_reflection as Array<{ id: string; text: string }>).map((prompt, i) => (
                  <div key={prompt.id || i} className="card-flat">
                    <p className="font-medium mb-2">{prompt.text}</p>
                    <textarea className="w-full p-3 rounded-xl border border-cream-200 min-h-[80px] focus:ring-2 focus:ring-primary-400 focus:outline-none" placeholder="Reflect..." />
                  </div>
                ))
              ) : (
                <div className="card-flat">
                  <p className="font-medium mb-2">What was the most important thing you learned?</p>
                  <textarea className="w-full p-3 rounded-xl border border-cream-200 min-h-[80px] focus:ring-2 focus:ring-primary-400 focus:outline-none" placeholder="Reflect on your journey..." />
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/student/subjects" className="p-2 hover:bg-cream-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-bold">{chapter?.title}</h1>
            <p className="text-sm text-navy-600">{chapter?.subjects?.name}</p>
          </div>
        </div>
        <StepProgress stepsCompleted={stepsCompleted} currentStep={activeStep} />
      </div>

      <div className="grid grid-cols-[200px_1fr_220px] gap-6">
        {/* Left sidebar — Step list */}
        <div className="space-y-1">
          {STEP_NAMES.map((name, i) => {
            const step = i + 1;
            const isDone = stepsCompleted.includes(step);
            const isCurrent = step === activeStep;
            const Icon = STEP_ICONS[i];

            return (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isCurrent ? "bg-primary-50 text-primary-700" : isDone ? "text-green-600" : "text-navy-600 hover:bg-cream-100"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? "text-primary-500" : "text-navy-400"}`} />
                )}
                <span className="truncate">{name}</span>
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div className="min-h-[60vh]">{renderStepContent()}</div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="card-flat">
            <h3 className="font-semibold text-sm mb-2">Chapter Progress</h3>
            <p className="text-2xl font-bold">{stepsCompleted.length} / 6</p>
            <p className="text-xs text-navy-600">steps completed</p>
            <div className="h-2 bg-cream-200 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-primary-400 rounded-full transition-all"
                style={{ width: `${(stepsCompleted.length / 6) * 100}%` }}
              />
            </div>
          </div>

          <div className="card-flat">
            <p className="text-xs text-navy-600 mb-1">Estimated time</p>
            <p className="text-sm font-semibold">{chapter?.estimated_minutes ?? 45} minutes</p>
          </div>

          <button
            onClick={() => completeStep.mutate(activeStep)}
            disabled={stepsCompleted.includes(activeStep) || completeStep.isPending}
            className={`btn-pill w-full justify-center text-sm ${
              stepsCompleted.includes(activeStep) ? "bg-green-100 text-green-700 cursor-default" : "btn-primary"
            }`}
          >
            {stepsCompleted.includes(activeStep) ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </>
            ) : completeStep.isPending ? (
              "Saving..."
            ) : (
              "Mark Step Complete"
            )}
          </button>

          {activeStep < 6 && (
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="btn-pill btn-outline w-full justify-center text-sm"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
