import "dotenv/config";
import {
  ACADEMY_CURRICULUM_VERSION,
  inspectAcademyCurriculumReadiness,
  syncAcademyCurriculum,
  type AcademyCurriculumSyncMode,
} from "../server/academy/curriculumPipeline";

const argumentsSet = new Set(process.argv.slice(2));
const apply = argumentsSet.has("--apply");
const updateSourceManaged = argumentsSet.has("--update-source-managed");
const confirmation = process.argv
  .slice(2)
  .find((value) => value.startsWith("--confirm-version="))
  ?.split("=")[1];

const readiness = await inspectAcademyCurriculumReadiness();
console.log(
  JSON.stringify({ action: apply ? "apply" : "inspect", readiness }, null, 2),
);

if (!apply) {
  console.log(
    `Inspection only. To publish version ${ACADEMY_CURRICULUM_VERSION}, rerun with --apply --confirm-version=${ACADEMY_CURRICULUM_VERSION}.`,
  );
  process.exit(0);
}

if (confirmation !== ACADEMY_CURRICULUM_VERSION) {
  throw new Error(
    `Refusing Academy curriculum write: --confirm-version=${ACADEMY_CURRICULUM_VERSION} is required.`,
  );
}

if (readiness.ready) {
  console.log("Academy curriculum is already ready; no write was performed.");
  process.exit(0);
}

const mode: AcademyCurriculumSyncMode = updateSourceManaged
  ? "update-source-managed"
  : "insert-only";
const result = await syncAcademyCurriculum(mode);
const verified = await inspectAcademyCurriculumReadiness();
if (!verified.ready) {
  throw new Error(
    "Academy curriculum write completed but readiness verification failed.",
  );
}
console.log(JSON.stringify({ applied: true, mode, result, verified }, null, 2));
