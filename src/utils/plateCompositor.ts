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
 * Cleanly erases the old plate contents (both old plate number and expiration date)
 * within the plate's inner rectangle, without touching the black dudukan frame,
 * the outer bevel, or the vehicle body.
 *
 * Fills the plate surface with the authentic metallic gradient of the plate and
 * subtle camera sensor grain so the plate looks 100% natural, clean, and ready for new text.
 */
function eraseOldPlateContent(
  ctx: CanvasRenderingContext2D,
  inner: PlateInnerZone,
  origW: number,
  origH: number
) {
  const cx = (inner.cx / 100) * origW;
  const cy = (inner.cy / 100) * origH;
  const w = Math.round((inner.width / 100) * origW);
  const h = Math.round((inner.height / 100) * origH);

  if (w <= 0 || h <= 0) return;

  ctx.save();
  ctx.translate(cx, cy);

  if (inner.angle) {
    ctx.rotate((inner.angle * Math.PI) / 180);
  }
  if (inner.skewY) {
    ctx.transform(1, inner.skewY, 0, 1, 0, 0);
  }

  // Draw authentic metal plate gradient from top to bottom
  const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  grad.addColorStop(0, inner.topColor);
  grad.addColorStop(1, inner.botColor);

  ctx.fillStyle = grad;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  ctx.restore();

  // Apply subtle camera sensor ISO noise across the erased rectangle
  // to perfectly match the photo's natural grain structure
  const rx = Math.max(0, Math.round(cx - w / 2));
  const ry = Math.max(0, Math.round(cy - h / 2));
  const rw = Math.min(origW - rx, w);
  const rh = Math.min(origH - ry, h);

  if (rw > 0 && rh > 0) {
    const imgData = ctx.getImageData(rx, ry, rw, rh);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 4;
      data[i] = Math.min(255, Math.max(0, data[i] + grain));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
    }
    ctx.putImageData(imgData, rx, ry);
  }
}

/**
 * Stamps the new license plate text onto the cleanly erased plate surface
 * using authentic Indonesian TNKB die-pressed font geometry.
 */
function stampNewPlateContent(
  ctx: CanvasRenderingContext2D,
  inner: PlateInnerZone,
  origW: number,
  origH: number,
  plateText: string,
  plateExp: string
) {
  const cx = (inner.cx / 100) * origW;
  const cy = (inner.cy / 100) * origH;
  const targetW = (inner.width / 100) * origW;

  const charHeight = inner.charHeightPx;
  const groups = parseIndoPlateGroups(plateText);

  // Setup authentic plate font
  const fontFam = '"CharlesWrightPlate", "MandatoryPlate", "PlatNomor", sans-serif';
  ctx.font = `bold ${charHeight}px ${fontFam}`;
  ctx.textBaseline = 'middle';

  // Spacing metrics matching Indonesian plate standards:
  // - inter-group gap: ~55% of charHeight (wide spacing between e.g. M, 4, M)
  // - intra-group gap: ~12% of charHeight (tight spacing between digits)
  const intraGroupGap = Math.max(1, Math.round(charHeight * 0.12));
  const interGroupGap = Math.max(4, Math.round(charHeight * 0.55));

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
      const w = ctx.measureText(ch).width;
      chars.push({ char: ch, width: w });
      grpW += w;
      if (i < grp.length - 1) grpW += intraGroupGap;
    }
    groupLayouts.push({ chars, width: grpW });
    totalContentWidth += grpW;
    if (gIdx < groups.length - 1) totalContentWidth += interGroupGap;
  });

  // Calculate condense scale if text exceeds available plate width
  const maxAllowedWidth = targetW * 0.94;
  const scaleX = totalContentWidth > maxAllowedWidth ? maxAllowedWidth / totalContentWidth : 1.0;

  ctx.save();
  ctx.translate(cx, cy);

  if (inner.angle) {
    ctx.rotate((inner.angle * Math.PI) / 180);
  }
  if (inner.skewY) {
    ctx.transform(1, inner.skewY, 0, 1, 0, 0);
  }

  ctx.scale(scaleX, 1.0);

  // 1. Draw Main Plate Characters
  // Solid stamped enamel paint matching original photo color
  ctx.fillStyle = inner.textColor;

  let curX = -totalContentWidth / 2;
  const mainY = inner.mainOffsetYPx;

  groupLayouts.forEach((grp, gIdx) => {
    grp.chars.forEach((cItem, cIdx) => {
      ctx.fillText(cItem.char, curX, mainY);
      curX += cItem.width;
      if (cIdx < grp.chars.length - 1) curX += intraGroupGap;
    });
    if (gIdx < groupLayouts.length - 1) curX += interGroupGap;
  });

  // 2. Draw Expiration Date (e.g. "04·28") centered under plate number
  if (plateExp && plateExp.trim()) {
    ctx.font = `bold ${inner.expHeightPx}px ${fontFam}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(plateExp.trim(), 0, inner.expOffsetYPx);
  }

  ctx.restore();
}

/**
 * Draws a professional, discreet simulation badge: [ SIMULASI VISUAL / MOCKUP ]
 * to clearly denote that the image is a visual simulation.
 */
function drawSimulationWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const badgeText = 'SIMULASI VISUAL / MOCKUP';
  const fontSize = Math.max(10, Math.round(height * 0.013));
  ctx.save();
  ctx.font = `700 ${fontSize}px "Segoe UI", Roboto, -apple-system, sans-serif`;

  const textMetrics = ctx.measureText(badgeText);
  const padX = fontSize * 0.8;
  const padY = fontSize * 0.45;
  const badgeW = textMetrics.width + padX * 2;
  const badgeH = fontSize + padY * 2;

  const posX = width - badgeW - Math.round(width * 0.015);
  const posY = height - badgeH - Math.round(height * 0.015);

  ctx.fillStyle = 'rgba(7, 11, 20, 0.78)';
  ctx.beginPath();
  ctx.roundRect(posX, posY, badgeW, badgeH, 4);
  ctx.fill();

  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, posX + padX, posY + badgeH / 2);
  ctx.restore();
}

/**
 * Composite a single vehicle's license plate:
 * 1. Cleanly erases the old plate content inside the black border.
 * 2. Stamps the new characters using exact Indonesian TNKB font geometry.
 * 3. Keeps 100% of all other pixels (bumper, frame, bolts, wheels, background) untouched!
 * 4. Adds simulation watermark.
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

  // 4. STEP 1: Hapus isi plat nomor yang lama (cleanly erase old plate content)
  eraseOldPlateContent(ctx, vehicle.plateInner, origW, origH);

  // 5. STEP 2: Masukkan isi plat nomor baru dari inputan (stamp new plate content)
  stampNewPlateContent(
    ctx,
    vehicle.plateInner,
    origW,
    origH,
    plateText,
    plateExp
  );

  // 6. Handle floor reflection if present (e.g. car-3 on shiny green floor)
  if (vehicle.plateInner.reflectionZone) {
    const rZone = vehicle.plateInner.reflectionZone;
    const rcx = (rZone.cx / 100) * origW;
    const rcy = (rZone.cy / 100) * origH;
    const rw = Math.round((rZone.width / 100) * origW);
    const rh = Math.round((rZone.height / 100) * origH);

    ctx.save();
    ctx.translate(rcx, rcy);
    ctx.scale(0.85, -0.85); // Vertically inverted for reflection

    // Clean reflection patch
    const rGrad = ctx.createLinearGradient(0, -rh / 2, 0, rh / 2);
    rGrad.addColorStop(0, rZone.topColor);
    rGrad.addColorStop(1, rZone.botColor);
    ctx.fillStyle = rGrad;
    ctx.fillRect(-rw / 2, -rh / 2, rw, rh);

    // Subtle blurred reflected text
    ctx.font = `bold ${rZone.charHeightPx}px "CharlesWrightPlate", "MandatoryPlate", sans-serif`;
    ctx.fillStyle = rZone.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.55;
    ctx.filter = 'blur(1.2px)';
    ctx.fillText(plateText.trim().toUpperCase(), 0, 0);
    ctx.restore();
  }

  // 7. Add simulation watermark for legal compliance
  drawSimulationWatermark(ctx, origW, origH);

  // 8. Output high-resolution data URL and Blob
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
