"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as opentype from "opentype.js";
import type { LogoSettings } from "../LogoGenerator";

const FLAG_RED_PATH =
  "M125.667,122.917c0,0,28,33.083,89.25,34.333c61.251,1.25,95.917-37.917,130.917-33.333s63,43.333,77.75,50.167L333,425.75c0,0-1.833,1.334-11,4.667s-11.333,4.333-11.333,4.333l40.25-122.917c0,0-38.75-32.687-73.75-35c-35.001-2.313-50.917,23.75-110.083,13.75C107.917,280.583,69.5,243.5,69.5,243.5s-1.415-21.067,14.5-59.833C99.914,144.902,125.667,122.917,125.667,122.917z";
const FLAG_BLACK_PATH =
  "M69.917,251.25c0,0,41.084,38.416,102.417,46.083c61.332,7.667,67.039-14.491,100.916-14.25c21.548,0.153,29.334,9.584,29.334,9.584l-53.506,149.67c0,0-4.18-0.044-10.092-0.692c-5.911-0.648-9.541-1.294-9.541-1.294L257,357.5c0,0-13.584-8.707-27.25-10.5c-13.668-1.793-21.042,3-46.5,2.5c-24.073-0.473-71.25-12.75-93.333-45.75S69.917,251.25,69.917,251.25z";

const SVG_SIZE = 500;
const SVG_CENTER = SVG_SIZE / 2;
const MAX_IMAGE_DIMENSION = 1024;
const TOP_ARC_RADIUS = 210;
const BOTTOM_ARC_RADIUS = 240;
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.20/files/inter-latin-700-normal.woff";
function buildGlyphsOnArc(
  font: opentype.Font,
  text: string,
  isTopArc: boolean,
  fontSize: number,
  arcRadius: number,
): string {
  if (!text) return "";

  const glyphScale = fontSize / font.unitsPerEm;
  const arcDirection = isTopArc ? 1 : -1;
  const startAngle = isTopArc ? -Math.PI / 2 : Math.PI / 2;

  const glyphs = [...text].map((char) => font.charToGlyph(char));
  const totalTextWidth = glyphs.reduce(
    (sum, glyph) => sum + (glyph.advanceWidth || 500) * glyphScale,
    0,
  );

  let cursorOffset = -totalTextWidth / 2;
  let svgPaths = "";

  for (const glyph of glyphs) {
    const glyphWidth = (glyph.advanceWidth || 500) * glyphScale;
    const glyphCenter = cursorOffset + glyphWidth / 2;
    const angle = startAngle + arcDirection * (glyphCenter / arcRadius);
    const x = SVG_CENTER + arcRadius * Math.cos(angle);
    const y = SVG_CENTER + arcRadius * Math.sin(angle);
    const rotationDegrees = (angle * 180) / Math.PI + arcDirection * 90;

    const pathData = glyph.getPath(0, 0, fontSize).toPathData(2);
    svgPaths += `<path d="${pathData}" transform="translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${rotationDegrees.toFixed(2)}) translate(${(-glyphWidth / 2).toFixed(2)},0)"/>`;

    cursorOffset += glyphWidth;
  }

  return svgPaths;
}

function buildGridOverlay(): string {
  let gridLines = "";
  for (let i = 0; i <= SVG_SIZE; i += 50) {
    gridLines += `<line x1="${i}" y1="0" x2="${i}" y2="${SVG_SIZE}" stroke="rgba(204,0,0,0.5)" stroke-width="0.5"/>`;
    gridLines += `<line x1="0" y1="${i}" x2="${SVG_SIZE}" y2="${i}" stroke="rgba(204,0,0,0.5)" stroke-width="0.5"/>`;
  }
  gridLines += `<line x1="${SVG_CENTER}" y1="0" x2="${SVG_CENTER}" y2="${SVG_SIZE}" stroke="rgba(204,0,0,0.5)" stroke-width="1"/>`;
  gridLines += `<line x1="0" y1="${SVG_CENTER}" x2="${SVG_SIZE}" y2="${SVG_CENTER}" stroke="rgba(204,0,0,0.5)" stroke-width="1"/>`;
  return gridLines;
}

function applyRedBlackSplit(
  imageData: ImageData,
  splitPercentage: number,
): void {
  const { data, width, height } = imageData;
  const splitX = Math.round((splitPercentage / 100) * width);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4;
      const isTransparent = data[pixelIndex + 3] === 0;
      if (isTransparent) continue;

      const isRedSide = x < splitX;
      data[pixelIndex] = isRedSide ? 0xcc : 0;
      data[pixelIndex + 1] = 0;
      data[pixelIndex + 2] = 0;
    }
  }
}

function processUploadedImage(
  dataURL: string,
  splitPercentage: number,
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { width: originalWidth, height: originalHeight } = img;
      if (originalWidth === 0 || originalHeight === 0) {
        resolve(dataURL);
        return;
      }

      let width = originalWidth;
      let height = originalHeight;
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        const scaleFactor = Math.min(
          MAX_IMAGE_DIMENSION / width,
          MAX_IMAGE_DIMENSION / height,
        );
        width = Math.round(width * scaleFactor);
        height = Math.round(height * scaleFactor);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      applyRedBlackSplit(imageData, splitPercentage);
      ctx.putImageData(imageData, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(dataURL);
    img.src = dataURL;
  });
}

function buildSVG(
  font: opentype.Font | null,
  settings: LogoSettings,
  logoDataURL: string | null,
  showGrid: boolean,
): string {
  const centerGroup = logoDataURL
    ? buildLogoImageGroup(logoDataURL, settings)
    : buildDefaultFlagsGroup();

  const topTextPaths = font
    ? buildGlyphsOnArc(
        font,
        settings.topText,
        true,
        settings.fontSize,
        TOP_ARC_RADIUS,
      )
    : "";
  const bottomTextPaths = font
    ? buildGlyphsOnArc(
        font,
        settings.bottomText,
        false,
        settings.fontSize,
        BOTTOM_ARC_RADIUS,
      )
    : "";
  const gridOverlay = showGrid ? buildGridOverlay() : "";

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_SIZE} ${SVG_SIZE}" width="${SVG_SIZE}" height="${SVG_SIZE}">
  <circle cx="${SVG_CENTER}" cy="${SVG_CENTER}" r="225" stroke="#000" fill="#fff" stroke-width="50"/>
  ${centerGroup}
  <g fill="#fff">${topTextPaths}</g>
  <g fill="#fff">${bottomTextPaths}</g>
  <g stroke-linecap="round">${gridOverlay}</g>
</svg>`;
}

function buildLogoImageGroup(
  logoDataURL: string,
  settings: LogoSettings,
): string {
  const scaleFactor = settings.scale / 100;
  return `<g transform="translate(${settings.posX},${settings.posY}) translate(256,256) scale(${scaleFactor}) translate(-256,-256)">
    <image href="${logoDataURL}" width="512" height="512" preserveAspectRatio="xMidYMid meet"/>
  </g>`;
}

function buildDefaultFlagsGroup(): string {
  return `<g transform="translate(-9,-2)">
    <path d="${FLAG_RED_PATH}" fill="#cc0000"/>
    <path d="${FLAG_BLACK_PATH}" fill="#000"/>
  </g>`;
}

interface PreviewPanelProps {
  settings: LogoSettings;
}

export default function PreviewPanel({ settings }: PreviewPanelProps) {
  const [font, setFont] = useState<opentype.Font | null>(null);
  const [fontError, setFontError] = useState("");
  const [showGrid, setShowGrid] = useState(false);
  const [logoDataURL, setLogoDataURL] = useState<string | null>(null);
  const [svgCode, setSvgCode] = useState("");
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(FONT_URL)
      .then((response) => response.arrayBuffer())
      .then((buffer) => setFont(opentype.parse(buffer)))
      .catch((error) => setFontError("Could not load font: " + error));
  }, []);

  const processLogoFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        setLogoDataURL(null);
        return;
      }
      const dataURL = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target!.result as string);
        reader.readAsDataURL(file);
      });
      const processed = await processUploadedImage(dataURL, settings.rbSplit);
      setLogoDataURL(processed);
    },
    [settings.rbSplit],
  );

  useEffect(() => {
    processLogoFile(settings.logoFile);
  }, [settings.logoFile, processLogoFile]);

  useEffect(() => {
    const svg = buildSVG(font, settings, logoDataURL, showGrid);
    setSvgCode(svg);
    if (previewRef.current) {
      previewRef.current.innerHTML = svg;
    }
  }, [font, settings, logoDataURL, showGrid]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "antifa_logo.svg";
    link.click();
    URL.revokeObjectURL(url);
  }, [svgCode]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(svgCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [svgCode]);

  return (
    <div className="pannel preview-box bg-darkgrey rounded-xl p-6 border border-half-darkgrey">
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 900,
          marginBottom: "0.5rem",
          color: "#ccc",
        }}
      >
        Live Preview
      </h2>

      {fontError && (
        <p
          style={{
            fontSize: "0.75rem",
            color: "#cc0000",
            marginBottom: "0.5rem",
          }}
        >
          {fontError}
        </p>
      )}

      <label className="grid-toggle">
        <input
          type="checkbox"
          checked={showGrid}
          onChange={(e) => setShowGrid(e.target.checked)}
        />
        Show alignment grid
      </label>

      <div
        ref={previewRef}
        role="img"
        aria-label="Antifascist logo preview"
        style={{
          maxWidth: "100%",
          borderRadius: "8px",
          background: "#fff",
          maxHeight: "500px",
        }}
      />

      <details className="howto">
        <summary>How to use your logo</summary>
        <ul>
          <li>
            <strong>Print stickers</strong> - Export as SVG and upload to a
            sticker service like StickerApp or StickerMule. The solid black/red
            design works great at small sizes.
          </li>
          <li>
            <strong>Social media profile picture</strong> - Crop the logo to a
            square and resize to 400x400. The high-contrast colors keep it
            legible even as a small avatar.
          </li>
          <li>
            <strong>Flyers &amp; posters</strong> - Download the SVG and place
            it on your flyer layout. The vector format scales to any size
            without losing quality.
          </li>
          <li>
            <strong>Merch (t-shirts, patches)</strong> - Convert the SVG to a
            single-color cut file for screen printing or embroidery. Ask your
            printer for their preferred format.
          </li>
          <li>
            <strong>Digital banners</strong> - The SVG works directly on
            websites and forums. Upload it as-is, no conversion needed.
          </li>
        </ul>
      </details>

      <div className="actions">
        <button className="btn-primary" onClick={handleDownload}>
          Download SVG
        </button>
        <button className="btn-secondary" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>

      <textarea readOnly value={svgCode} />
    </div>
  );
}
