/**
 * The reference avatar photo is a JPEG with a solid black backdrop (JPEG
 * has no alpha channel). Rather than let that black square show up as a
 * hard-edged box on the lesson's cream background, we chroma-key it out at
 * load time.
 *
 * A naive "make every near-black pixel transparent" pass is wrong here:
 * the character illustration's own line art (eyebrows, nose, mouth, hair
 * strokes) is drawn in the same near-black color, so thresholding every
 * pixel independently erases that line art too and leaves a ghostly gray
 * anti-aliasing halo where solid black should be. Instead we flood-fill
 * from the image border through connected near-black pixels only, so just
 * the background (and any black that touches it) is keyed out while
 * interior line art stays intact.
 */
function floodFillBackgroundAlpha(imageData: ImageData, blackThreshold: number): void {
  const { data, width, height } = imageData;
  const isDark = (x: number, y: number): boolean => {
    const i = (y * width + x) * 4;
    const r = data[i] ?? 255;
    const g = data[i + 1] ?? 255;
    const b = data[i + 2] ?? 255;
    return r < blackThreshold && g < blackThreshold && b < blackThreshold;
  };

  const visited = new Uint8Array(width * height);
  const queue: number[] = [];

  const enqueueIfDark = (x: number, y: number): void => {
    const index = y * width + x;
    if (visited[index] === 0 && isDark(x, y)) {
      visited[index] = 1;
      queue.push(index);
    }
  };

  for (let x = 0; x < width; x += 1) {
    enqueueIfDark(x, 0);
    enqueueIfDark(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueueIfDark(0, y);
    enqueueIfDark(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const index = queue[head] ?? 0;
    head += 1;
    const x = index % width;
    const y = Math.floor(index / width);
    data[index * 4 + 3] = 0;

    if (x > 0) { enqueueIfDark(x - 1, y); }
    if (x < width - 1) { enqueueIfDark(x + 1, y); }
    if (y > 0) { enqueueIfDark(x, y - 1); }
    if (y < height - 1) { enqueueIfDark(x, y + 1); }
  }
}

export function loadChromaKeyedImage(
  url: string,
  blackThreshold = 40,
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const context = canvas.getContext('2d');
      if (context === null) {
        reject(new Error('Canvas 2D context is unavailable.'));
        return;
      }
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      floodFillBackgroundAlpha(imageData, blackThreshold);
      context.putImageData(imageData, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}
