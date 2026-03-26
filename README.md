# mtopencode-plugin

OpenCode plugin for scheduling recurring jobs using `launchd` (macOS) or `systemd` (Linux). This plugin is part of the `gomtm` project.

## Features

- **Persistence**: Jobs survive system reboots.
- **Reliability**: Self-correcting for missed runs (lap-up) if the system was inactive.
- **Cross-platform**: Seamless support for both macOS and Linux.
- **Integration**: Designed to work perfectly with OpenCode's MCP configuration and agent environment.

## Installation

```bash
npm install mtopencode-plugin
```

## Configuration

Add `mtopencode-plugin` to your OpenCode configuration file (typically `~/.config/opencode/config.json`):

```json
{
  "plugins": ["mtopencode-plugin"]
}
```

## Usage

Once installed, the plugin adds several tools to your OpenCode agents:

- `job_schedule`: Create or update a recurring job using cron syntax.
- `job_list`: List all currently scheduled jobs.
- `job_delete`: Remove a scheduled job.
- `job_run`: Trigger a job execution manually.
- `job_logs`: View execution logs for a specific job.

## License

MIT
