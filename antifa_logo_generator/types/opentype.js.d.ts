declare module "opentype.js" {
  interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isEmpty(): boolean;
    addPoint(x: number, y: number): void;
    addX(x: number): void;
    addY(y: number): void;
  }

  interface PathCommand {
    type: string;
    x?: number;
    y?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
  }

  class Path {
    commands: PathCommand[];
    fill: string | null;
    stroke: string | null;
    strokeWidth: number;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    bezierCurveTo(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x: number,
      y: number,
    ): void;
    quadraticCurveTo(
      x1: number,
      y1: number,
      x: number,
      y: number,
    ): void;
    close(): void;
    getBoundingBox(): BoundingBox;
    toPathData(decimalPlaces?: number): string;
    toSVG(decimalPlaces?: number): string;
  }

  class Glyph {
    name: string;
    unicode: number;
    advanceWidth: number;
    getPath(x: number, y: number, fontSize: number): Path;
  }

  class Font {
    familyName: string;
    styleName: string;
    unitsPerEm: number;
    ascender: number;
    descender: number;
    glyphs: Glyph[];
    charToGlyph(char: string): Glyph;
    getPath(
      text: string,
      x: number,
      y: number,
      fontSize: number,
      options?: object,
    ): Path;
  }

  function parse(buffer: ArrayBuffer): Font;
}
