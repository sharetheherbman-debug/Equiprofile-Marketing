import { Button } from "@/components/ui/button";

const EXAMPLES = [
  "Create a 7-day Facebook signup campaign for EquiProfile",
  "Get me 50 signups from stable owners this month",
  "Create a Facebook relaunch campaign for inactive trials",
];

const CHANNELS = ["Facebook", "Instagram", "LinkedIn", "TikTok", "YouTube Shorts", "Email"];

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
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm" data-testid="campaign-prompt-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Campaign Brief</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">What are we marketing today?</h1>
      <p className="mt-2 text-sm text-stone-600">Describe the outcome. The workspace will plan the right campaign package before it generates assets.</p>
      <textarea
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        className="mt-5 min-h-36 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-base leading-7 text-stone-900 outline-none focus:border-emerald-500 focus:bg-white"
        placeholder="Create a 7-day Facebook signup campaign for EquiProfile"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button key={example} type="button" className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-left text-xs text-stone-700 hover:border-emerald-400 hover:text-emerald-800" onClick={() => onPromptChange(example)}>
            {example}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Channels</p>
        <div className="mt-2 flex flex-wrap gap-2">
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
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={onPlan}>Plan campaign</Button>
        <Button type="button" data-testid="generate-button" disabled={generateDisabled} onClick={onGenerate}>
          {isGenerating ? "Generating draft..." : "Generate campaign"}
        </Button>
      </div>
    </section>
  );
}
