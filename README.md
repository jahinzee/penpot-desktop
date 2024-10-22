![Penpot Desktop](https://europe1.discourse-cdn.com/standard20/uploads/penpot/original/2X/b/bc6c290e4566bc12f8afa162bae80ffb20a7c7f5.jpeg)

# Penpot Desktop
Penpot Desktop is an unofficial desktop application for the open-source design tool, Penpot.

It delivers a desktop-like experience for Penpot users with the addition of integrated tabs to conveniently traverse back and forth between projects. Offline support is available through the "select your own instance" option, and theme settings can be applied to either the entire desktop app or just the Penpot dashboard.

## Quick Links
Endusers:
 - [FAQ](https://sudovanilla.org/docs/penpot-desktop/FAQ.md)
 - Install [[Windows](https://sudovanilla.org/docs/penpot-desktop/install/WINDOWS.md), [Mac](https://sudovanilla.org/docs/penpot-desktop/install/MAC.md), [Linux](https://sudovanilla.org/docs/penpot-desktop/install/LINUX.md)]
 - [System Requirements](https://sudovanilla.org/docs/penpot-desktop/install/INSTALL.md#system-requirements)
 - [Changelog](https://sudovanilla.org/docs/penpot-desktop/CHANGELOG.md)

Developers:
 - [FAQ for Developers](https://sudovanilla.org/docs/penpot-desktop/FAQ-for-developers.md)
 - [Build Instructions](https://sudovanilla.org/docs/penpot-desktop/BUILD.md)

## Building
### Requirements
 - [NodeJS](https://nodejs.org/) v20
 - [Python](https://www.python.org/)
 - Supported OS:
    - Windows 10 or newer
    - macOS
    - Linux

### Install Packages
Before building anything, packages need to be installed first by your package manager, NodeJS should come with `npm` by default:
```bash
npm install
```

> Other package managers such as Yarn, PNPM, or Bun also work.

### Run Build
Once packages are installed, with no issues, you can run the build command:
```bash
npm run build
```