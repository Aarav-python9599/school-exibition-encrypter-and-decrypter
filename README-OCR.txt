Secret Message Lab — Tesseract.js OCR update

OCR engine: Tesseract.js 5.1.1 (pinned v5 release).
The scanner initializes on DOMContentLoaded and reports its status in the UI.
Image preparation: guide-box crop, grayscale conversion, and min/max contrast stretch.
No binary threshold is used.
Camera: rear-facing ideal, 1920x1080 ideal, continuous focus ideal.
Mobile fallback: Take Photo / Upload Image file input with capture="environment".

IMPORTANT DEPLOYMENT NOTE:
This archive currently loads Tesseract.js, its worker/core runtime, and English
traineddata from pinned HTTPS CDN endpoints. The app runs OCR client-side, but
this build is NOT fully offline/self-hosted. The runtime binary and traineddata
files could not be retrieved in this environment, so they are not falsely
represented as bundled local files. For offline operation, download compatible
Tesseract.js 5.1.1, tesseract.js-core 5.1.1, and English traineddata assets,
place them in /tesseract/, and change workerPath, corePath, langPath and the
script src in index.html to those local paths.


UI refresh:
- Mobile-first dark cyber-cryptography theme with glass cards and cyan/emerald accents.
- Scanner-ready pill, glowing viewfinder corners, animated scanline and scan progress feedback.
- 500ms character scramble reveal for decrypted output.
- Copy Decrypted Message action with Copied toast.
- Lightweight IntersectionObserver scroll reveals.
- Print stylesheet now hides the app layout with display:none, positions the print sheet in normal flow,
  and uses an A4 page margin. This prevents the hidden app layout and oversized print padding from
  creating a trailing blank page for short messages.
