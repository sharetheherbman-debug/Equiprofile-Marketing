import { LESSON_PATHWAYS, LESSON_UNITS } from "../server/lessonContent";

const STOP = new Set("a an and are as at be been by for from has have how in into is it its of on or that the their this to with you your".split(" "));
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const words = (value: string) => normalize(value).split(" ").filter((word) => word.length > 2 && !STOP.has(word));
const shingles = (value: string, size = 5) => {
  const tokens = words(value);
  return new Set(tokens.slice(0, Math.max(0, tokens.length - size + 1)).map((_word, index) => tokens.slice(index, index + size).join(" ")));
};
const similarity = (left: Set<string>, right: Set<string>) => {
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  for (const value of left) if (right.has(value)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
};

const titleGroups = new Map<string, string[]>();
const objectiveGroups = new Map<string, string[]>();
for (const lesson of LESSON_UNITS) {
  const title = normalize(lesson.title);
  titleGroups.set(title, [...(titleGroups.get(title) ?? []), lesson.slug]);
  for (const objective of lesson.objectives) {
    const key = normalize(objective);
    objectiveGroups.set(key, [...(objectiveGroups.get(key) ?? []), lesson.slug]);
  }
}

const lessonShingles = new Map(LESSON_UNITS.map((lesson) => [lesson.slug, shingles(lesson.content)]));
const similarPairs: Array<{ left: string; right: string; similarity: number; levels: string }> = [];
const foundationAdvancedPairs: typeof similarPairs = [];
for (let leftIndex = 0; leftIndex < LESSON_UNITS.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < LESSON_UNITS.length; rightIndex += 1) {
    const left = LESSON_UNITS[leftIndex];
    const right = LESSON_UNITS[rightIndex];
    const score = similarity(lessonShingles.get(left.slug)!, lessonShingles.get(right.slug)!);
    const row = { left:left.slug,right:right.slug,similarity:Number(score.toFixed(4)),levels:`${left.level}/${right.level}` };
    if (score >= 0.35) similarPairs.push(row);
    if (left.pathwaySlug === right.pathwaySlug && new Set([left.level, right.level]).has("beginner") && new Set([left.level, right.level]).has("advanced")) {
      foundationAdvancedPairs.push(row);
    }
  }
}

const byPathway = Object.fromEntries(LESSON_PATHWAYS.map((pathway) => {
  const lessons = LESSON_UNITS.filter((lesson) => lesson.pathwaySlug === pathway.slug).sort((a,b)=>a.sortOrder-b.sortOrder);
  return [pathway.slug, {
    lessons: lessons.length,
    levels: Object.fromEntries(["beginner","developing","intermediate","advanced"].map((level)=>[level,lessons.filter((lesson)=>lesson.level===level).length])),
    explicitPracticalWork: lessons.filter((lesson)=>normalize(lesson.practicalApplication).length >= 20).length,
    assessedLessons: lessons.filter((lesson)=>lesson.knowledgeCheck.length >= 3).length,
    sequentialPrerequisites: Math.max(0, lessons.length - 1),
  }];
}));

const report = {
  generatedAt: new Date().toISOString(),
  method: "Normalised exact-title/objective checks plus pairwise five-word-shingle Jaccard similarity across the complete learner body. Near-duplicate review threshold: 0.35.",
  scope: { pathways:LESSON_PATHWAYS.length,lessons:LESSON_UNITS.length,comparisons:(LESSON_UNITS.length*(LESSON_UNITS.length-1))/2 },
  exactDuplicateTitles: [...titleGroups.entries()].filter(([,slugs])=>slugs.length>1).map(([title,slugs])=>({title,slugs})),
  exactRepeatedObjectives: [...objectiveGroups.entries()].filter(([,slugs])=>new Set(slugs).size>1).map(([objective,slugs])=>({objective,slugs:[...new Set(slugs)]})),
  nearDuplicateBodies: similarPairs.sort((a,b)=>b.similarity-a.similarity),
  highestBeginnerAdvancedSimilarity: foundationAdvancedPairs.sort((a,b)=>b.similarity-a.similarity).slice(0,10),
  pathways: byPathway,
  gaps: {
    tinyPathways: Object.entries(byPathway).filter(([,value])=>value.lessons<4).map(([slug])=>slug),
    lessonsMissingPracticalWork: LESSON_UNITS.filter((lesson)=>normalize(lesson.practicalApplication).length<20).map((lesson)=>lesson.slug),
    lessonsBelowThreeChecks: LESSON_UNITS.filter((lesson)=>lesson.knowledgeCheck.length<3).map((lesson)=>lesson.slug),
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (report.exactDuplicateTitles.length || report.nearDuplicateBodies.length || report.gaps.tinyPathways.length || report.gaps.lessonsMissingPracticalWork.length || report.gaps.lessonsBelowThreeChecks.length) process.exitCode = 1;
