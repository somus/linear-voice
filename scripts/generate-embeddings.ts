/**
 * Pre-compute embeddings for all voice triggers
 * Run this script whenever shortcuts.ts changes
 *
 * Usage: bun run scripts/generate-embeddings.ts
 */

import { writeFileSync } from "node:fs";
import { pipeline } from "@huggingface/transformers";
import { getAllShortcuts } from "../src/core/shortcuts";

const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
const OUTPUT_PATH = "src/data/trigger-embeddings.json";

async function generateEmbeddings() {
  console.log("Loading embedding model...");
  const embeddingPipeline = await pipeline(
    "feature-extraction",
    EMBEDDING_MODEL,
    {
      dtype: "q8",
    }
  );

  console.log("Model loaded. Computing embeddings...");
  const shortcuts = getAllShortcuts();
  const embeddings: Record<
    string,
    {
      shortcutId: string;
      trigger: string;
      embedding: number[];
    }
  > = {};

  let count = 0;
  for (const shortcut of shortcuts) {
    for (const trigger of shortcut.voiceTriggers) {
      const result = await embeddingPipeline(trigger, {
        pooling: "mean",
        normalize: true,
      });

      const embedding = Array.from(
        (result as { data: ArrayLike<number> }).data
      );
      const key = `${shortcut.id}:${trigger}`;

      embeddings[key] = {
        shortcutId: shortcut.id,
        trigger,
        embedding,
      };

      count += 1;
      if (count % 10 === 0) {
        console.log(`Processed ${count} triggers...`);
      }
    }
  }

  console.log(`\nGenerated ${count} embeddings`);
  console.log(`Saving to ${OUTPUT_PATH}...`);

  const output = {
    model: EMBEDDING_MODEL,
    generatedAt: new Date().toISOString(),
    count,
    embeddings,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  const sizeKB = (JSON.stringify(output).length / 1024).toFixed(2);
  console.log(`✅ Done! File size: ${sizeKB} KB`);
}

generateEmbeddings().catch(console.error);
