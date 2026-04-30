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

<table>
  <tr>
    <td align="center" valign="top"><img width="290" height="377" alt="Screen 1" src="https://github.com/user-attachments/assets/aee39d8d-f7a9-40c3-8509-332391f36ed9" /></td>
    <td align="center" valign="top"><img width="285" height="587" alt="Screen 2" src="https://github.com/user-attachments/assets/c8b18016-1373-4bc5-881e-b38ee44fa42a" /></td>
    <td align="center" valign="top"><img width="295" height="589" alt="Screen 3" src="https://github.com/user-attachments/assets/0bfd6672-5c3b-4576-82ba-09fda78eed52" /></td>
  </tr>
  <tr>
    <td align="center" valign="top"><img width="296" height="342" alt="Screen 4" src="https://github.com/user-attachments/assets/eca7a3a5-132c-4762-8a99-761a7af98bc5" /></td>
    <td align="center" valign="top"><img width="292" height="422" alt="Screen 5" src="https://github.com/user-attachments/assets/4ccc4e8b-06fc-438a-b486-b5f4ece4c914" /></td>
    <td align="center" valign="top"><img width="292" height="591" alt="Screen 6" src="https://github.com/user-attachments/assets/ed905f4d-0018-468b-892b-defc2bcb80cb" /></td>
  </tr>
  <tr>
    <td align="center" valign="top"><img width="289" height="472" alt="Screen 7" src="https://github.com/user-attachments/assets/a7d89ebd-5223-450a-9879-65f51697e7cb" /></td>
    <td align="center" valign="top"><img width="295" height="321" alt="Screen 8" src="https://github.com/user-attachments/assets/0c7ffd71-30eb-44aa-ae3e-3de6c45384b7" /></td>
    <td align="center" valign="top"><img width="291" height="591" alt="Screen 9" src="https://github.com/user-attachments/assets/093cb7b3-6141-43f0-aa9e-be4209929616" /></td>
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
