"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { X, Link2, MoveVertical } from "lucide-react";

export default function AdminContentEditorPage({ params }: { params: { id: string } }) {
  const qc = useQueryClient();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, unknown> | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-chapter-content", params.id],
    queryFn: () => fetch(`/api/admin/chapters/${params.id}/content`).then((r) => r.json()),
  });

  useEffect(() => {
    if (data?.content && !formData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(data.content);
    }
  }, [data, formData]);

  const saveMutation = useMutation({
    mutationFn: (newContent: Record<string, unknown>) =>
      fetch(`/api/admin/chapters/${params.id}/content`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      }).then(r => r.json()),
    onMutate: () => setSaveStatus("saving"),
    onSuccess: () => { setSaveStatus("saved"); qc.invalidateQueries({ queryKey: ["admin-chapter-content", params.id] }); },
  });

  const publishMutation = useMutation({
    mutationFn: (published: boolean) =>
      fetch(`/api/admin/chapters/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: published }),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-chapter-content", params.id] }),
  });

  useEffect(() => {
    if (!formData) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveStatus("unsaved");
    const t = setTimeout(() => {
      saveMutation.mutate(formData);
    }, 2000);
    return () => clearTimeout(t);
  }, [formData, saveMutation]);

  const updateField = (step: number, field: string, value: unknown) => {
    setFormData((prev: Record<string, unknown>) => ({
      ...prev,
      [`step${step}_${field}`]: value
    }));
  };

  if (isLoading || !formData) {
    return (
      <div className="flex flex-col h-full items-center justify-center animate-pulse gap-6 py-20">
        <div className="w-16 h-16 border-4 border-t-[var(--y)] border-r-[var(--y)] border-b-[var(--br)] border-l-[var(--br)] rounded-full animate-spin"></div>
        <p className="text-[var(--mu)] font-bold">Loading content editor...</p>
      </div>
    );
  }

  const stepsInfo = [
    { id: 1, name: "Context", fields: ["context", "guiding_question"] },
    { id: 2, name: "Concept", fields: ["concept", "key_terms"] },
    { id: 3, name: "Thinking", fields: ["thinking"] },
    { id: 4, name: "Deep Learning", fields: ["deep", "examples"] },
    { id: 5, name: "Project", fields: ["project", "rubric"] },
    { id: 6, name: "Reflection", fields: ["reflection"] },
  ];

  const hasContent = (stepId: number) => {
    const info = stepsInfo.find(s => s.id === stepId)!;
    return info.fields.some(f => {
      const val = formData[`step${stepId}_${f}`];
      if (Array.isArray(val)) return val.length > 0;
      return !!val;
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] mt-[-28px] mx-[-28px] overflow-hidden flex flex-col bg-[var(--bg)]">
      
      {/* TOPBAR */}
      <div className="bg-[var(--wh)] border-b border-[var(--br)] px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="text-[var(--mu)] hover:text-[var(--dark)] font-bold text-sm">
            ← Back
          </button>
          <div className="h-6 w-px bg-[var(--br)]"></div>
          {isEditingTitle ? (
             <input
              type="text"
              defaultValue={data?.chapter?.title}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
              className="font-black text-xl text-[var(--dark)] bg-transparent border-b-2 border-[var(--y)] focus:outline-none"
            />
          ) : (
            <h1 onClick={() => setIsEditingTitle(true)} className="font-black text-xl text-[var(--dark)] cursor-text hover:bg-[var(--c2)] px-2 -mx-2 rounded transition-colors">
              {data?.chapter?.title || "Untitled Chapter"} 
              <span className="text-[var(--mu)] text-xs ml-2 opacity-50 font-normal">click to edit</span>
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold w-32 text-right">
            {saveStatus === "saving" && <span className="text-[var(--mu)] italic">Saving...</span>}
            {saveStatus === "saved" && <span className="text-[var(--green)]">Saved ✓</span>}
            {saveStatus === "unsaved" && <span className="text-[var(--amber)]">Unsaved changes</span>}
          </span>
          <div className="h-6 w-px bg-[var(--br)]"></div>
          <label className="flex items-center gap-3 cursor-pointer">
            <span className={`text-sm font-bold ${data?.chapter?.is_published ? 'text-[var(--dark)]' : 'text-[var(--mu)]'}`}>
              {data?.chapter?.is_published ? 'Published' : 'Draft'}
            </span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={data?.chapter?.is_published} onChange={(e) => publishMutation.mutate(e.target.checked)} />
              <div className={`block w-12 h-6 rounded-full transition-colors ${data?.chapter?.is_published ? 'bg-[var(--green)]' : 'bg-[var(--br)]'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data?.chapter?.is_published ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-[200px] shrink-0 bg-[var(--wh)] border-r border-[var(--br)] p-4 flex flex-col justify-between overflow-y-auto">
          <div>
            <h3 className="text-[11px] font-bold text-[var(--mu)] uppercase tracking-[.09em] mb-3">Steps</h3>
            <div className="space-y-1">
              {stepsInfo.map(step => {
                const isActive = activeStep === step.id;
                const filled = hasContent(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full flex items-center gap-2 p-2 rounded-[10px] text-left transition-colors ${isActive ? 'bg-[var(--dark)] text-white' : 'hover:bg-[var(--cream)] text-[var(--dark)]'}`}
                  >
                    <div className={`w-[26px] h-[26px] shrink-0 rounded-[8px] flex items-center justify-center font-bold text-xs ${isActive ? 'bg-white text-[var(--dark)]' : filled ? 'bg-[var(--y)] bg-opacity-20 text-[var(--yd)]' : 'bg-[var(--bg2)] border border-[var(--br)] text-[var(--mu)]'}`}>
                      {step.id}
                    </div>
                    <span className="text-xs font-semibold flex-1 truncate">{step.name}</span>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${filled ? 'bg-[var(--green)]' : 'bg-[var(--br)]'}`}></div>
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t border-[var(--br)]">
            <button className="text-xs font-bold text-[var(--dark)] hover:text-[var(--y)] flex items-center gap-1 transition-colors">
              View as student <Link2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* MAIN EDITOR */}
        <div className="flex-1 overflow-y-auto bg-[var(--bg)] flex flex-col">
          <div className="p-8 pb-32 max-w-3xl mx-auto w-full flex-1">
            
            {activeStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-black text-[var(--dark)]">Step 1 — Context</h2>
                <div className="bg-[var(--wh)] border border-[var(--br)] p-6 rounded-[16px] shadow-sm space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--dark)] mb-2">Scenario text</label>
                    <textarea
                      value={formData.step1_context || ""}
                      onChange={(e) => updateField(1, "context", e.target.value)}
                      className="w-full min-h-[120px] p-4 rounded-[12px] border border-[var(--br)] bg-transparent focus:border-[var(--y)] focus:outline-none text-sm text-[var(--dark)] placeholder-[var(--mu2)]"
                      placeholder="Explain why this matters contextually..."
                    />
                    <div className="text-right text-[11px] text-[var(--mu)] mt-1">{formData.step1_context?.split(/\s+/).filter(Boolean).length || 0} / 400 words</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--dark)] mb-2">Guiding question</label>
                    <input
                      value={formData.step1_guiding_question || ""}
                      onChange={(e) => updateField(1, "guiding_question", e.target.value)}
                      className="w-full p-3 rounded-[10px] border border-[var(--br)] bg-transparent focus:border-[var(--y)] focus:outline-none text-sm text-[var(--dark)]"
                      placeholder="E.g. How does this apply to your daily life?"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-black text-[var(--dark)]">Step 2 — Concept</h2>
                <div className="bg-[var(--wh)] border border-[var(--br)] p-6 rounded-[16px] shadow-sm space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--dark)] mb-2">Main explanation (Markdown supported)</label>
                    <textarea
                      value={formData.step2_concept || ""}
                      onChange={(e) => updateField(2, "concept", e.target.value)}
                      className="w-full min-h-[200px] p-4 rounded-[12px] border border-[var(--br)] bg-transparent focus:border-[var(--y)] focus:outline-none text-sm text-[var(--dark)]"
                      placeholder="Core pedagogical content..."
                    />
                    <div className="text-right text-[11px] text-[var(--mu)] mt-1">{formData.step2_concept?.split(/\s+/).filter(Boolean).length || 0} / 400 words</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--dark)] mb-2">Key terms (comma separated)</label>
                    <input
                      value={(formData.step2_key_terms || []).join(", ")}
                      onChange={(e) => {
                        const terms = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                        updateField(2, "key_terms", terms);
                      }}
                       className="w-full p-3 rounded-[10px] border border-[var(--br)] bg-transparent focus:border-[var(--y)] focus:outline-none text-sm text-[var(--dark)]"
                      placeholder="Term 1, Term 2, ..."
                    />
                    {formData.step2_key_terms?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.step2_key_terms.map((t: string, i: number) => (
                           <span key={i} className="px-3 py-1 bg-[var(--y)] bg-opacity-10 text-[var(--yd)] font-bold text-xs rounded-full border border-[var(--y)]">
                             {t}
                           </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

             {activeStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-black text-[var(--dark)]">Step 3 — Thinking</h2>
                <div className="bg-[var(--wh)] border border-[var(--br)] p-6 rounded-[16px] shadow-sm space-y-4">
                  <label className="block text-sm font-bold text-[var(--dark)] mb-2">Open prompts</label>
                  
                  <div className="space-y-3">
                    {(formData.step3_thinking || []).map((prompt: { text?: string }, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 bg-[var(--bg2)] p-3 rounded-[10px] border border-[var(--br)]">
                        <MoveVertical className="w-5 h-5 text-[var(--mu2)] shrink-0 mt-2 cursor-grab" />
                        <div className="flex-1 space-y-2">
                          <textarea
                            value={prompt.text || ""}
                            onChange={(e) => {
                              const newList = [...(formData.step3_thinking || [])];
                              newList[idx].text = e.target.value;
                              updateField(3, "thinking", newList);
                            }}
                            className="w-full min-h-[60px] p-2 text-sm bg-[var(--wh)] border border-[var(--br)] rounded-[8px] focus:outline-none focus:border-[var(--y)]"
                            placeholder="Think about..."
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newList = [...(formData.step3_thinking || [])];
                            newList.splice(idx, 1);
                            updateField(3, "thinking", newList);
                          }}
                          className="p-2 text-[var(--mu)] hover:text-[var(--red)] transition-colors"
                        >
                           <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {(!formData.step3_thinking || formData.step3_thinking.length < 5) && (
                    <button 
                      onClick={() => {
                        const newList = [...(formData.step3_thinking || [])];
                        newList.push({ id: Date.now().toString(), text: "", type: "Open" });
                        updateField(3, "thinking", newList);
                      }}
                      className="w-full py-3 border-2 border-dashed border-[var(--mu2)] text-[var(--dark)] font-bold rounded-[10px] hover:border-[var(--dark)] transition-colors mt-2"
                    >
                      + Add Prompt
                    </button>
                  )}
                </div>
              </div>
            )}

             {activeStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-black text-[var(--dark)]">Step 4 — Deep Learning</h2>
                <div className="bg-[var(--wh)] border border-[var(--br)] p-6 rounded-[16px] shadow-sm space-y-4">
                   <div>
                    <label className="block text-sm font-bold text-[var(--dark)] mb-2">Main content</label>
                    <textarea
                      value={formData.step4_deep || ""}
                      onChange={(e) => updateField(4, "deep", e.target.value)}
                      className="w-full min-h-[160px] p-4 rounded-[12px] border border-[var(--br)] bg-transparent focus:border-[var(--y)] focus:outline-none text-sm text-[var(--dark)]"
                      placeholder="Deep dive into advanced topics..."
                    />
                  </div>

                  <div className="border-t border-[var(--br)] pt-4 mt-6">
                    <label className="block text-sm font-bold text-[var(--dark)] mb-4">Worked examples</label>
                    <div className="space-y-4">
                      {(formData.step4_examples || []).map((ex: { problem?: string; solution?: string }, idx: number) => (
                         <div key={idx} className="bg-[var(--c2)] p-4 rounded-[12px] border border-[var(--br)] relative">
                           <button 
                            onClick={() => {
                              const newList = [...(formData.step4_examples || [])];
                              newList.splice(idx, 1);
                              updateField(4, "examples", newList);
                            }}
                            className="absolute top-2 right-2 p-1 text-[var(--mu)] hover:text-[var(--red)]"
                          >
                             <X className="w-4 h-4" />
                          </button>
                           <div className="space-y-3">
                             <input 
                               value={ex.problem || ""} 
                               onChange={e => {
                                 const newList = [...(formData.step4_examples || [])];
                                 newList[idx].problem = e.target.value;
                                 updateField(4, "examples", newList);
                               }}
                               className="w-full px-3 py-2 text-sm font-bold border-b border-[var(--mu2)] bg-transparent focus:outline-none focus:border-[var(--dark)]" 
                               placeholder="Problem Title / Statement..." 
                             />
                             <textarea 
                               value={ex.solution || ""} 
                               onChange={e => {
                                 const newList = [...(formData.step4_examples || [])];
                                 newList[idx].solution = e.target.value;
                                 updateField(4, "examples", newList);
                               }}
                               className="w-full min-h-[80px] p-3 text-sm bg-[var(--wh)] border border-[var(--br)] rounded-[8px] focus:outline-none focus:border-[var(--y)]" 
                               placeholder="Solution walkthrough..." 
                             />
                           </div>
                         </div>
                      ))}
                    </div>
                     <button 
                      onClick={() => {
                        const newList = [...(formData.step4_examples || [])];
                        newList.push({ id: Date.now().toString(), problem: "", solution: "" });
                        updateField(4, "examples", newList);
                      }}
                      className="w-full py-3 border-2 border-dashed border-[var(--y)] text-[var(--yd)] font-bold rounded-[10px] hover:bg-yellow-50 transition-colors mt-4"
                    >
                      + Add Example
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-black text-[var(--dark)]">Step 5 — Project</h2>
                <div className="bg-[var(--wh)] border border-[var(--br)] p-6 rounded-[16px] shadow-sm space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--dark)] mb-2">Project objective</label>
                     <input
                      value={formData.step5_project || ""}
                      onChange={(e) => updateField(5, "project", e.target.value)}
                      className="w-full p-3 rounded-[10px] border border-[var(--br)] bg-transparent focus:border-[var(--y)] focus:outline-none text-sm text-[var(--dark)] font-bold"
                      placeholder="Build a..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--dark)] mb-2">Instructions</label>
                    <textarea
                      value={formData.step5_instructions || ""}
                      onChange={(e) => updateField(5, "instructions", e.target.value)}
                      className="w-full min-h-[160px] p-4 rounded-[12px] border border-[var(--br)] bg-transparent focus:border-[var(--y)] focus:outline-none text-sm text-[var(--dark)]"
                      placeholder="1. First step..."
                    />
                  </div>
                  
                  <div className="border border-[var(--br)] rounded-[12px] p-4 bg-[var(--bg2)] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[var(--dark)] text-sm mb-1">Standard 4-Skill Rubric</h4>
                      <p className="text-[11px] text-[var(--mu)]">Evaluation on Concept, Thinking, Appl., Comm.</p>
                    </div>
                    <div className="bg-[var(--green-bg)] text-[var(--green)] px-3 py-1 rounded-full text-[11px] font-bold border border-green-200">
                      Enabled ✓
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 6 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-black text-[var(--dark)]">Step 6 — Reflection</h2>
                <div className="bg-[var(--wh)] border border-[var(--br)] p-6 rounded-[16px] shadow-sm space-y-4">
                  <label className="block text-sm font-bold text-[var(--dark)] mb-2">Reflection prompts</label>
                  
                  <div className="space-y-3">
                    {(formData.step6_reflection || []).map((prompt: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-8 flex justify-center text-[var(--mu2)] font-black text-sm">{idx + 1}.</div>
                        <input
                           value={prompt}
                           onChange={(e) => {
                             const newList = [...(formData.step6_reflection || [])];
                             newList[idx] = e.target.value;
                             updateField(6, "reflection", newList);
                           }}
                           className="flex-1 p-3 rounded-[10px] border border-[var(--br)] bg-[var(--wh)] focus:border-[var(--y)] focus:outline-none text-sm text-[var(--dark)]"
                           placeholder="What was the hardest part?"
                        />
                        <button 
                          onClick={() => {
                            const newList = [...(formData.step6_reflection || [])];
                            newList.splice(idx, 1);
                            updateField(6, "reflection", newList);
                          }}
                          className="p-2 text-[var(--mu)] hover:text-[var(--red)] transition-colors"
                        >
                           <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {(!formData.step6_reflection || formData.step6_reflection.length < 5) && (
                    <button 
                      onClick={() => {
                        const newList = [...(formData.step6_reflection || [])];
                        newList.push("");
                        updateField(6, "reflection", newList);
                      }}
                      className="w-full py-3 border-2 border-dashed border-[var(--mu2)] text-[var(--dark)] font-bold rounded-[10px] hover:border-[var(--dark)] transition-colors mt-2"
                    >
                      + Add Reflection Prompt
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* BOTTOM ACTION BAR */}
          <div className="sticky bottom-0 border-t border-[var(--br)] bg-[var(--wh)] px-8 py-4 flex justify-between items-center shrink-0">
             {activeStep > 1 ? (
               <button onClick={() => setActiveStep(prev => prev - 1)} className="font-bold text-[var(--dark)] px-4 py-2 rounded-full hover:bg-[var(--bg2)] transition-colors text-sm border border-transparent">
                 ← Previous Step
               </button>
             ) : <div></div>}
             
             <div className="flex gap-4">
                <button onClick={() => saveMutation.mutate(formData)} className="font-bold text-white bg-[var(--dark)] px-6 py-2.5 rounded-full border border-[var(--dark)] hover:opacity-90 transition-opacity text-sm shadow-sm">
                 Save Step
               </button>
               {activeStep < 6 && (
                 <button onClick={() => setActiveStep(prev => prev + 1)} className="font-extrabold text-[var(--dark)] bg-[var(--y)] px-6 py-2.5 rounded-full border border-[var(--yd)] hover:brightness-105 transition-all text-sm shadow-sm flex items-center gap-1">
                   Next Step →
                 </button>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
