# LinearVoice

**Privacy-first voice commands for Linear.app**

LinearVoice is a Chrome extension that brings hands-free navigation to Linear using on-device AI. Speak naturally to execute any Linear keyboard shortcut—all processing happens locally in your browser with zero telemetry.

## Features

- **100% Private**: All AI processing runs locally using WebGPU acceleration
- **100+ Commands**: Full coverage of Linear keyboard shortcuts via voice
- **Natural Language**: Speak naturally—"go to inbox", "create new issue", "assign to me"
- **Offline Ready**: No external API calls, works entirely offline after initial model download
- **Fast**: <300ms transcription with WebGPU hardware acceleration

## Quick Start

### Prerequisites

- Chrome 124+ (required for WebGPU support)
- Modern GPU with WebGPU support (check `chrome://gpu`)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd linear-voice
```

2. Install dependencies:
```bash
bun install
```

3. Build the extension:
```bash
bun run build
```

4. Load in Chrome:
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` folder

### Usage

1. Navigate to https://linear.app
2. Hold the **R** key (default activation key)
3. Speak a command (e.g., "go to inbox", "create issue", "show roadmap")
4. Release the key

The extension will transcribe your voice, match it to a shortcut, and execute it instantly.

## Example Commands

| Say... | Action |
|--------|--------|
| "go to inbox" | Navigate to inbox (g → i) |
| "create issue" | Open new issue modal (c) |
| "assign to me" | Assign issue to yourself (i) |
| "high priority" | Set priority to high (2) |
| "add comment" | Start writing a comment (cmd+enter) |
| "search" | Open command palette (cmd+k) |

See [CLAUDE.md](.claude/CLAUDE.md) for the full list of 100+ supported commands.

## Technology

- **ASR Model**: Moonshine-base (on-device speech recognition)
- **Embedding Model**: MiniLM-L6-v2 (semantic matching)
- **Inference**: WebGPU with ONNX Runtime
- **Framework**: WXT (Web Extension toolkit)
- **UI**: React 19 + Tailwind CSS 4
- **Runtime**: Bun

## Development

```bash
# Start development server
bun run dev

# Run type checking
bun run type-check

# Lint and format
bun run fix

# Build for production
bun run build

# Generate pre-computed embeddings (after modifying shortcuts)
bun run generate:embeddings
```

See [CLAUDE.md](.claude/CLAUDE.md) for detailed development documentation.

## Architecture

```
Content Script (linear.app) ──> Background Service Worker ──> Offscreen Document
                                                                 │
     ↑                                                           ↓
     │                                                    AI Models (WebGPU)
     │                                                    ├─ Moonshine ASR
     └──────────────── Keyboard Event ─────────────      └─ MiniLM Embeddings
```

1. Content script records audio when activation key is held
2. Background worker routes to offscreen document
3. Offscreen runs AI models to transcribe and match intent
4. Content script executes matched keyboard shortcut

## Performance

- **First load**: ~10-15s (model download + WebGPU compilation)
- **Subsequent loads**: ~1-2s (cached models)
- **Per command**: ~100-300ms (transcription + matching)

Models are cached locally and compiled once per session.

## Troubleshooting

### WebGPU Not Available
- Update to Chrome 124+
- Check GPU drivers are up to date
- Visit `chrome://gpu` to verify WebGPU status

### Models Won't Load
- Check internet connection (first download only)
- Verify CSP settings in `wxt.config.ts`
- Check console for errors

### Commands Not Working
- Ensure microphone permissions are granted
- Verify you're on linear.app
- Check activation key in extension popup
- Test with simple commands first ("inbox", "create issue")

## Configuration

Customize in extension popup or edit `src/config.ts`:

- **Activation Key**: Change from 'R' to any key
- **Confidence Threshold**: Adjust transcription sensitivity (default: 0.7)
- **Similarity Threshold**: Tune intent matching (default: 0.65)

## Privacy & Security

- **Zero telemetry**: No analytics, tracking, or external requests
- **Local-only**: All AI processing in browser via WebGPU
- **Minimal permissions**: Only accesses linear.app
- **Open source**: Audit the code yourself

## License

MIT

## Contributing

Contributions welcome! Please read [CLAUDE.md](.claude/CLAUDE.md) for development guidelines and architecture details.
