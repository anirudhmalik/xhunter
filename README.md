<div align="center">

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![v2.0-demo](https://img.shields.io/badge/release-v2.0--demo-blue?style=flat-square)](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0-demo)

<br />

<a href="https://github.com/anirudhmalik/xhunter">
  <img src="images/logo.png" alt="XHUNTER" width="300" height="300">
</a>

### XHUNTER

Android research and administration tooling — version 2 **demo** distribution.

[View release (v2.0-demo)](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0-demo) · [Issues](https://github.com/anirudhmalik/xhunter/issues)

</div>

## Legal disclaimer: educational and authorized use only

Using **XHUNTER** against people or systems **without** clear **authorization** is **illegal** in most places. You must follow all laws that apply to you. The authors are **not** responsible for misuse. Only use this on devices you own or that you are explicitly allowed to test. The in-app **About** and legal text apply in addition to this section.

## Screenshots

**APK binder** shots below are from the **in-app binder on Android** (operator handset): decode / patch / rebuild runs on the device, not the desktop `binder/` tool.

<table cellpadding="16" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="left" valign="top" width="50%">
      <h4 align="left">Home:</h4>
      <p align="left"><small><small>Central hub once your VPS and SSH path are up: open offline app views (for example Instagram or WhatsApp DBs) and user-visible storage like Downloads. Data appears after the client has already synced or exported content while online—handy for revisiting artifacts without keeping a live session.</small></small></p>
      <p align="center"><img width="280" alt="Home — SSH and offline data" src="https://github.com/user-attachments/assets/bf64b44f-1e17-4ac0-892d-6ffab845f544" /></p>
    </td>
    <td align="left" valign="top" width="50%">
      <h4 align="left">WhatsApp:</h4>
      <p align="left"><small><small>Inspect the pulled WhatsApp SQLite store messages, chats, and related metadata in a structured UI. This view is driven by databases copied while the device was reachable, so you can scroll history even when the handset is idle or offline.</small></small></p>
      <p align="center"><img width="280" alt="WhatsApp offline DB" src="https://github.com/user-attachments/assets/d29a319f-c1cb-48dc-8eca-ee942c18fb4e" /></p>
    </td>
  </tr>
  <tr>
    <td align="left" valign="top">
      <h4 align="left">Instagram:</h4>
      <p align="left"><small><small>Browse Instagram artifacts that were cached or persisted locally during sync—threads, assets on disk, and companion DB fragments. Like WhatsApp, it reflects what was captured during an earlier online window rather than a perpetual live mirror.</small></small></p>
      <p align="center"><img width="280" alt="Instagram offline DB" src="https://github.com/user-attachments/assets/b4be2dc8-d1bb-4fbc-a60c-11bbc0570ef1" /></p>
    </td>
    <td align="left" valign="top">
      <h4 align="left">APK binder — config</h4>
      <p align="left"><small><small>On-device binder screen on the operator phone: enter the callback host or url the repackaged APK should use when it runs. Keep this aligned with your VPS / SSH listener settings so packages built on Android reach the same backend you use from the host app.</small></small></p>
      <p align="center"><img width="280" alt="Binder config — host for payload" src="https://github.com/user-attachments/assets/9688c876-4696-47f1-a2cc-aec55b9d67e9" /></p>
    </td>
  </tr>
  <tr>
    <td align="left" valign="top">
      <h4 align="left">APK binder — logs</h4>
      <p align="left"><small><small>Scrolling log from the bind job on Android: decode, merge, rebuild, sign, and error lines from the in-app pipeline. The heavy lifting uses <a href="https://github.com/anirudhmalik/apktool-android">apktool-android</a>—Apktool v3 brought to Android (decode → edit project tree → rebuild inside the app, bundled <code>libaapt2.so</code>, no desktop CLI / Termux / root). Use it to confirm each stage finished on-device before you sideload or hand off the generated APK.</small></small></p>
      <p align="center"><img width="280" alt="Binder logs" src="https://github.com/user-attachments/assets/82ca36b4-7eaa-4988-8168-5459c6e36ff8" /></p>
    </td>
    <td align="left" valign="top">
      <h4 align="left">APK binder — activity hook</h4>
      <p align="left"><small><small>In-app wizard step on the phone: choose the host <code>Activity</code> so the first launch of the carrier APK flows through the injected stub. This ties the benign outer package to the operator payload that requests permissions and keeps the session alive.</small></small></p>
      <p align="center"><img width="280" alt="Binder activity hook step" src="https://github.com/user-attachments/assets/492a82ef-0532-447a-82af-ac6f63c39ab5" /></p>
    </td>
  </tr>
  <tr>
    <td align="left" valign="top">
      <h4 align="left">Listener:</h4>
      <p align="left"><small><small>Once SSH forwarding is stable, this panel watches for inbound callbacks from deployed clients. It is where you confirm the tunnel, spot reconnects, and escalate from passive listening to an interactive remote session when a handset checks in.</small></small></p>
      <p align="center"><img width="280" alt="Listener — waiting for connections" src="https://github.com/user-attachments/assets/aee39d8d-f7a9-40c3-8509-332391f36ed9" /></p>
    </td>
    <td align="left" valign="top">
      <h4 align="left">Remote device — actions</h4>
      <p align="left"><small><small>Context-aware shortcuts for everything the agent exposes: messaging surfaces, overlays, ringing the device, file tooling, and other modules your build ships. Each tile respects what Android granted—if a permission was denied, the backing action stays unavailable.</small></small></p>
      <p align="center"><img width="280" alt="Remote device action menu" src="https://github.com/user-attachments/assets/c8b18016-1373-4bc5-881e-b38ee44fa42a" /></p>
    </td>
  </tr>
  <tr>
    <td align="left" valign="top">
      <h4 align="left">Installed apps:</h4>
      <p align="left"><small><small>Package inventory with launch metadata, split APK awareness, and quick pivots into deeper tooling. Useful for mapping the attack surface of a supervised handset—spotting OEM bloat, banking apps, or sideloaded bundles you need to document.</small></small></p>
      <p align="center"><img width="280" alt="Installed apps" src="https://github.com/user-attachments/assets/0bfd6672-5c3b-4576-82ba-09fda78eed52" /></p>
    </td>
    <td align="left" valign="top">
      <h4 align="left">Camera:</h4>
      <p align="left"><small><small>Low-latency preview of the camera stack you are authorized to access—front or rear depending on device policy. Quality tracks bandwidth and HAL quirks, but it is enough for live situational awareness during controlled red-team or MDM exercises.</small></small></p>
      <p align="center"><img width="280" alt="Live camera stream" src="https://github.com/user-attachments/assets/4ccc4e8b-06fc-438a-b486-b5f4ece4c914" /></p>
    </td>
  </tr>
  <tr>
    <td align="left" valign="top">
      <h4 align="left">Microphone:</h4>
      <p align="left"><small><small>Tap the device microphone for streaming audio or buffered captures, gated by runtime mic permission. Pair with camera for fuller environmental context, but only inside scopes where recording is explicitly allowed (corp-owned hardware, consent forms on file, etc.).</small></small></p>
      <p align="center"><img width="280" alt="Microphone audio stream" src="https://github.com/user-attachments/assets/eca7a3a5-132c-4762-8a99-761a7af98bc5" /></p>
    </td>
    <td align="left" valign="top">
      <h4 align="left">Device info:</h4>
      <p align="left"><small><small>Hardware and telemetry dossier: SoC, RAM tiers, storage health, battery cycles, Wi‑Fi/cellular snapshot, last known geo fix, sensor lineup, and build fingerprints. It is the fastest way to prove device posture during audits without adb shell every time.</small></small></p>
      <p align="center"><img width="280" alt="Device info — storage, network, location" src="https://github.com/user-attachments/assets/093cb7b3-6141-43f0-aa9e-be4209929616" /></p>
    </td>
  </tr>
  <tr>
    <td align="left" valign="top" colspan="2">
      <h4 align="left">File explorer:</h4>
      <p align="left"><small><small>Full remote file browser with multi-select downloads, folder recursion, in-place rename/delete, and uploads from the operator workstation. Paths respect the agent’s sandboxing, but exposed mounts cover typical user media, shared storage, and app-scoped directories you already mirrored.</small></small></p>
      <table cellpadding="12" cellspacing="0" border="0" align="center" width="100%">
        <tr>
          <td align="center" valign="top" width="50%">
            <p align="center"><img width="280" alt="File explorer — list and operations" src="https://github.com/user-attachments/assets/ed905f4d-0018-468b-892b-defc2bcb80cb" /></p>
          </td>
          <td align="center" valign="top" width="50%">
            <p align="center"><img width="280" alt="File explorer — detail view" src="https://github.com/user-attachments/assets/0c7ffd71-30eb-44aa-ae3e-3de6c45384b7" /></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

## About

Version 2 replaces older single-APK workflows (for example the `xhunter_1.6` style): there is no in-app build or bind. Everything is **operator host app** + **desktop binder** under `binder/` + a **VPS** for SSH and ports, using the same server address in the app and in `binder/config.txt`. Source and upstream development live in **[anirudhmalik/xhunter](https://github.com/anirudhmalik/xhunter)**.

**Setup:** see **[USAGE.md](USAGE.md)** for VPS, binder, operator app, release downloads, and demo vs pro.

## Future plans

An **in-app binder** is in active development, built on **[apktool-android](https://github.com/anirudhmalik/apktool-android)** — Apktool’s decode → edit → rebuild pipeline as an Android library (on-device, no desktop CLI). The Apktool-on-Android stack there is already complete; integrating it into a shipping XHUNTER build is in progress, with a public release targeted **in the next few days**. The aim is a flow similar to the older **1.6** single-APK experience, but updated and flexible enough to **bind arbitrary host APKs** from the phone.

## Credits

- [Apktool](https://github.com/iBotPeaches/Apktool) — APK decode and rebuild in the desktop binder
- [JSch](https://github.com/is/jsch) — SSH stack used in Android and Java tooling

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE). The main source tree is **[anirudhmalik/xhunter](https://github.com/anirudhmalik/xhunter)**; check that repo for its license if components differ.
