---
name: logcat
description: Use when a task involves capturing, filtering, or triaging Android device logs with logcat — filter syntax, buffers, crash dumps, per-process capture, and capture-before-clear discipline.
summary: Capture, filter, and triage Android device logs with logcat — the non-destructive way.
title: Logcat — capture, filter, triage
published: 2026-11-09
order: 3
---

# Logcat — capture, filter, triage

Logcat is the command-line view into the device's log buffers: system and app messages, including stack traces. The official reference is developer.android.com/tools/logcat (verified live 2026-11-09; the buffer flags `-b main`, `-b radio`, `-b events` and the `*:S` silencer were confirmed on that page, same retrieval).

Golden rule: **capture before you clear.** Reading logs changes nothing on the device, but `adb logcat -c` discards buffer contents — run it only after the evidence is saved, never before.

## The five commands that cover most tasks

```
adb logcat -d                    # dump the current buffer and exit (no streaming)
adb logcat -d -t 200             # only the last 200 lines
adb logcat -d '*:W'              # warnings and worse, every tag
adb logcat -d MyTag:D '*:S'      # one tag at debug+, silence everything else
adb logcat -d -b crash           # the crash buffer (fatal-error stack traces)
```

Filter syntax is `<tag>:<priority>`, where priority is V(erbose), D(ebug), I(nfo), W(arn), E(rror), or F(atal). Add `*:S` to silence every tag you did not name — without it you widen the output instead of narrowing it. (Filter grammar verified on the official page. The `-b crash` buffer is self-verifying: run it — an invalid buffer name fails immediately.)

## Capture one app's output

1. Find the process: `adb shell pidof com.example.app` prints the PID (the app must be running; pidof is a standard shell utility on the device).
2. Filter by it: `adb logcat -d --pid 12345`.
3. PIDs are per-process-instance — if the app restarts, repeat both steps.

## Triage a crash report (the recipe)

`adb logcat -d -b crash -t 100 > crash.txt`, then read **bottom-up** for the FATAL EXCEPTION block: its first line names the exception type, and the first app frame in the stack is the prime suspect. Pair the stack with the main buffer around the same timestamps (`adb logcat -d -t 500`) for the lead-up.

## Verify the pipeline

`adb logcat -d -t 5` — five lines from the device means transport and permissions are working. Silence means the device is not connected or not authorized: see the [ADB skill](https://droidskills.dev/adb.md).
