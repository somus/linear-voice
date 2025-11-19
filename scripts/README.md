# Scripts

## generate-embeddings.ts

Pre-computes embeddings for all voice triggers to eliminate startup delay.

### Why Pre-compute?

Without pre-computing, the extension needs to:
1. Load embedding model (~23MB download)
2. Compute embeddings for ~400+ voice triggers
3. Takes 5-15 seconds on startup

With pre-computed embeddings:
1. Load embedding model (still needed for user queries)
2. Load embeddings from JSON (~2MB bundled file)
3. Takes <100ms on startup

**Performance gain: ~50-100x faster startup for embedding initialization**

### Usage

Run this whenever you modify `src/core/shortcuts.ts`:

```bash
bun run generate:embeddings
```

This will:
1. Load the embedding model (Xenova/all-MiniLM-L6-v2)
2. Compute embeddings for all voice triggers
3. Save to `src/data/trigger-embeddings.json`

### Output

The generated JSON file contains:
- `model`: Model used for embeddings
- `generatedAt`: Timestamp of generation
- `count`: Number of embeddings
- `embeddings`: Map of `shortcutId:trigger` → embedding vector

### Committing

**The generated file should be committed to the repository** so all users benefit from pre-computed embeddings without running the script.

File size: ~1-3MB (acceptable for git)

### Workflow

1. Edit shortcuts in `src/core/shortcuts.ts`
2. Run `bun run generate:embeddings`
3. Verify the output looks correct
4. Commit `src/data/trigger-embeddings.json` with your changes
5. Build extension normally with `bun run build`
