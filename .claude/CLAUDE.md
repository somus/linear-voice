# LinearVoice - Privacy-First Voice Commands for Linear.app

## Project Overview

LinearVoice is a Chrome extension that enables voice-controlled navigation for Linear.app. It uses on-device AI models (Moonshine ASR + MiniLM embeddings) running via WebGPU for privacy-first, offline voice command processing.

**Key Features:**
- Privacy-first: All AI processing happens locally in the browser
- WebGPU-accelerated models for fast inference
- 100+ Linear keyboard shortcuts accessible via voice
- Chrome 124+ required (for WebGPU support)

## Architecture

### Extension Structure (WXT Framework)

```
src/
├── entrypoints/
│   ├── background.ts        # Service worker - message coordinator
│   ├── offscreen/main.ts    # AI model processing (WebGPU)
│   ├── content/            # Content script - Linear.app integration
│   └── popup/              # Extension popup UI
├── core/
│   ├── shortcuts.ts        # 100+ Linear shortcuts + execution
│   └── audio.ts            # Audio recording utilities
├── config.ts               # Central configuration
└── utils/
    └── offscreen-logger.ts # Forward offscreen logs to background
```

### Message Flow

1. **Content Script** → Records audio when user holds activation key (default: 'R')
2. **Background** → Routes transcription requests to offscreen document
3. **Offscreen Document** → Runs AI models (ASR + embeddings), matches intent
4. **Content Script** → Executes matched keyboard shortcut on Linear.app

### AI Pipeline

1. **ASR (Automatic Speech Recognition)**: Moonshine-base model converts speech to text
2. **Embedding Matching**: MiniLM-L6-v2 finds semantic match to predefined voice triggers
3. **Shortcut Execution**: Dispatches keyboard events to Linear.app

## Technology Stack

- **Framework**: WXT (Web Extension framework)
- **Runtime**: Bun (build tool)
- **AI**: @huggingface/transformers (transformers.js)
- **UI**: React 19 + Tailwind CSS 4
- **Type Safety**: TypeScript with strict mode
- **Code Quality**: Ultracite (Biome preset)

## Critical Implementation Details

### WebGPU Requirements

- Extension requires WebGPU (Chrome 124+)
- Offscreen document needed because service workers don't support dynamic imports or WebGPU
- CSP allows `wasm-unsafe-eval` for ONNX Runtime

### Model Configuration

**ASR Model (Moonshine-base)**:
```typescript
{
  dtype: {
    encoder_model: "fp32",
    decoder_model_merged: "q4"  // 4-bit quantization
  },
  device: "webgpu"
}
```

**Embedding Model (MiniLM-L6-v2)**:
```typescript
{
  dtype: "fp32",
  device: "webgpu"
}
```

### Pre-computed Embeddings

For performance, voice trigger embeddings are pre-computed at build time:
- Run `bun run generate:embeddings` to generate `src/data/trigger-embeddings.json`
- Loaded at startup to avoid computing 400+ embeddings on-demand
- Falls back to runtime computation if file missing

### Shortcuts System

100+ shortcuts defined in `src/core/shortcuts.ts`:
- **Sequential keys**: e.g., "g" then "i" (Go to Inbox)
- **Modifier keys**: e.g., "cmd+k" (Search)
- Each shortcut has multiple voice triggers for flexibility
- Execution dispatches real KeyboardEvent to Linear.app DOM

## Development Workflow

### Commands

```bash
# Development
bun run dev              # Start dev server (Chrome)
bun run dev:firefox      # Start dev server (Firefox)

# Build
bun run build            # Production build
bun run build:analyze    # Build with bundle analyzer

# Type checking
bun run type-check       # TypeScript check
bun run compile          # Alias for type-check

# Code quality
bun run check            # Ultracite lint check
bun run fix              # Ultracite auto-fix

# Embeddings
bun run generate:embeddings  # Pre-compute voice trigger embeddings
```

### Making Changes

1. **Adding New Shortcuts**: Edit `src/core/shortcuts.ts`
   - Add shortcut definition with voice triggers
   - Run `bun run generate:embeddings` to update embeddings
   - Test voice commands in extension

2. **Modifying AI Pipeline**: Edit `src/entrypoints/offscreen/main.ts`
   - All model loading/inference happens here
   - Remember: offscreen logs forwarded to background for debugging

3. **UI Changes**: Edit `src/entrypoints/popup/`
   - React 19 components (use ref as prop, not forwardRef)
   - Tailwind CSS 4 styling
   - Use custom hooks: `use-settings.ts`, `use-web-gpu.ts`, `use-model-progress.ts`

4. **Content Script**: Edit `src/entrypoints/content/`
   - Handles key press detection
   - Audio recording
   - Shortcut execution on Linear.app

## Configuration

Central config in `src/config.ts`:

```typescript
DEFAULTS = {
  activationKey: "r",
  asrModel: "onnx-community/moonshine-base-ONNX",
  embeddingModel: "Xenova/all-MiniLM-L6-v2",
  confidenceThreshold: 0.7
}

THRESHOLDS = {
  MIN_EMBEDDING_SIMILARITY: 0.65  // Adjust for stricter/looser matching
}

AUDIO = {
  SAMPLE_RATE: 16_000,
  CONSTRAINTS: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
}
```

## Important Files

- `wxt.config.ts`: Extension manifest and build config
- `src/config.ts`: Single source of truth for configuration
- `src/core/shortcuts.ts`: All Linear shortcuts + voice triggers
- `src/entrypoints/offscreen/main.ts`: AI model processing pipeline
- `src/entrypoints/background.ts`: Message routing coordinator
- `src/data/trigger-embeddings.json`: Pre-computed embeddings (generated)

## Testing

Manual testing on linear.app:
1. Install extension in Chrome (chrome://extensions → Load unpacked)
2. Navigate to https://linear.app
3. Hold 'R' key and speak a command (e.g., "go to inbox")
4. Verify shortcut executes correctly

## Common Issues

### WebGPU Not Available
- Check Chrome version (124+)
- Verify GPU drivers updated
- Check `chrome://gpu` for WebGPU status

### Model Loading Fails
- Check network connection (models downloaded from HuggingFace)
- Verify WASM files in extension bundle
- Check console for CSP errors

### Voice Commands Not Working
- Verify microphone permissions granted
- Check audio recording in popup
- Review offscreen logs (forwarded to background console)

### Embedding Mismatches
- Regenerate embeddings: `bun run generate:embeddings`
- Check similarity threshold in `config.ts` (default: 0.65)
- Review voice triggers in shortcuts.ts

## Performance Notes

- **Cold start**: ~10-15s (download + compile models)
- **Warm start**: ~1-2s (models cached)
- **Inference**: 100-300ms per transcription
- **Embedding matching**: <10ms (pre-computed)

WebGPU shader compilation happens once per model load (warmup inference).

## Best Practices

1. **Never bypass WebGPU check**: Models require GPU acceleration
2. **Always regenerate embeddings**: After modifying voice triggers
3. **Use devLog for logging**: Respects development mode flag
4. **Handle async properly**: Models are async, don't forget await
5. **Test on Linear.app**: Different keyboard shortcuts work in different contexts
6. **Follow Ultracite rules**: Run `bun run fix` before committing

## Security

- No external API calls (100% offline)
- No telemetry or tracking
- Models cached locally via Chrome storage
- Only accesses linear.app (host permissions)

---

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `npx ultracite fix`
- **Check for issues**: `npx ultracite check`
- **Diagnose setup**: `npx ultracite doctor`

Biome (the underlying engine) provides extremely fast Rust-based linting and formatting. Most issues are automatically fixable.

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

Most formatting and common issues are automatically fixed by Biome. Run `npx ultracite fix` before committing to ensure compliance.

---

## Resources

- [WXT Documentation](https://wxt.dev)
- [Transformers.js Docs](https://huggingface.co/docs/transformers.js)
- [WebGPU Status](https://webgpu.io)
- [Linear Keyboard Shortcuts](https://linear.app/docs/keyboard-shortcuts)
