// sharp rasterizes an SVG at its declared size: clamp it so a crafted file can't blow up memory.
export function boundedSvg(svg: string): string | null {
  const root = svg.match(/<svg\b[^>]*>/i)?.[0];
  if (!root) return null;
  const bounded = root
    .replace(/\s(?:width|height)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/^<svg/i, '<svg width="1024" height="1024"');
  return svg.replace(root, () => bounded);
}
