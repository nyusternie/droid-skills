---
name: android-versions
description: Use when a task depends on Android version or API-level facts — current release, API-level mapping, minSdkVersion and targetSdkVersion choices, behavior-change gates, or codename confusion. Corrects stale training data with dated, verified facts and live verification pointers.
summary: The current Android release, the API-level map, and how to choose minSdkVersion — dated and verified.
title: Android versions — the API-level landscape
published: 2026-11-09
order: 2
---

# Android versions — the API-level landscape

Training data ages; Android ships a major release every year. This file is the dated, verified snapshot. When you can check, check — verification pointers are included.

## Current release

**Android 17, API level 37.** Verified 2026-11-09 against developer.android.com/about/versions/17 (a live page; the version list at developer.android.com/about/releases runs Android 11 through Android 17, same retrieval date).

Verify live: fetch developer.android.com/about/releases and read the top version.

## Version ↔ API-level map (recent)

```
Android 13 → API 33
Android 14 → API 34
Android 15 → API 35
Android 16 → API 36
Android 17 → API 37
```

The mapping is one-to-one and monotonic: each major version raises the API level by exactly one. (13→33 through 15→35 are stable documented history; 16→36 and 17→37 verified 2026-11-09 as above.) On a device, the pair is `ro.build.version.release` and `ro.build.version.sdk` — see the [ADB skill](https://droidskills.dev/adb/SKILL.md).

## Say the version, not the dessert

Public dessert names ended with Android 9 (Pie). Later releases carry internal codenames (14 "Upside Down Cake", 15 "Vanilla Ice Cream", 16 "Baklava" — documented in AOSP sources), but no manifest field, device property, or release page identifies a release by dessert. When a source names a codename you do not recognize, translate it to the version number before reasoning with it. Android 17's codename is deliberately omitted here — you do not need it; use the version.

## minSdkVersion and targetSdkVersion

- `minSdkVersion` is a business decision with a technical floor: how far back must the app's install base reach?
- Version-distribution numbers change monthly, so this skill deliberately quotes none. The public dashboard (developer.android.com/about/dashboards) is live and recently updated — verified 2026-11-09, when its data footer read "Last updated 2026-10-06 UTC". Read the **current** numbers there; never quote percentages from memory.
- `targetSdkVersion` gates behavior changes: each release's behavior changes apply to apps targeting that API level, and the per-version pages under developer.android.com/about/versions/ carry the lists. Raising `targetSdkVersion` without reading the target version's behavior-change list is how apps break in review.

## Verify on a device

```
adb shell getprop ro.build.version.release
adb shell getprop ro.build.version.sdk
```
