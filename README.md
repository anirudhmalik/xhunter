





[Contributors](https://github.com/anirudhmalik/xhunter/graphs/contributors)
[Forks](https://github.com/anirudhmalik/xhunter/network/members)
[Stargazers](https://github.com/anirudhmalik/xhunter/stargazers)
[Issues](https://github.com/anirudhmalik/xhunter/issues)
[MIT License](https://github.com/anirudhmalik/xhunter/blob/master/LICENSE.md)
[Last Commit](https://github.com/anirudhmalik/xhunter/commits/master)
[Repo Size](https://github.com/anirudhmalik/xhunter)

  


### XHUNTER

Android research / remote-admin tooling — **v2 demo** distribution   
[View release](https://github.com/anirudhmalik/xhunter/releases)  ·  [Report bug](https://github.com/anirudhmalik/xhunter/issues)  ·  [Request feature](https://github.com/anirudhmalik/xhunter/issues)

## Legal disclaimer: educational / authorized use only

Use of **XHUNTER** against people or systems **without** clear **authorization** is **illegal** in most jurisdictions. You must comply with all applicable laws. The authors are **not** liable for misuse. Use only on systems you own or are explicitly permitted to test. The in-app **About** / legal text applies in addition to this section.

## About (v2 demo)

**v2** is a new distribution model vs older single-APK flows (e.g. `xhunter_1.6`–style all-in-one builds). This package focuses on:

- A **host app** you install on your **operator** phone: `**xhunter-demo.apk`** (SSH **reverse** tunnel, client list, v2.0 **demo** badge in the UI).
- A **desktop binder** in `**binder/`** (Java, Bash): merge the **client** into a **host APK** (example: **Instagram**). In-device binding is not practical; use a PC.
- A **VPS** (or similar) for reachability, **port / SSH** setup, and a `**HOST` address** shared by the binder and the app.

[Demo vs pro](#features--demo-vs-pro) below lists what the current demo build allows vs a future **pro**-style build.

**Optional `config.txt` reference:** [binder/BINDER.md](binder/BINDER.md)

---

## Prerequisites

- **Android** device(s) &mdash; one for the **host / operator** app, one for the **merged** (test) app
- **Internet** and a **VPS** (or cloud VM) you control
- **PC:** macOS, Linux, or **Windows** with **Git Bash** or **WSL** (for the binder)
- **JDK** on the PC (the binder’s `setup.sh` checks for `java`)

---

## 1) VPS and SSH reverse port forwarding

You need a **reachable server** and forwarding so a device running the merged app can use a **reverse SSH tunnel**. Use the same **server address** in the app and as `**HOST`** in `binder/config.txt` (`remote_server_ip` or DNS).

### 1.1 &mdash; Cloud server and SSH access

- Spin up **Ubuntu** on a VPS or **EC2** (or similar). In the security group / firewall, allow what you need (often **22** and forwarded ports, e.g. **8080** on the server side for this flow).
- Log in, for example:
  ```bash
  ssh -i your_key.pem ubuntu@<remote_server_ip>
  ```
  On some AMIs the user is **`ec2-user`** instead of **`ubuntu`**.
- Optional: `sudo passwd ubuntu` (or your user).

### 1.2 &mdash; `sshd_config`: `GatewayPorts` and password auth

**Security note:** password SSH and `GatewayPorts` are convenient for this write-up; lock down and prefer keys in production. Only on **your** server.

1. Edit `/etc/ssh/sshd_config` (or a drop-in under `sshd_config.d/`):
  - `**GatewayPorts no` &rarr; `yes`**
  - If you use password login: `**PasswordAuthentication no` &rarr; `yes**`
2. Restart SSH:
  ```bash
   sudo systemctl restart ssh
  ```
   (Some distros use the `sshd` unit name.)
3. In **Xhunter** (with `xhunter-demo.apk`), you will set **host**, **user**, **password** (and ports) to match. After the tunnel is up, use the same **public IP** as `**HOST`** when building a merged client.

*Reverse* SSH: the device dials **out** to the server; the path is configured so the **host app** can accept the client. Exact ports are shown in the app.

---

## 2) Binder: merge the client into a host APK (demo: Instagram)

1. From the **distribution root** (next to `xhunter-demo.apk`):
  ```bash
   cd binder
  ```
2. One-time:
  ```bash
   chmod +x setup.sh binder.sh
   ./setup.sh
  ```
3. Edit **`config.txt`**: set **`HOST`** to your **VPS IP**. The sample line **`HOST_APK=apps/instagram.apk`** expects a file at **`binder/apps/instagram.apk`**. This repo’s **`binder/apps/`** folder does **not** include `instagram.apk` (host APKs are your responsibility). Copy your own host APK in and name it `instagram.apk`, or set **`HOST_APK`** to a different path. See [binder/BINDER.md](binder/BINDER.md) for optional keys.
4. Run (real terminal, not a pipe):
  ```bash
   ./binder.sh
  ```
5. At the **hook** prompt, choose the line for `**InstagramMainActivity`** (example: index `**13**` &mdash; **your numbers will differ**):
  ```text
   Choose activity for Payload.start hook (up to 20 shown; use --hook-list-max to list more. ★ = MAIN/LAUNCHER):
   …
    13)    com.instagram.mainactivity.InstagramMainActivity
   …
   Enter number (1-20) or q: 13
  ```
6. Wait until merge, rebuild, and sign finish.
7. **Output:** `binder/out/xhunter-merged.apk` (unless you set `**OUT_APK`**).
8. Install that APK on the **test** device. The client often **connects only after** the user **opens the app**, **signs in** if required, and reaches the **home** screen.
9. On the **operator** phone, install `**xhunter-demo.apk`** from the parent folder (`../xhunter-demo.apk`), enter **SSH** credentials, **start the tunnel**, wait for the client in the list. Details: [&sect;3](#3-install-xhunter-demoapk--operator-app) below.

---

## 3) Install `xhunter-demo.apk` &mdash; operator app

1. Install `**xhunter-demo.apk`** (allow **unknown sources** if prompted).
2. **Android 13+:** allow **notifications** for the tunnel foreground service if asked.
3. Open the app: **SSH** host, user, password, **ports** as shown; **save** a profile if you like; **start** the tunnel. When a merged device connects, it appears in the **client list**; in the **demo**, most modules show **Pro only** (see [features](#features--demo-vs-pro)).
4. **v2.0 demo** badge, **Settings**, **About**, and in-app **legal** text.

---

## Features &mdash; demo vs pro


| Area                                     | v2.0 **demo** (this distribution) | **Pro** (planned) |
| ---------------------------------------- | --------------------------------- | ----------------- |
| Device list & **device info** / refresh  | Yes                               | Yes               |
| **File explorer**                        | Pro-only / locked in demo         | Yes               |
| **WhatsApp** archive, **installed apps** | Pro-only in demo                  | Yes               |
| **SMS** / **send SMS**                   | Pro-only in demo                  | Yes               |
| **Contacts** / **call log**              | Pro-only in demo                  | Yes               |
| **Camera** / **mic** / **clipboard**     | Pro-only in demo                  | Yes               |


VPS + binder process is the same; **pro** is about what the **host** build enables remotely.

**Historical v1.6-style** all-in-APK workflow (in-app *build & bind*) is replaced here by the **desktop binder** + **SSH** path above.

---

## Files in this tree (expect)


| Item                                 | Role                                                      |
| ------------------------------------ | --------------------------------------------------------- |
| `README.md`                          | This file                                                 |
| `images/logo.png`                    | Add your logo (referenced at top); see `images/`          |
| `xhunter-demo.apk`                   | Operator phone                                            |
| `binder/apps/`                       | No `instagram.apk` (or other host APK) in this tree — add your own file to match `HOST_APK` in `config.txt`. |
| `binder/` (rest)                     | `setup.sh`, `binder.sh`, `config.txt`, `vendor/`, etc.     |
| [binder/BINDER.md](binder/BINDER.md) | `config.txt` reference                                    |


Re-run `binder/setup.sh` if the checker complains about missing files.

## Contributing

Contributions, issues, and pull requests are welcome. Fork, branch, and open a PR, or use **Issues** for bugs and feature ideas.

1. Fork the project
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit and push, then open a pull request

([back to top](#top))

## Credits

- [Apktool](https://github.com/iBotPeaches/Apktool) &mdash; APK decode/build used by the binder  
- [JSch](http://www.jcraft.com/jsch/) &mdash; SSH client used on Android in many stacks  

This project is distributed under the **MIT License** where a `LICENSE` or `LICENSE.md` is present in the repository. If your fork does not include it yet, add the same license as the [upstream](https://github.com/anirudhmalik/xhunter) project.

([back to top](#top))

