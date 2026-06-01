import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingDeliverablePackageViewer } from "./MarketingDeliverablePackageViewer";

describe("PR62C frontend package viewer", () => {
  it("renders 30-second ad package sections", () => {
    const html = renderToStaticMarkup(
      <MarketingDeliverablePackageViewer
        deliverablePackage={{
          packageType: "video_ad_30s",
          strategy: "30-second strategy",
          hooks: ["hook1", "hook2", "hook3"],
          adCopy: ["copy"],
          script: "short script",
          scenePlan: [{ order: 1, durationSeconds: 10, narration: "scene", visualPrompt: "prompt" }],
          mediaRequirements: ["b-roll"],
          reviewItems: [{ id: 1 }],
          exportPack: { status: "ready" },
          scheduleDrafts: [{ id: 2 }],
          blockers: [],
          setupNeeded: false,
        }}
      />,
    );

    expect(html).toContain("Package summary");
    expect(html).toContain("Strategy");
    expect(html).toContain("Hooks");
    expect(html).toContain("Copy");
    expect(html).toContain("Script");
    expect(html).toContain("Scene Plan");
    expect(html).toContain("Export / Schedule");
  });

  it("renders 3-minute assembled video package timeline details", () => {
    const html = renderToStaticMarkup(
      <MarketingDeliverablePackageViewer
        deliverablePackage={{
          packageType: "assembled_video_3m",
          strategy: "3-minute strategy",
          hooks: ["hook"],
          adCopy: [],
          script: "long script",
          voiceoverPlan: { script: "voiceover" },
          scenePlan: [
            { sceneIndex: 1, durationSeconds: 20, narration: "scene1", mediaSlot: "stock_media" },
            { sceneIndex: 2, durationSeconds: 22, narration: "scene2", mediaSlot: "generated_image" },
          ],
          mediaRequirements: ["media"],
          reviewItems: [],
          exportPack: { renderStatus: "not_rendered" },
          scheduleDrafts: [],
          blockers: ["render tool setup"],
          setupNeeded: true,
        }}
      />,
    );

    expect(html).toContain("Assembled video timeline");
    expect(html).toContain("Duration planned");
    expect(html).toContain("Voiceover plan");
    expect(html).toContain("Media slots");
    expect(html).toContain("Render/export status");
  });

  it("shows no fake video message when render output is missing", () => {
    const html = renderToStaticMarkup(
      <MarketingDeliverablePackageViewer
        deliverablePackage={{
          packageType: "assembled_video_3m",
          strategy: "strategy",
          hooks: [],
          adCopy: [],
          script: "script",
          scenePlan: [],
          mediaRequirements: [],
          reviewItems: [],
          exportPack: { renderStatus: "not_rendered" },
          scheduleDrafts: [],
          blockers: ["render setup"],
          setupNeeded: true,
        }}
      />,
    );

    expect(html).toContain("No fake video is shown because render output is missing");
  });
});
