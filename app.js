import opentype from "opentype.js";

const FLAG_RED =
  "M125.667,122.917c0,0,28,33.083,89.25,34.333c61.251,1.25,95.917-37.917,130.917-33.333s63,43.333,77.75,50.167L333,425.75c0,0-1.833,1.334-11,4.667s-11.333,4.333-11.333,4.333l40.25-122.917c0,0-38.75-32.687-73.75-35c-35.001-2.313-50.917,23.75-110.083,13.75C107.917,280.583,69.5,243.5,69.5,243.5s-1.415-21.067,14.5-59.833C99.914,144.902,125.667,122.917,125.667,122.917z";
const FLAG_BLACK =
  "M69.917,251.25c0,0,41.084,38.416,102.417,46.083c61.332,7.667,67.039-14.491,100.916-14.25c21.548,0.153,29.334,9.584,29.334,9.584l-53.506,149.67c0,0-4.18-0.044-10.092-0.692c-5.911-0.648-9.541-1.294-9.541-1.294L257,357.5c0,0-13.584-8.707-27.25-10.5c-13.668-1.793-21.042,3-46.5,2.5c-24.073-0.473-71.25-12.75-93.333-45.75S69.917,251.25,69.917,251.25z";

const $ = (id) => document.getElementById(id);

let font = null;

async function loadFont() {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.20/files/inter-latin-700-normal.woff",
    );
    font = opentype.parse(await res.arrayBuffer());
    render();
  } catch (err) {
    $("fontStatus").textContent = "Could not load font: " + err;
  }
}

function processImage(dataURL, splitPct, cb) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    let w = img.width, h = img.height;
    if (w === 0 || h === 0) { cb(dataURL); return; }
    const maxDim = 1024;
    if (w > maxDim || h > maxDim) {
      const r = Math.min(maxDim / w, maxDim / h);
      w = Math.round(w * r);
      h = Math.round(h * r);
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const splitX = Math.round((splitPct / 100) * w);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] === 0) continue;
        if (x < splitX) {
          data[i] = 0xcc;
          data[i + 1] = 0;
          data[i + 2] = 0;
        } else {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    cb(canvas.toDataURL("image/png"));
  };
  img.onerror = () => cb(dataURL);
  img.src = dataURL;
}

function textOnArc(text, cy, sweep, fontSize) {
  if (!font || !text) return "";

  const R = 210,
    cx = 250;
  const scale = fontSize / font.unitsPerEm;
  const dir = sweep === 1 ? 1 : -1;
  const apex = sweep === 1 ? -Math.PI / 2 : Math.PI / 2;

  const glyphs = [...text].map((ch) => font.charToGlyph(ch));
  const totalWidth = glyphs.reduce(
    (sum, g) => sum + (g.advanceWidth || 500) * scale,
    0,
  );

  let cursor = -totalWidth / 2;
  let out = "";

  for (const g of glyphs) {
    const w = (g.advanceWidth || 500) * scale;
    const mid = cursor + w / 2;
    const t = apex + dir * (mid / R);
    const x = cx + R * Math.cos(t);
    const y = cy + R * Math.sin(t);
    const rotationDeg = (t * 180) / Math.PI + dir * 90;

    const d = g.getPath(0, 0, fontSize).toPathData(2);
    out += `<path d="${d}" transform="translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${rotationDeg.toFixed(2)}) translate(${(-w / 2).toFixed(2)},0)"/>`;

    cursor += w;
  }

  return out;
}

function buildSVG({
  topText,
  bottomText,
  fontSize,
  topY,
  botY,
  logoDataURL,
  logoScale,
  logoX,
  logoY,
}) {
  let centerGroup;

  if (logoDataURL) {
    const scale = logoScale / 100;
    centerGroup = `<g transform="translate(${logoX},${logoY}) translate(256,256) scale(${scale}) translate(-256,-256)">
      <image href="${logoDataURL}" width="512" height="512" preserveAspectRatio="xMidYMid meet"/>
    </g>`;
  } else {
    centerGroup = `<g transform="translate(-9,-2)">
      <path d="${FLAG_RED}" fill="#cc0000"/>
      <path d="${FLAG_BLACK}" fill="#000"/>
    </g>`;
  }

  const topPaths = textOnArc(topText, topY, 1, fontSize);
  const botPaths = textOnArc(bottomText, botY, 0, fontSize);

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <circle cx="250" cy="250" r="225" stroke="#000" fill="#fff" stroke-width="50"/>
  ${centerGroup}
  <g fill="#fff">${topPaths}</g>
  <g fill="#fff">${botPaths}</g>
</svg>`;
}

function currentParams(cb) {
  const params = {
    topText: $("topText").value || " ",
    bottomText: $("bottomText").value || " ",
    fontSize: +$("fontSize").value,
    topY: +$("topY").value,
    botY: +$("botY").value,
    splitPct: +$("splitPos").value,
    logoScale: +$("logoSz").value,
    logoX: +$("logoX").value,
    logoY: +$("logoY").value,
    logoDataURL: null,
  };

  $("sizeLabel").textContent = params.fontSize + "px";
  $("topYLabel").textContent = params.topY;
  $("botYLabel").textContent = params.botY;
  $("splitLabel").textContent = params.splitPct + "%";
  $("logoSzLabel").textContent = params.logoScale + "%";
  $("logoXLabel").textContent = params.logoX;
  $("logoYLabel").textContent = params.logoY;

  const file = $("logoUpload").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      processImage(e.target.result, params.splitPct, (processed) => {
        params.logoDataURL = processed;
        cb(params);
      });
    };
    reader.readAsDataURL(file);
  } else {
    cb(params);
  }
}

function render() {
  currentParams((params) => {
    const svg = buildSVG(params);
    $("svgCode").value = svg;
    $("preview").innerHTML = svg;
  });
}

function download() {
  currentParams((params) => {
    const svg = buildSVG(params);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "antifa_logo.svg";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function copyCode() {
  currentParams((params) => {
    navigator.clipboard.writeText(buildSVG(params)).then(() => {
      const btn = $("copyBtn");
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = original), 1500);
    });
  });
}

[
  "topText",
  "bottomText",
  "fontSize",
  "topY",
  "botY",
  "splitPos",
  "logoSz",
  "logoX",
  "logoY",
].forEach((id) => $(id).addEventListener("input", render));
$("logoUpload").addEventListener("change", render);
$("downloadBtn").addEventListener("click", download);
$("copyBtn").addEventListener("click", copyCode);

loadFont();
