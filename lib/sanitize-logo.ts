import sanitizeHtml from "sanitize-html";
//this was actually made with ai because why the fuck is it so long to do
const TAGS = [
  "svg",
  "g",
  "defs",
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "textPath",
  "title",
  "desc",
  "image",
  "linearGradient",
  "radialGradient",
  "stop",
  "clipPath",
  "mask",
  "use",
];

const PAINT = [
  "fill",
  "fill-opacity",
  "fill-rule",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "opacity",
  "transform",
  "clip-path",
  "mask",
  "filter",
  "id",
];

const ATTRS: Record<string, string[]> = {
  "*": PAINT,
  svg: [
    ...PAINT,
    "xmlns",
    "viewBox",
    "width",
    "height",
    "preserveAspectRatio",
    "version",
  ],
  path: [...PAINT, "d", "pathLength"],
  circle: [...PAINT, "cx", "cy", "r"],
  ellipse: [...PAINT, "cx", "cy", "rx", "ry"],
  rect: [...PAINT, "x", "y", "width", "height", "rx", "ry"],
  line: [...PAINT, "x1", "y1", "x2", "y2"],
  polyline: [...PAINT, "points"],
  polygon: [...PAINT, "points"],
  image: [
    ...PAINT,
    "href",
    "xlink:href",
    "x",
    "y",
    "width",
    "height",
    "preserveAspectRatio",
  ],
  use: [...PAINT, "href", "xlink:href", "x", "y"],
  text: [
    ...PAINT,
    "x",
    "y",
    "dx",
    "dy",
    "font-family",
    "font-size",
    "font-weight",
    "text-anchor",
    "letter-spacing",
    "dominant-baseline",
  ],
  tspan: [
    ...PAINT,
    "x",
    "y",
    "dx",
    "dy",
    "font-family",
    "font-size",
    "font-weight",
    "text-anchor",
    "letter-spacing",
    "dominant-baseline",
  ],
  textPath: [...PAINT, "href", "xlink:href", "startOffset"],
  linearGradient: [
    ...PAINT,
    "x1",
    "y1",
    "x2",
    "y2",
    "gradientUnits",
    "gradientTransform",
    "spreadMethod",
  ],
  radialGradient: [
    ...PAINT,
    "cx",
    "cy",
    "r",
    "fx",
    "fy",
    "gradientUnits",
    "gradientTransform",
    "spreadMethod",
  ],
  stop: [...PAINT, "offset", "stop-color", "stop-opacity"],
  clipPath: [...PAINT, "clipPathUnits"],
  mask: [...PAINT, "maskUnits", "maskContentUnits"],
};

const SAFE_HREF = /^(?:#|data:image\/(?:png|jpe?g|webp|gif);base64,)/i;

export function sanitizeLogoSvg(svg: string): string | null {
  if (/<!DOCTYPE|<!ENTITY/i.test(svg)) return null;

  const clean = sanitizeHtml(svg, {
    allowedTags: TAGS,
    allowedAttributes: ATTRS,
    allowedSchemes: [],
    allowedSchemesByTag: { image: ["data"], use: [], textPath: [] },
    allowProtocolRelative: false,
    parser: {
      lowerCaseAttributeNames: false,
      lowerCaseTags: false,
      recognizeSelfClosing: true,
    },
    transformTags: {
      "*": (tagName, attribs) => {
        const safe: Record<string, string> = {};
        for (const [name, value] of Object.entries(attribs)) {
          const isHref = name === "href" || name === "xlink:href";
          if (isHref && !SAFE_HREF.test(value)) continue;
          if (
            !isHref &&
            /url\(/i.test(value) &&
            !/url\(\s*['"]?#/i.test(value)
          ) {
            continue;
          }
          safe[name] = value;
        }
        return { tagName, attribs: safe };
      },
    },
  }).trim();

  return clean.startsWith("<svg") ? clean : null;
}
