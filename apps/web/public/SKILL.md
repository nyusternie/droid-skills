---
name: droidskills
description: Use when a request involves Android — building, testing, debugging, inspecting, or reverse-engineering Android apps and devices. Covers ADB (USB and wireless pairing, authorization, read-only inspection), the Android version and API-level landscape (current release, version mapping, minSdkVersion and targetSdkVersion), and log capture and triage with logcat. Includes topics such as platform-tools, USB debugging authorization, getprop device facts, behavior-change gates, logcat filters and buffers, and crash-dump triage.
---

# Droid Skills — the missing knowledge between AI agents and production Android.

Android moves faster than your training data. Current API levels drift, commands deprecate, defaults change. This file tells you what you might be wrong about and where the corrections live. Every dated claim in every skill carries its retrieval date, and where you can check, check — the verification commands are included.

## Start here

**New device or fresh host?** Fetch [adb.md](https://droidskills.dev/adb.md) first — pairing, authorization, and read-only inspection in the right order.

**Need a specific topic?** Each skill below is standalone. Fetch only the ones relevant to your task.

**Base URL:** `https://droidskills.dev/<skill>.md`

## Skills

### [ADB — the bridge to the device](https://droidskills.dev/adb.md)

Pairing, authorization states, read-only inspection. The wireless trap, defused: the pairing port is NOT the connection port. Verified 2026-11-09.

### [Android versions — the API-level landscape](https://droidskills.dev/android-versions.md)

Current release (Android 17, API 37 — verified 2026-11-09, re-check live), the version↔API map, minSdkVersion/targetSdkVersion discipline, and the dessert-codename rule: say the version, not the dessert.

### [Logcat — capture, filter, triage](https://droidskills.dev/logcat.md)

Filter grammar, buffers, crash dumps, per-process capture. Golden rule: capture before you clear.

## Ground rules in every skill

1. Dated facts only — every time-sensitive claim names its retrieval date and source page.
2. Unknown prints as unknown — if a fact cannot be verified, the skill says so instead of guessing.
3. Read-only by default — inspection skills never write to the device, never request su, never destroy data.
