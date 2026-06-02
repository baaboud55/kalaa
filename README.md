<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18rwSHyQ-oJvrIeIv-NcvDnrVDtBtOWRB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Build and Deploy to GitHub Pages

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Build the application:
   `npm run build`
3. Deploy the `dist` folder to GitHub Pages

The build output in the `dist` folder contains static files that can be deployed to GitHub Pages. The application is configured with the correct base path (`/kalaa/`) for GitHub Pages deployment.

**Note:** GitHub Pages hosts static files and cannot read `.tsx` (TypeScript) files directly. Always run `npm run build` before deploying to GitHub Pages, and deploy the contents of the `dist` folder.

## 3D Printable Enclosure

A 3D printable enclosure for the Hydromisc board (which this application controls) is available in the `enclosure` directory! 

The provided `enclosure.stl` file contains a parametric case designed specifically for the board, including:
- Perfect 108x108mm outer dimensions for clearance
- 4 internal PCB mounting standoffs that precisely align with the board's mounting holes
- Cutouts on the back wall for the 2 BNC connectors and 3 Molex connectors
- Cutouts on the front wall for the DC power jack and 8 Molex connectors

To generate a new custom enclosure, you can use the included `generate-enclosure.ts` script (which requires the [easy-enclosure](https://github.com/bruceborrett/easy-enclosure) framework).
