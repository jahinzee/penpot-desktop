![Penpot Desktop](https://europe1.discourse-cdn.com/standard20/uploads/penpot/original/2X/b/bc6c290e4566bc12f8afa162bae80ffb20a7c7f5.jpeg)

# Penpot Desktop
Penpot Desktop is an unofficial desktop application for the open-source design tool, Penpot.

It delivers a desktop-like experience for Penpot users with the addition of integrated tabs to conveniently traverse back and forth between projects. Offline support is available through the "select your own instance" option, and theme settings can be applied to either the entire desktop app or just the Penpot dashboard.

## Quick Links
- [Old documentation](https://sudovanilla.org/docs/penpot-desktop/introduction/) - The old documentation for Penpot Desktop. New, updated documentation is in the works.

## Development and Building

1. Ensure the environment meets the following requirements:
    - Supported OS:
        - Windows 10 or newer
        - macOS
        - Linux
    - [NodeJS](https://nodejs.org/) v20
    - [Python](https://www.python.org/)
    - [Git](https://git-scm.com/) (optional)
1. Clone the repository or download the source code.
1. Navigate to the project's directory.
1. Run `npm ci` to install packages.  
   *Other package managers such as Yarn, PNPM, or Bun should work as well.*
1. (Optional) Run `npm run dev` to start the application in development mode. This will open a new window with the application running.
1. Run `npm run build` to build the application. By default, it will build for the current OS and architecture, but you can pass flags to build for other platforms. See the [Electron Builder documentation](https://www.electron.build/cli) for more information.