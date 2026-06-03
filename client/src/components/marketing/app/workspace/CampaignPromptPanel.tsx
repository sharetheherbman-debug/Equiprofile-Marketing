import { Button } from "@/components/ui/button";

const EXAMPLES = [
  "What are we marketing today?",
  "Create me a 30 second Facebook reel for EquiProfile",
  "Create a 7-day signup campaign for EquiProfile",
  "Create an email campaign for EquiProfile",
];

const CHANNELS = ["Facebook", "Instagram", "LinkedIn", "TikTok", "YouTube Shorts", "Email"];
const QUICK_ACTIONS = [
  "Image Ad",
  "Facebook Reel",
  "7-Day Signup Campaign",
  "Email Campaign",
  "Social Post",
] as const;

export function CampaignPromptPanel({
  prompt,
  channels,
  isGenerating,
  generateDisabled,
  onPromptChange,
  onToggleChannel,
  onPlan,
  onGenerate,
}: {
  prompt: string;
  channels: string[];
  isGenerating: boolean;
  generateDisabled: boolean;
  onPromptChange: (prompt: string) => void;
  onToggleChannel: (channel: string) => void;
  onPlan: () => void;
  onGenerate: () => void;
}) {
  function useQuickAction(label: (typeof QUICK_ACTIONS)[number]) {
    if (label === "Image Ad") onPromptChange("Create an image ad for EquiProfile");
    if (label === "Facebook Reel") onPromptChange("Create me a 30 second Facebook Reel for EquiProfile");
    if (label === "7-Day Signup Campaign") onPromptChange("Create a 7-day signup campaign for EquiProfile");
    if (label === "Email Campaign") onPromptChange("Create an email campaign for EquiProfile");
    if (label === "Social Post") onPromptChange("Create a social post for EquiProfile");
  }

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm" data-testid="campaign-prompt-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">AI Create</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">What are we marketing today?</h1>
      <p className="mt-2 text-sm text-stone-600">Describe the outcome. The app will guide you from draft to review, schedule, export, and post readiness.</p>
      <textarea
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        className="mt-5 min-h-36 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-base leading-7 text-stone-900 outline-none focus:border-emerald-500 focus:bg-white"
        placeholder="Create me a 30 second Facebook reel for EquiProfile"
      />
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Quick actions</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <Button key={action} type="button" variant="outline" size="sm" onClick={() => useQuickAction(action)}>{action}</Button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button key={example} type="button" className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-left text-xs text-stone-700 hover:border-emerald-400 hover:text-emerald-800" onClick={() => onPromptChange(example)}>
            {example}
          </button>
        ))}
      </div>
      <details className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-3">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-stone-600">More options</summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {CHANNELS.map((channel) => {
              const selected = channels.includes(channel);
              return (
                <button
                  key={channel}
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-xs ${selected ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-stone-200 bg-white text-stone-600"}`}
                  onClick={() => onToggleChannel(channel)}
                >
                  {channel}
                </button>
              );
            })}
        </div>
      </details>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={onPlan}>Plan output</Button>
        <Button type="button" data-testid="generate-button" disabled={generateDisabled} onClick={onGenerate}>
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>
    </section>
  );
}
