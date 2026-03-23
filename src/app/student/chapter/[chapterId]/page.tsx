"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Send, Lock } from "lucide-react";

const STEP_NAMES = ["Discovery", "Application", "Review", "Feedback", "Mastery", "Reflection"];

export default function ChapterPage() {
  const { chapterId } = useParams();
  const qc = useQueryClient();
  const [activeStep, setActiveStep] = useState(1);
  const [projectText, setProjectText] = useState("");
  const [reflectionText, setReflectionText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => fetch(`/api/student/chapter/${chapterId}`).then((r) => r.json()),
  });

  const completeStep = useMutation({
    mutationFn: (stepNumber: number) =>
      fetch(`/api/student/chapters/${chapterId}/step-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepNumber }),
      }).then((r) => r.json()),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["chapter", chapterId] });
      if (res.chapter_completed) {
        alert(`🎉 Chapter Complete! Streak: ${res.stats?.streak_count || 0} days`);
      } else if (activeStep < 6) {
        setActiveStep(activeStep + 1);
      }
    },
  });

  const submitProject = useMutation({
    mutationFn: () =>
      fetch("/api/student/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter_id: chapterId, text_answer: projectText }),
      }).then((r) => r.json()),
    onSuccess: () => {
      completeStep.mutate(5);
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-12 bg-[var(--br)] rounded-xl w-64"></div>
        <div className="h-[600px] bg-[var(--wh)] rounded-[16px] border border-[var(--br)]"></div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="text-center py-20 max-w-4xl mx-auto">
        <p className="text-[var(--red)] font-bold mb-6">{data.error}</p>
        <Link href="/student/dashboard" className="bg-[var(--dark)] text-white px-6 py-3 rounded-full font-bold">Go Back</Link>
      </div>
    );
  }

  const chapter = data?.chapter;
  const content = data?.content;
  const progress = data?.progress;
  const stepsCompleted: number[] = progress?.steps_completed ?? [];
  const highestUnlocked = Math.max(1, ...(stepsCompleted.map((s) => s + 1)));

  const handleStepClick = (step: number) => {
    if (step <= highestUnlocked) {
      setActiveStep(step);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-[var(--dark)]">1. Discovery</h2>
            <div className="bg-[var(--bg2)] rounded-[12px] p-8 text-[var(--dark)] text-lg leading-relaxed whitespace-pre-wrap border border-[var(--br)] font-medium">
              {content?.step1_context || "Your mentor has not added discovery content yet. Proceed to the next step when ready."}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-[var(--dark)]">2. Application</h2>
            <div className="bg-[var(--bg2)] rounded-[12px] p-8 text-[var(--dark)] text-lg leading-relaxed whitespace-pre-wrap border border-[var(--br)] font-medium">
              {content?.step2_concept || "Apply your knowledge here."}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-[var(--dark)]">3. Review</h2>
            <div className="space-y-6">
              {(content?.step3_thinking ?? []).length > 0 ? (
                (content.step3_thinking as Array<{ id: string; text: string }>).map((prompt, i) => (
                  <div key={prompt.id || i} className="bg-[var(--wh)] p-6 rounded-[12px] border border-[var(--br)]">
                    <p className="font-bold text-[var(--dark)] mb-4 text-lg">{prompt.text}</p>
                    <textarea 
                      className="w-full p-4 rounded-[8px] border border-[var(--br)] bg-[var(--bg)] min-h-[120px] focus:outline-none focus:border-[var(--y)] font-medium text-[var(--dark)]" 
                      placeholder="Write your response..." 
                    />
                  </div>
                ))
              ) : (
                <p className="text-[var(--mu)] font-bold">No review prompts added yet.</p>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-[var(--dark)]">4. Feedback</h2>
            <div className="bg-[var(--bg2)] rounded-[12px] p-8 text-[var(--dark)] text-lg leading-relaxed whitespace-pre-wrap border border-[var(--br)] font-medium">
              {content?.step4_deep || "Feedback content goes here."}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-[var(--dark)]">5. Mastery (Project)</h2>
            <div className="bg-[var(--bg2)] rounded-[12px] p-8 mb-8 text-[var(--dark)] text-lg leading-relaxed border border-[var(--br)] font-medium">
              {content?.step5_project || "Submit your final assignment for this chapter to prove your mastery."}
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[var(--dark)] mb-2 uppercase tracking-widest">Your Submission</label>
                <textarea
                  value={projectText}
                  onChange={(e) => setProjectText(e.target.value)}
                  className="w-full p-4 rounded-[8px] border border-[var(--br)] bg-[var(--wh)] min-h-[200px] focus:outline-none focus:border-[var(--y)] font-medium text-[var(--dark)]"
                  placeholder="Paste your project link or write your response here (min 10 characters)..."
                />
              </div>
              <button
                onClick={() => submitProject.mutate()}
                disabled={projectText.length < 10 || submitProject.isPending}
                className="bg-[var(--dark)] text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 w-full hover:opacity-90 disabled:opacity-50 transition-opacity text-lg"
              >
                <Send className="w-5 h-5" />
                {submitProject.isPending ? "Submitting..." : "Submit for Mastery"}
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-[var(--dark)]">6. Reflection</h2>
            <div className="bg-[var(--wh)] p-6 rounded-[12px] border border-[var(--br)]">
              <p className="font-bold text-[var(--dark)] mb-4 text-lg">What was the most important thing you learned?</p>
              <textarea 
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                className="w-full p-4 rounded-[8px] border border-[var(--br)] bg-[var(--bg)] min-h-[160px] focus:outline-none focus:border-[var(--y)] font-medium text-[var(--dark)]" 
                placeholder="Reflect on your journey..." 
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard" className="w-12 h-12 bg-[var(--wh)] rounded-full border border-[var(--br)] flex items-center justify-center hover:bg-[var(--c2)] transition-colors">
            <ArrowLeft className="w-6 h-6 text-[var(--dark)]" />
          </Link>
          <div>
            <h1 className="font-black text-2xl text-[var(--dark)]">{chapter?.title}</h1>
            <p className="text-[var(--mu)] font-bold text-xs uppercase tracking-widest mt-1">{chapter?.subjects?.name || "Subject"}</p>
          </div>
        </div>
        <div className="bg-[var(--wh)] px-5 py-2 rounded-full border border-[var(--br)] shadow-sm">
          <span className="text-[var(--dark)] font-black text-sm">Step {activeStep} of 6</span>
        </div>
      </div>

      {/* 2. Main content area */}
      <div className="bg-[var(--wh)] rounded-[16px] border border-[var(--br)] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Massive 6-step progress indicator */}
        <div className="border-b border-[var(--br)] p-6 flex items-center justify-between gap-2 overflow-x-auto">
          {STEP_NAMES.map((name, i) => {
            const step = i + 1;
            const isCompleted = stepsCompleted.includes(step);
            const isActive = step === activeStep;
            const isLocked = step > highestUnlocked;

            let stepClasses = "flex-1 min-w-[120px] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all border-2 ";
            let iconClasses = "w-6 h-6 ";

            if (isActive) {
              stepClasses += "bg-[var(--y)] text-[var(--dark)] border-[var(--dark)] shadow-[2px_2px_0px_#17140D]";
              iconClasses += "text-[var(--dark)]";
            } else if (isCompleted) {
              stepClasses += "bg-[var(--green)] text-white border-[var(--green)] hover:opacity-90";
              iconClasses += "text-white";
            } else if (isLocked) {
              stepClasses += "bg-[var(--bg2)] text-[var(--mu2)] border-[var(--br)] cursor-not-allowed opacity-70";
              iconClasses += "text-[var(--mu2)]";
            } else {
              stepClasses += "bg-[var(--wh)] text-[var(--dark)] border-[var(--br)] hover:bg-[var(--c2)]";
              iconClasses += "text-[var(--dark)]";
            }

            return (
              <div
                key={step}
                onClick={() => handleStepClick(step)}
                className={stepClasses}
              >
                {isCompleted && !isActive ? <CheckCircle2 className={iconClasses} /> : isLocked ? <Lock className={iconClasses} /> : <span className={`font-black text-xl ${iconClasses.replace("w-6 h-6", "")}`}>{step}</span>}
                <span className="font-bold text-xs uppercase tracking-widest text-center">{name}</span>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="p-10 flex-1">
          {renderStepContent()}
        </div>

        {/* Bottom nav */}
        <div className="border-t border-[var(--br)] p-6 flex flex-wrap items-center justify-between gap-4 bg-[var(--bg2)]">
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="border-2 border-[var(--dark)] text-[var(--dark)] px-8 py-3 rounded-full font-bold hover:bg-[var(--dark)] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Previous Step
          </button>
          
          <div className="flex gap-4">
            {/* Provide completion action if not done and not pending submission */}
            {!stepsCompleted.includes(activeStep) && activeStep !== 5 && (
               <button
                 onClick={() => completeStep.mutate(activeStep)}
                 disabled={completeStep.isPending}
                 className="bg-[var(--green)] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-[2px_2px_0px_#17140D] border-2 border-[var(--dark)]"
               >
                 {completeStep.isPending ? "Saving..." : "Mark Complete"}
               </button>
            )}

            <button
              onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
              disabled={activeStep === 6 || activeStep > highestUnlocked || (!stepsCompleted.includes(activeStep) && activeStep >= highestUnlocked)}
              className="bg-[var(--dark)] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30 disabled:pointer-events-none"
            >
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
