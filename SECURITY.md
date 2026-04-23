# Security Policy

## Supported Versions

| Version | Supported          |
| :------ | :----------------- |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

We take the security of synthux seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT open a public issue.** Security vulnerabilities should be reported privately.
2. Use [GitHub Security Advisories](https://github.com/synthuxapp/synthux/security/advisories/new) to report the vulnerability.
3. Alternatively, contact the maintainer directly via the email associated with the [synthuxapp](https://github.com/synthuxapp) organization.

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 1 week
- **Fix release:** As soon as possible, typically within 2 weeks for critical issues

### Scope

The following are in scope for security reports:

- **Extension code** (`extension/`, `src/`) — XSS, data leaks, permission escalation
- **Dependencies** — Vulnerable npm packages
- **Data handling** — Unintended data transmission, storage issues
- **Manifest permissions** — Over-privileged permissions

The following are **out of scope**:

- Ollama server security (report to [Ollama](https://github.com/ollama/ollama))
- Chrome browser vulnerabilities (report to [Chromium](https://bugs.chromium.org/))

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations and data destruction
- Only interact with accounts you own or with explicit permission
- Do not exploit vulnerabilities beyond what is necessary to confirm them
- Report vulnerabilities promptly

We will not take legal action against researchers who follow these guidelines.

## Security Practices

synthux implements the following security measures:

- **Content Security Policy:** `script-src 'self'; object-src 'self'` — no inline scripts, no remote code execution
- **Local-only processing:** All AI analysis runs on the user's machine via Ollama. No data is sent to external servers
- **Minimal permissions:** Extension requests only the permissions necessary for page analysis
- **Dependency monitoring:** Automated security scanning via Dependabot, CodeQL, and npm audit
- **No telemetry:** synthux does not collect usage data, analytics, or telemetry
