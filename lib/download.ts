export type DownloadFormat = "png" | "jpeg" | "svg";

const RASTER_SIZE = 1024;

function loadSvgImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const sizedSvg = svg.replace(
      /(<svg[^>]*?)width="\d+" height="\d+"/,
      `$1width="${RASTER_SIZE}" height="${RASTER_SIZE}"`,
    );
    const objectUrl = URL.createObjectURL(
      new Blob([sizedSvg], { type: "image/svg+xml" }),
    );
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not rasterize the SVG"));
    };
    image.src = objectUrl;
  });
}

export async function rasterizeSvg(
  svg: string,
  format: "png" | "jpeg",
): Promise<Blob> {
  const image = await loadSvgImage(svg);
  const canvas = document.createElement("canvas");
  canvas.width = RASTER_SIZE;
  canvas.height = RASTER_SIZE;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not supported");

  if (format === "jpeg") {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, RASTER_SIZE, RASTER_SIZE);
  }
  context.drawImage(image, 0, 0, RASTER_SIZE, RASTER_SIZE);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not encode the image")),
      `image/${format}`,
      format === "jpeg" ? 0.95 : undefined,
    );
  });
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
