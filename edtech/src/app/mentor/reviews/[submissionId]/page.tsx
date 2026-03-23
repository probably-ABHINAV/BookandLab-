"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Send, RotateCcw } from "lucide-react";
import Link from "next/link";

const SKILL_LABELS: Record<number, string> = { 1: "Needs work", 2: "Developing", 3: "Adequate", 4: "Strong", 5: "Excellent" };

export default function ReviewSubmissionPage() {
  const { submissionId } = useParams();
  const router = useRouter();
  // Fetch submission data using BOLA-protected endpoint
  const { data: submissionData, isLoading } = useQuery({
    queryKey: ["review", submissionId],
    queryFn: () => fetch(`/api/mentor/reviews/${submissionId}`).then((r) => r.json()),
  });

  const [scores, setScores] = useState({ concept: 0, critical_thinking: 0, application: 0, communication: 0 });
  const [comment, setComment] = useState("");

  const submitReview = useMutation({
    mutationFn: () =>
      fetch(`/api/mentor/reviews/${submissionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scores: {
            concept: scores.concept,
            critical_thinking: scores.critical_thinking,
            application: scores.application,
            communication: scores.communication
          },
          comment,
        }),
      }).then((r) => r.json()),
    onSuccess: (data) => {
      if (data.success) router.push("/mentor/dashboard");
      else alert(data.error || "Review failed");
    },
  });

  const allScored = Object.values(scores).every((s) => s > 0);
  const commentValid = comment.length >= 20;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <Link href="/mentor/reviews" className="p-2 hover:bg-cream-100 rounded-xl"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-heading text-2xl font-bold">Review Submission</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Submission */}
        <div className="card-flat">
          <h2 className="font-heading text-lg font-bold mb-4">Student Submission</h2>
          {isLoading ? (
            <div className="bg-cream-50 rounded-xl p-4 text-sm text-navy-700 min-h-[200px] animate-pulse">Loading...</div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[var(--bg2)] rounded-[12px] p-6 text-[var(--dark)] border border-[var(--br)]">
                <p className="font-bold text-sm text-[var(--mu)] mb-2 uppercase tracking-widest">
                  {submissionData?.submission?.users?.name || "Student"} • {submissionData?.submission?.chapters?.title || "Chapter"}
                </p>
                <div className="whitespace-pre-wrap font-medium leading-relaxed">
                  {submissionData?.submission?.answer_text || "No text provided in this submission."}
                </div>
              </div>
              
              {submissionData?.submission?.file_url && (
                <div className="bg-[var(--c2)] rounded-[12px] p-6 border border-[var(--br)] flex flex-col gap-3">
                  <p className="font-bold text-sm text-[var(--dark)] uppercase tracking-widest">Uploaded File</p>
                  <Link href={submissionData.submission.file_url} target="_blank" className="text-[var(--blue)] font-bold underline">
                    View Attachment (Signed URL natively handled by Supabase Storage UI mapping if integrated)
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Rubric */}
        <div className="card-flat">
          <h2 className="font-heading text-lg font-bold mb-4">Rubric Scoring</h2>
          <div className="space-y-5">
            {(["concept", "critical_thinking", "application", "communication"] as const).map((skill) => (
              <div key={skill}>
                <p className="text-sm font-semibold mb-2 capitalize">{skill.split("_").join(" ")}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setScores({ ...scores, [skill]: n })}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        scores[skill] === n
                          ? "bg-primary-400 text-white shadow-md"
                          : "bg-cream-100 text-navy-600 hover:bg-cream-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {scores[skill] > 0 && (
                  <p className="text-xs text-primary-600 mt-1">{SKILL_LABELS[scores[skill]]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Comment (min 20 chars)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-xl border border-cream-200 min-h-[100px] focus:ring-2 focus:ring-primary-400 focus:outline-none text-sm"
                placeholder="Provide detailed feedback..."
              />
              <p className={`text-xs mt-1 font-bold ${commentValid ? 'text-[var(--green)]' : 'text-red-500'}`}>{comment.length}/1000 characters {commentValid ? "✓" : ""}</p>
            </div>

            <button
              onClick={() => submitReview.mutate()}
              disabled={!allScored || !commentValid || submitReview.isPending}
              className="btn-pill btn-primary w-full justify-center"
            >
              <Send className="w-4 h-4" />
              {submitReview.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
