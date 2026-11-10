---
name: adb
description: Use when a task involves connecting a host machine to an Android device over ADB — USB or wireless pairing, authorization states, and read-only device inspection (getprop facts, package lists). Covers the pairing-port versus connection-port trap, developer-options setup, and the platform-tools install.
summary: Connect your host to an Android device over ADB — pairing, authorization, and safe read-only inspection.
title: ADB — the bridge to the device
published: 2026-11-09
order: 1
---

# ADB — the bridge to the device

ADB (Android Debug Bridge) is a command-line tool that lets a host machine communicate with an Android device. It facilitates device actions — installing and debugging apps chief among them — and gives you access to a Unix shell on the device (verified from the official page, developer.android.com/tools/adb, retrieved 2026-11-09).

This skill pairs devices correctly and inspects them **read-only**. It never writes to the device, never requests `su`, and never runs data-destroying commands.

## Get the tool (once per host)

adb ships inside **SDK Platform-Tools**, the standalone package (verified from developer.android.com/studio/releases/platform-tools, retrieved 2026-11-09). Android Studio bundles the same package for developers. Install platform-tools and put it on your `PATH`. Never install repackaged "adb installers" — platform-tools _is_ the tool.

Sanity check: `adb version` prints "Android Debug Bridge version …".

## Wake the device side (once per device)

1. Settings → About phone → tap **Build number** seven times. You are now a developer (verified from developer.android.com/studio/debug/dev-options, retrieved 2026-11-09).
2. Find **Developer options** — its location and menu names vary by OEM (verified across devices); when in doubt, use the Settings search box.
3. Toggle **USB debugging** for cable work, or **Wireless debugging** (the dev-options page's wireless workflow applies to Android 11 and later, retrieved 2026-11-09) for cable-free work.

The whole setup is reversible — USB debugging is a toggle, not a commitment. To revoke a host's access later, the same Developer options screen carries a **Revoke USB debugging authorizations** control (documented UI text).

## USB: connect and authorize

`adb devices` — the first attempt lists the phone as **unauthorized** while it shows an "Allow USB debugging?" dialog bearing the host's key fingerprint. Approve it (optionally "always allow from this computer") and the next `adb devices` shows **device**. If it shows **offline** or nothing: `adb kill-server && adb start-server`, reseat the cable, and re-run. (unauthorized / device / offline are the documented `adb devices` output states.)

## Wireless: pair, then connect — TWO different ports

The trap that wastes agent hours: wireless setup uses **two** port numbers.

1. On the phone: Developer options → Wireless debugging → **Pair device with pairing code**. The dialog shows an IP address, a port, and a six-digit pairing code (verified from the official adb Wi-Fi workflow — "port number, and pairing code displayed on the device" — retrieved 2026-11-09).
2. `adb pair <IP>:<PAIRING-PORT>` — enter the pairing code when asked.
3. The pairing port is **not** the connection port — the official workflow notes the connection happens on a different port (verified — "port to a different port on a device" — retrieved 2026-11-09). The main Wireless debugging screen shows the phone's IP address and the **connection** port.
4. `adb connect <IP>:<CONNECTION-PORT>`, then `adb devices` shows **device**.

Phone and host must be on the same Wi-Fi network (documented requirement).

## Read-only inspection set

```
adb shell getprop ro.product.manufacturer
adb shell getprop ro.product.model
adb shell getprop ro.build.version.release   # Android version
adb shell getprop ro.build.version.sdk       # API level (integer)
adb shell pm list packages -3                # third-party packages only
adb shell dumpsys battery                    # battery state (read-only dump)
```

Cross-reference: the [Android versions skill](https://droidskills.dev/android-versions/SKILL.md) turns the version/SDK pair into the platform landscape.

## Out of scope

Writing, flashing, `su`, and any data-destroying command (`pm clear`, `pm uninstall` on anything but your own app) are out of scope for this skill — by design, and unconditionally.
