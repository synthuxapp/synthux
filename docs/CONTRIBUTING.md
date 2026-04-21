# Contributing to synthux

Thank you for your interest in contributing to synthux! 🎉

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Ollama](https://ollama.com) installed and running
- Chrome browser (for testing)

### Setup

```bash
# Clone the repo
git clone https://github.com/synthuxapp/synthux.git
cd synthux

# Install dependencies
npm install

# Build the Side Panel bundle
npm run build

# Or watch mode for development
npm run dev
```

### Loading in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder
5. The synthux icon should appear in your toolbar

## Development Workflow

### Project Structure

- `src/sidepanel/` — Lit Web Components (bundled by esbuild)
- `extension/core/` — Business logic (AI client, analyzer, heuristics, etc.)
- `extension/background/` — Service Worker
- `extension/content/` — Content Script (DOM extraction)
- `extension/rules/` — Heuristic rule definitions

### Build Commands

| Command | Description |
|:---|:---|
| `npm run build` | Build Side Panel bundle (production) |
| `npm run dev` | Watch mode (auto-rebuild) |
| `npm run lint` | Run ESLint |
| `npm run lint:ext` | Validate extension with web-ext |
| `npm run format` | Format code with Prettier |

### Making Changes

1. **UI changes**: Edit files in `src/sidepanel/`, run `npm run dev`
2. **Core logic**: Edit files in `extension/core/`, reload extension in Chrome
3. **Content Script**: Edit `extension/content/content-script.js`, reload extension
4. **Service Worker**: Edit `extension/background/service-worker.js`, reload extension

After any change, click the reload icon (🔄) on `chrome://extensions` to reload the extension.

## Adding a New Heuristic Rule Set

You can add custom rule sets by creating a new JSON file in `extension/rules/`.

### Format

```json
{
  "name": "Your Rule Set Name",
  "version": "1.0.0",
  "source": "https://source-url.com",
  "rules": [
    {
      "id": "rule-id",
      "name": { "en": "English Name", "tr": "Türkçe Ad" },
      "description": { "en": "...", "tr": "..." },
      "weight": 1.0,
      "evaluation_guide": "What to look for when evaluating...",
      "scoring_rubric": {
        "0-20": "Critical violations",
        "21-40": "Major issues",
        "41-60": "Moderate issues",
        "61-80": "Good",
        "81-100": "Excellent"
      }
    }
  ]
}
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run linting: `npm run lint && npm run lint:ext`
5. Test manually in Chrome
6. Commit with a descriptive message
7. Push to your fork and create a Pull Request

### Commit Message Format

```
type: short description

Longer description if needed.
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Code Style

- Use ES Modules (`import`/`export`)
- Follow existing patterns in the codebase
- Use JSDoc comments for public APIs
- Keep components focused and reusable

## Reporting Issues

Use [GitHub Issues](https://github.com/synthuxapp/synthux/issues) with the provided templates.

Include:
- Chrome version
- Ollama version and model
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](../LICENSE).
