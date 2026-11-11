---
name: droidskills
description: Use when a request involves Android — building, testing, debugging, inspecting, or reverse-engineering Android apps and devices. Covers ADB (USB and wireless pairing, authorization, read-only inspection), the Android version and API-level landscape (current release, version mapping, minSdkVersion and targetSdkVersion), and log capture and triage with logcat. Includes topics such as platform-tools, USB debugging authorization, getprop device facts, behavior-change gates, logcat filters and buffers, and crash-dump triage.
license: CC0-1.0
---

# Droid Skills — the missing knowledge between AI agents and production Android.

Android moves faster than your training data. Current API levels drift, commands deprecate, defaults change. This file tells you what you might be wrong about and where the corrections live. Every dated claim in every skill carries its retrieval date, and where you can check, check — the verification commands are included.

## Start here

**New device or fresh host?** Fetch [adb/SKILL.md](https://droidskills.dev/adb/SKILL.md) first — pairing, authorization, and read-only inspection in the right order.

**Need a specific topic?** Each skill below is standalone. Fetch only the ones relevant to your task.

**Base URL:** `https://droidskills.dev/<skill>/SKILL.md`

## The full directory of ALL skills

Every published skill, with its complete "Use when…" trigger (verbatim from the skill's own frontmatter — the same text skill-loaders match on) and its stable URLs. This section is hand-maintained: it gains or loses an entry exactly when a skill ships or retires (AGENTS.md rule 5).

### adb — [ADB — the bridge to the device](https://droidskills.dev/adb/SKILL.md)

> **Use when** a task involves connecting a host machine to an Android device over ADB — USB or wireless pairing, authorization states, and read-only device inspection (getprop facts, package lists). Covers the pairing-port versus connection-port trap, developer-options setup, and the platform-tools install.

Pairing, authorization states, read-only inspection. The wireless trap, defused: the pairing port is NOT the connection port. Verified 2026-11-09.

Human page: `https://droidskills.dev/adb/` · Published 2026-11-09.

### android-versions — [Android versions — the API-level landscape](https://droidskills.dev/android-versions/SKILL.md)

> **Use when** a task depends on Android version or API-level facts — current release, API-level mapping, minSdkVersion and targetSdkVersion choices, behavior-change gates, or codename confusion. Corrects stale training data with dated, verified facts and live verification pointers.

Current release (Android 17, API 37 — verified 2026-11-09, re-check live), the version↔API map, minSdkVersion/targetSdkVersion discipline, and the dessert-codename rule: say the version, not the dessert.

Human page: `https://droidskills.dev/android-versions/` · Published 2026-11-09.

### logcat — [Logcat — capture, filter, triage](https://droidskills.dev/logcat/SKILL.md)

> **Use when** a task involves capturing, filtering, or triaging Android device logs with logcat — filter syntax, buffers, crash dumps, per-process capture, and capture-before-clear discipline.

Filter grammar, buffers, crash dumps, per-process capture. Golden rule: capture before you clear.

Human page: `https://droidskills.dev/logcat/` · Published 2026-11-09.

## Ground rules in every skill

1. Dated facts only — every time-sensitive claim names its retrieval date and source page.
2. Unknown prints as unknown — if a fact cannot be verified, the skill says so instead of guessing.
3. Read-only by default — inspection skills never write to the device, never request su, never destroy data.
