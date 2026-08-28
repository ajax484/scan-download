# Change Log: React QR Scan & Download Application

## What Changed
Implemented a modern single-page React application powered by Vite that serves a 92MB PDF brochure. The app includes:
1. A webcam-based QR code scanner that detects when the correct brochure QR code is presented and automatically triggers the brochure download.
2. A dynamic QR code generator that uses the current browser domain/IP to create a QR code, allowing mobile devices on the same local network to scan and download the file.
3. A manual fallback card to download the file directly, styled with professional dark aesthetics.

## Why
This provides a seamless user experience for downloading the PDF brochure both on desktop (using a webcam to scan a physical QR code) and on mobile (using the phone's native camera to scan a displayed QR code).

## Files Touched
- [`package.json`](file:///c:/Users/USER/work/scan-download/package.json): Added project dependencies (`react`, `react-dom`, `qrcode.react`, `html5-qrcode`, `lucide-react`, `vite`, and `@vitejs/plugin-react`).
- [`.gitignore`](file:///c:/Users/USER/work/scan-download/.gitignore): Added standard ignore rules for Node/Vite projects and ignored the large 92MB PDF brochure file.
- [`vite.config.js`](file:///c:/Users/USER/work/scan-download/vite.config.js): Enabled the React plugin and set host binding to allow local network access.
- [`index.html`](file:///c:/Users/USER/work/scan-download/index.html): Configured standard entry points and loaded Google Fonts (Outfit).
- [`src/main.jsx`](file:///c:/Users/USER/work/scan-download/src/main.jsx): React bootstrap file.
- [`src/App.jsx`](file:///c:/Users/USER/work/scan-download/src/App.jsx): Built the main shell layout, state for tab toggling, brochure metadata, and file download triggers.
- [`src/index.css`](file:///c:/Users/USER/work/scan-download/src/index.css): Added design tokens, glassmorphism cards, glowing hover styles, custom keyframes for the laser scanning animation, and responsive media queries.
- [`src/components/QrGenerator.jsx`](file:///c:/Users/USER/work/scan-download/src/components/QrGenerator.jsx): Added dynamic QR rendering of the absolute path to the brochure.
- [`src/components/QrScanner.jsx`](file:///c:/Users/USER/work/scan-download/src/components/QrScanner.jsx): Added camera selection dropdown, video viewport scanner wrapper using `html5-qrcode`, scanner overlays, validation logic, and trigger hook.
- `public/BONA BROCHURE SCAN CODE.pdf`: Moved the PDF brochure to the public folder so it can be served as a static asset.

## Follow-ups / Known Issues
- **Camera Secure Contexts**: Modern browsers require a secure context (`localhost` or `https`) for the camera APIs to work. Toggling webcam scanning on an external device (e.g. mobile phone) accessing the server over `http://<local-ip>:5173` might fail due to browser security restrictions. To scan with a phone, the user should use their phone's native camera app to scan the generated QR code, which opens the link and initiates the download directly (working perfectly over HTTP).

## Proposed Commit Message
```text
feat: initialize react vite app with qr scanner and brochure download

- Set up React + Vite project architecture in scan-download
- Place brochure pdf in public directory for static asset hosting
- Implement dynamic QR Generator using `qrcode.react` based on current domain origin
- Implement webcam scanner using `html5-qrcode` with custom camera device selections
- Apply responsive design with dark theme, glassmorphism cards, and laser scanning animations
```
