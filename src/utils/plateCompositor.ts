import { VehicleAsset, PlateInnerZone } from '../data/vehicles';

export interface CompositeItemResult {
  vehicle: VehicleAsset;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  index: number; // 1 to 4
}

/**
 * Loads an image from URL into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Gagal memuat foto referensi: ${src}`));
    img.src = src;
  });
}

let fontsLoadedPromise: Promise<void> | null = null;

/**
 * Ensures the authentic Indonesian vehicle license plate fonts are fully loaded
 * into the browser and ready for Canvas 2D rendering.
 */
export function ensurePlateFontLoaded(): Promise<void> {
  if (fontsLoadedPromise) return fontsLoadedPromise;

  fontsLoadedPromise = (async () => {
    if (typeof window === 'undefined' || !document.fonts) return;

    try {
      const cwFont = new FontFace(
        'CharlesWrightPlate',
        'url(/fonts/CharlesWright.otf)',
        { weight: 'bold', style: 'normal' }
      );
      const loadedCW = await cwFont.load();
      document.fonts.add(loadedCW);

      const mandFont = new FontFace(
        'MandatoryPlate',
        'url(/fonts/Mandatory.otf)',
        { weight: 'normal', style: 'normal' }
      );
      const loadedMand = await mandFont.load();
      document.fonts.add(loadedMand);

      const pnFont = new FontFace(
        'PlatNomor',
        'url(/fonts/PlatNomor.ttf)',
        { weight: 'normal', style: 'normal' }
      );
      const loadedPN = await pnFont.load();
      document.fonts.add(loadedPN);

      await document.fonts.ready;
    } catch (e) {
      console.warn('Font loading fallback notice:', e);
    }
  })();

  return fontsLoadedPromise;
}

/**
 * Parses user input into standard Indonesian plate groups:
 * e.g. "M 4 M" -> ["M", "4", "M"]
 * e.g. "B 9781 UXI" -> ["B", "9781", "UXI"]
 * e.g. "M4M" -> ["M", "4", "M"]
 * e.g. "B1234ABC" -> ["B", "1234", "ABC"]
 */
export function parseIndoPlateGroups(input: string): string[] {
  const clean = input.trim().toUpperCase().replace(/\s+/g, ' ');
  const parts = clean.split(' ');
  if (parts.length >= 2) {
    return parts;
  }

  // If user typed without spaces like "M4M" or "B1234ABC"
  const match = clean.match(/^([A-Z]{1,2})\s*([0-9]{1,4})\s*([A-Z]{0,3})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean);
  }

  return [clean];
}

/**
 * Renders the complete replacement license plate (clean metallic background matching local
 * ambient light, top overhang recess shadow, stamped charcoal characters, subtle border,
 * and uniform sensor grain across both plate and ink) onto an offscreen supersampled canvas
 * and composites it onto the master photo using the exact perspective transform.
 */
function renderNaturalPlate(
  ctx: CanvasRenderingContext2D,
  inner: PlateInnerZone,
  origW: number,
  origH: number,
  plateText: string,
  plateExp: string
) {
  const cx = (inner.cx / 100) * origW;
  const cy = (inner.cy / 100) * origH;
  const w = Math.round((inner.width / 100) * origW);
  const h = Math.round((inner.height / 100) * origH);

  if (w <= 0 || h <= 0) return;

  // 2x supersampling offscreen canvas for crisp yet naturally anti-aliased edges
  const ss = 2;
  const pw = w * ss;
  const ph = h * ss;

  const plateCanvas = document.createElement('canvas');
  plateCanvas.width = pw;
  plateCanvas.height = ph;
  const pCtx = plateCanvas.getContext('2d');
  if (!pCtx) return;

  // Clip to subtle rounded corners matching real stamped Indonesian plates
  const cornerR = Math.max(2, Math.round(ph * 0.08));
  pCtx.beginPath();
  pCtx.roundRect(0, 0, pw, ph, cornerR);
  pCtx.clip();

  // 1. Base metallic surface gradient matched to local photo lighting
  const grad = pCtx.createLinearGradient(0, 0, 0, ph);
  grad.addColorStop(0, inner.topColor);
  grad.addColorStop(1, inner.botColor);
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, pw, ph);

  // 2. Subtle recessed ambient top overhang shadow & gentle side vignette
  const topShadow = pCtx.createLinearGradient(0, 0, 0, ph * 0.28);
  topShadow.addColorStop(0, 'rgba(10, 12, 16, 0.25)');
  topShadow.addColorStop(1, 'rgba(10, 12, 16, 0)');
  pCtx.fillStyle = topShadow;
  pCtx.fillRect(0, 0, pw, ph * 0.28);

  const botShadow = pCtx.createLinearGradient(0, ph * 0.82, 0, ph);
  botShadow.addColorStop(0, 'rgba(10, 12, 16, 0)');
  botShadow.addColorStop(1, 'rgba(10, 12, 16, 0.16)');
  pCtx.fillStyle = botShadow;
  pCtx.fillRect(0, ph * 0.82, pw, ph * 0.18);

  // Subtle horizontal metallic sheen
  const sheen = pCtx.createLinearGradient(0, 0, pw, 0);
  sheen.addColorStop(0, 'rgba(0, 0, 0, 0.06)');
  sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.04)');
  sheen.addColorStop(0.65, 'rgba(255, 255, 255, 0.02)');
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0.07)');
  pCtx.fillStyle = sheen;
  pCtx.fillRect(0, 0, pw, ph);

  // 3. Stamp Indonesian TNKB characters in natural camera-matched charcoal ink
  const charHeight = inner.charHeightPx * ss;
  const groups = parseIndoPlateGroups(plateText);
  const fontFam = '"CharlesWrightPlate", "MandatoryPlate", "PlatNomor", sans-serif';

  pCtx.font = `bold ${charHeight}px ${fontFam}`;
  pCtx.textBaseline = 'middle';

  const intraGroupGap = Math.max(2, Math.round(charHeight * 0.12));
  const interGroupGap = Math.max(8, Math.round(charHeight * 0.55));

  interface CharLayout {
    char: string;
    width: number;
  }

  interface GroupLayout {
    chars: CharLayout[];
    width: number;
  }

  const groupLayouts: GroupLayout[] = [];
  let totalContentWidth = 0;

  groups.forEach((grp, gIdx) => {
    let grpW = 0;
    const chars: CharLayout[] = [];
    for (let i = 0; i < grp.length; i++) {
      const ch = grp[i];
      const cw = pCtx.measureText(ch).width;
      chars.push({ char: ch, width: cw });
      grpW += cw;
      if (i < grp.length - 1) grpW += intraGroupGap;
    }
    groupLayouts.push({ chars, width: grpW });
    totalContentWidth += grpW;
    if (gIdx < groups.length - 1) totalContentWidth += interGroupGap;
  });

  const maxAllowedWidth = pw * 0.90;
  const scaleX = totalContentWidth > maxAllowedWidth ? maxAllowedWidth / totalContentWidth : 1.0;

  pCtx.save();
  pCtx.translate(pw / 2, ph / 2);

  // Main characters
  pCtx.save();
  pCtx.scale(scaleX, 1.0);
  pCtx.fillStyle = inner.textColor;
  pCtx.globalAlpha = 0.91;
  pCtx.shadowColor = 'rgba(0, 0, 0, 0.16)';
  pCtx.shadowBlur = 1.2;
  pCtx.shadowOffsetY = 0.6;
  pCtx.textAlign = 'left';
  pCtx.textBaseline = 'middle';

  let curX = -totalContentWidth / 2;
  const mainY = inner.mainOffsetYPx * ss;

  groupLayouts.forEach((grp, gIdx) => {
    grp.chars.forEach((cItem, cIdx) => {
      pCtx.fillText(cItem.char, curX, mainY);
      curX += cItem.width;
      if (cIdx < grp.chars.length - 1) curX += intraGroupGap;
    });
    if (gIdx < groupLayouts.length - 1) curX += interGroupGap;
  });
  pCtx.restore();

  // Expiration date ("04·28")
  if (plateExp && plateExp.trim()) {
    pCtx.save();
    pCtx.font = `bold ${inner.expHeightPx * ss}px ${fontFam}`;
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    pCtx.fillStyle = inner.textColor;
    pCtx.globalAlpha = 0.82;
    pCtx.fillText(plateExp.trim(), 0, inner.expOffsetYPx * ss);
    pCtx.restore();
  }

  pCtx.restore();

  // 4. Subtle recessed plate edge hairline (soft, never harsh digital outline)
  pCtx.strokeStyle = 'rgba(22, 25, 30, 0.42)';
  pCtx.lineWidth = ss;
  pCtx.beginPath();
  pCtx.roundRect(0.5, 0.5, pw - 1, ph - 1, cornerR);
  pCtx.stroke();

  // 5. Apply uniform ISO camera grain across BOTH plate metal and stamped characters
  const imgData = pCtx.getImageData(0, 0, pw, ph);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const grain = (Math.random() - 0.5) * 6;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  pCtx.putImageData(imgData, 0, 0);

  // 6. Composite onto master image with perspective transform & slight optical softness
  ctx.save();
  ctx.translate(cx, cy);

  if (inner.angle) {
    ctx.rotate((inner.angle * Math.PI) / 180);
  }
  if (inner.skewY) {
    ctx.transform(1, inner.skewY, 0, 1, 0, 0);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if ('filter' in ctx) {
    ctx.filter = 'blur(0.32px)';
  }
  ctx.drawImage(plateCanvas, -w / 2, -h / 2, w, h);
  ctx.restore();
}

/**
 * Composite a single vehicle's license plate:
 * 1. Cleanly replaces the old plate content inside the holder.
 * 2. Stamps the new characters with local ambient lighting, overhang shadow, and grain.
 * 3. Keeps 100% of all other pixels (bumper, frame, bolts, wheels, background) untouched.
 */
export async function compositeSingleVehicle(
  vehicle: VehicleAsset,
  plateText: string,
  plateExp: string = '04·28',
  index: number = 1
): Promise<CompositeItemResult> {
  await ensurePlateFontLoaded();

  // 1. Load pristine original reference photograph
  const origImg = await loadImage(vehicle.filename);
  const origW = origImg.naturalWidth || origImg.width;
  const origH = origImg.naturalHeight || origImg.height;

  // 2. Create master canvas matching exact native resolution
  const canvas = document.createElement('canvas');
  canvas.width = origW;
  canvas.height = origH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not create canvas context');

  // 3. Draw 100% of the pristine original photograph
  ctx.drawImage(origImg, 0, 0, origW, origH);

  // 4. Render natural lighting-matched plate + stamped characters
  renderNaturalPlate(
    ctx,
    vehicle.plateInner,
    origW,
    origH,
    plateText,
    plateExp
  );

  // 5. Output high-resolution data URL and Blob (tanpa tag simulasi/mockup)
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), 'image/png', 1.0);
  });

  return {
    vehicle,
    dataUrl,
    blob,
    width: origW,
    height: origH,
    index,
  };
}

/**
 * Composite all 4 vehicles of the chosen category simultaneously.
 */
export async function compositeBatchVehicles(
  vehicles: VehicleAsset[],
  plateText: string,
  plateExp: string = '04·28'
): Promise<CompositeItemResult[]> {
  const promises = vehicles.map((v, i) => compositeSingleVehicle(v, plateText, plateExp, i + 1));
  return Promise.all(promises);
}

/**
 * DIRECT 4-IMAGE DOWNLOAD (NO ZIP):
 * Downloads all 4 images directly to user's device named:
 * {plat nomor}-1.png to {plat nomor}-4.png
 */
export async function downloadAllFourDirectly(
  items: CompositeItemResult[],
  plateText: string
): Promise<void> {
  const baseName = plateText.trim();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const filename = `${baseName}-${i + 1}.png`;

    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 180ms delay between downloads so the browser initiates all 4 downloads smoothly without popup block
    if (i < items.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
  }
}

/**
 * Downloads a single image directly with name "{plat nomor}-{index}.png".
 */
export function downloadSingleImage(
  item: CompositeItemResult,
  plateText: string,
  index: number
): void {
  const baseName = plateText.trim();
  const filename = `${baseName}-${index}.png`;
  const a = document.createElement('a');
  a.href = item.dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
