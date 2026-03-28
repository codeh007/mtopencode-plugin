# mtopencode-plugin

`mtopencode-plugin` is a standalone OpenCode plugin package extracted from the `gomtm` monorepo.

## Status

This package is currently a lightweight skeleton. The repository now focuses on:

- keeping the package independently versioned and published
- providing a minimal smoke-test tool for OpenCode plugin loading
- preserving the audit-related scaffolding for later work

At the moment, the only exposed tool is a debug tool used to verify that the plugin loads successfully.

## Installation

```bash
npm install mtopencode-plugin
```

## OpenCode configuration

Add the package name to your OpenCode config:

```json
{
  "plugin": ["mtopencode-plugin"]
}
```

## Available tool

- `debug_plugin_status_v3`: returns a simple success message so you can confirm the plugin is loaded.

## Development

```bash
bun install
bun run check
```

## Release flow

- CI runs on every push and pull request.
- npm publishing runs from GitHub Actions when a GitHub Release is published.
- The workflow expects a repository secret named `NPM_TOKEN`.

## Notes

- Audit-related library code is still present in `src/lib/`, but it should be treated as scaffold code for future work.
- No production secrets are stored in this repository.

## License

MIT
