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
let platNomorLoaded = false;

/**
 * Ensures the authentic Indonesian vehicle license plate fonts are fully loaded
 * into the browser and ready for Canvas 2D rendering.
 */
export function ensurePlateFontLoaded(): Promise<void> {
  if (fontsLoadedPromise) return fontsLoadedPromise;

  fontsLoadedPromise = (async () => {
    if (typeof window === 'undefined' || !document.fonts) return;

    try {
      const pnFont = new FontFace(
        'PlatNomor',
        'url(/fonts/PlatNomor.ttf)',
        { weight: 'normal', style: 'normal' }
      );
      const loadedPN = await pnFont.load();
      document.fonts.add(loadedPN);
      platNomorLoaded = true;

      const mandFont = new FontFace(
        'MandatoryPlate',
        'url(/fonts/Mandatory.otf)',
        { weight: 'normal', style: 'normal' }
      );
      const loadedMand = await mandFont.load();
      document.fonts.add(loadedMand);

      const cwFont = new FontFace(
        'CharlesWrightPlate',
        'url(/fonts/CharlesWright.otf)',
        { weight: 'bold', style: 'normal' }
      );
      const loadedCW = await cwFont.load();
      document.fonts.add(loadedCW);

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
 * Converts digit '0' into uppercase 'O' when PlatNomor.ttf is active so zeroes match
 * authentic slashless Indonesian Korlantas stamped plates.
 */
function formatKorlantasGlyphs(text: string, usePlatNomor: boolean): string {
  if (!usePlatNomor) return text;
  return text.replace(/0/g, 'O');
}

/**
 * Draws rounded stroke + fill cleanly as a single uniform-opacity glyph shape.
 */
function drawStampedGlyph(
  ctx: CanvasRenderingContext2D,
  glyph: string,
  x: number,
  y: number,
  strokeWidth: number
) {
  if (strokeWidth > 0.25) {
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeText(glyph, x, y);
  }
  ctx.fillText(glyph, x, y);
}

/**
 * Renders the complete replacement license plate (clean metallic aluminum surface matched to local
 * ambient light, top overhang recess shadow, stamped 3D embossed Indonesian Korlantas characters,
 * balanced top/bottom margins, and uniform sensor grain across plate and ink) onto a supersampled
 * offscreen canvas and composites it onto the master photo using exact perspective transform.
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

  // 3x supersampling offscreen canvas for crisp, smooth embossed edges before optical blur
  const ss = 3;
  const pw = w * ss;
  const ph = h * ss;

  const plateCanvas = document.createElement('canvas');
  plateCanvas.width = pw;
  plateCanvas.height = ph;
  const pCtx = plateCanvas.getContext('2d');
  if (!pCtx) return;

  // Clip to subtle rounded corners matching real stamped Indonesian plates
  const cornerR = Math.max(3, Math.round(ph * 0.09));
  pCtx.beginPath();
  pCtx.roundRect(0, 0, pw, ph, cornerR);
  pCtx.clip();

  // 1. Base painted/anodized aluminum surface gradient matched to local photo lighting
  const grad = pCtx.createLinearGradient(0, 0, 0, ph);
  grad.addColorStop(0, inner.topColor);
  grad.addColorStop(0.55, inner.botColor);
  grad.addColorStop(1, inner.botColor);
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, pw, ph);

  // 2. Subtle recessed ambient top frame overhang shadow, side edge softness & metallic sheen
  const topShadow = pCtx.createLinearGradient(0, 0, 0, ph * 0.26);
  topShadow.addColorStop(0, 'rgba(10, 12, 16, 0.17)');
  topShadow.addColorStop(0.45, 'rgba(10, 12, 16, 0.05)');
  topShadow.addColorStop(1, 'rgba(10, 12, 16, 0)');
  pCtx.fillStyle = topShadow;
  pCtx.fillRect(0, 0, pw, ph * 0.26);

  const botShadow = pCtx.createLinearGradient(0, ph * 0.85, 0, ph);
  botShadow.addColorStop(0, 'rgba(10, 12, 16, 0)');
  botShadow.addColorStop(1, 'rgba(10, 12, 16, 0.09)');
  pCtx.fillStyle = botShadow;
  pCtx.fillRect(0, ph * 0.85, pw, ph * 0.15);

  const sheen = pCtx.createLinearGradient(0, 0, pw, 0);
  sheen.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
  sheen.addColorStop(0.08, 'rgba(255, 255, 255, 0.01)');
  sheen.addColorStop(0.38, 'rgba(255, 255, 255, 0.04)');
  sheen.addColorStop(0.68, 'rgba(255, 255, 255, 0.02)');
  sheen.addColorStop(0.92, 'rgba(0, 0, 0, 0.02)');
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0.06)');
  pCtx.fillStyle = sheen;
  pCtx.fillRect(0, 0, pw, ph);

  // Subtle recessed inner stamped plate border lip
  const lipInset = Math.max(1.5, ph * 0.032);
  pCtx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  pCtx.lineWidth = Math.max(1, ss * 0.55);
  pCtx.beginPath();
  pCtx.roundRect(lipInset, lipInset, pw - lipInset * 2, ph - lipInset * 2, Math.max(2, cornerR - lipInset));
  pCtx.stroke();

  // 3. Measure & Stamp Indonesian Korlantas TNKB characters
  const usePlatNomor =
    platNomorLoaded ||
    (typeof document !== 'undefined' && document.fonts
      ? document.fonts.check('20px "PlatNomor"')
      : false);
  const fontFam = '"PlatNomor", "MandatoryPlate", "CharlesWrightPlate", sans-serif';

  const trimmedExp = (plateExp || '').trim();
  const hasExp = trimmedExp.length > 0;

  // Authentic Indonesian Korlantas vertical proportions:
  // ~17.5% top margin, ~45% visual cap height, ~10% middle gap, ~16.5% expiry height, ~11% bottom margin
  const targetMainCapH = ph * (hasExp ? 0.45 : 0.53);
  const mainTopY = ph * (hasExp ? 0.175 : 0.235);

  // Calibrate true ink cap-height ratio using PlatNomor reference glyphs ('B8')
  const probeSize = 100;
  pCtx.font = `normal ${probeSize}px ${fontFam}`;
  pCtx.textBaseline = 'alphabetic';
  const probeMetrics = pCtx.measureText('B8');
  const probeInkH = Math.max(
    40,
    (probeMetrics.actualBoundingBoxAscent || 72) + (probeMetrics.actualBoundingBoxDescent || 0)
  );
  const inkRatio = probeInkH / probeSize;

  // Compensate slightly for rounded stroke thickening so outer inked edges fit exact vertical target
  const strokeThick = usePlatNomor ? Math.max(0.8, targetMainCapH * 0.048) : 0;
  const effectiveInnerCapH = Math.max(10, targetMainCapH - strokeThick);
  const mainFontSize = effectiveInnerCapH / inkRatio;

  pCtx.font = `normal ${mainFontSize}px ${fontFam}`;
  pCtx.textBaseline = 'alphabetic';
  const refMetrics = pCtx.measureText('B8');
  const refAscent = refMetrics.actualBoundingBoxAscent || effectiveInnerCapH;

  // Baseline Y placed so visual top of main characters (including half stroke) sits cleanly at mainTopY
  const mainBaselineY = mainTopY + strokeThick * 0.5 + refAscent;

  const groups = parseIndoPlateGroups(plateText).map((g) => formatKorlantasGlyphs(g, usePlatNomor));
  const totalChars = groups.reduce((acc, g) => acc + g.length, 0);

  // Subtle horizontal breadth factor for PlatNomor condensed geometry, plus natural Korean/Korlantas kerning
  const charAspectX = usePlatNomor ? 1.08 : 1.0;
  const intraGroupGap = Math.max(1.5, targetMainCapH * 0.13);
  const interGroupGap = Math.max(
    4,
    targetMainCapH * (totalChars <= 5 ? 0.56 : 0.46)
  );

  interface CharLayout {
    char: string;
    width: number;
  }
  interface GroupLayout {
    chars: CharLayout[];
    width: number;
  }

  const groupLayouts: GroupLayout[] = [];
  let totalRawWidth = 0;

  groups.forEach((grp, gIdx) => {
    let grpW = 0;
    const chars: CharLayout[] = [];
    for (let i = 0; i < grp.length; i++) {
      const ch = grp[i];
      const cw = pCtx.measureText(ch).width + strokeThick * 0.7;
      chars.push({ char: ch, width: cw });
      grpW += cw;
      if (i < grp.length - 1) grpW += intraGroupGap;
    }
    groupLayouts.push({ chars, width: grpW });
    totalRawWidth += grpW;
    if (gIdx < groups.length - 1) totalRawWidth += interGroupGap;
  });

  const maxAllowedWidth = pw * 0.85;
  const desiredScaledWidth = totalRawWidth * charAspectX;
  const scaleX = desiredScaledWidth > maxAllowedWidth
    ? maxAllowedWidth / totalRawWidth
    : charAspectX;

  // Expiration layout calculation (positioned in lower ~72.5% - 89% band)
  const targetExpCapH = ph * 0.165;
  const expTopY = ph * 0.725;
  const expStrokeThick = usePlatNomor ? Math.max(0.45, targetExpCapH * 0.055) : 0;
  const expFontSize = Math.max(6, (targetExpCapH - expStrokeThick) / inkRatio);
  const expAscent = expFontSize * inkRatio;
  const expBaselineY = expTopY + expStrokeThick * 0.5 + expAscent;
  const expCenterY = expTopY + targetExpCapH * 0.5;

  // Helper to draw all plate text (main + expiry) on any context for emboss passes
  const drawAllTextPass = (
    targetCtx: CanvasRenderingContext2D,
    color: string,
    offsetX: number,
    offsetY: number,
    extraStroke: number = 0
  ) => {
    targetCtx.save();
    targetCtx.fillStyle = color;
    targetCtx.strokeStyle = color;
    targetCtx.textAlign = 'left';
    targetCtx.textBaseline = 'alphabetic';
    targetCtx.font = `normal ${mainFontSize}px ${fontFam}`;

    // Main plate row
    targetCtx.save();
    targetCtx.translate(pw / 2 + offsetX, offsetY);
    targetCtx.scale(scaleX, 1.0);

    let curX = -totalRawWidth / 2;
    const activeStroke = strokeThick + extraStroke;
    groupLayouts.forEach((grp, gIdx) => {
      grp.chars.forEach((cItem, cIdx) => {
        drawStampedGlyph(targetCtx, cItem.char, curX, mainBaselineY, activeStroke);
        curX += cItem.width;
        if (cIdx < grp.chars.length - 1) curX += intraGroupGap;
      });
      if (gIdx < groupLayouts.length - 1) curX += interGroupGap;
    });
    targetCtx.restore();

    // Expiration row ("04 · 28" with crisp circular separator dot so PlatNomor never drops '·')
    if (hasExp) {
      targetCtx.save();
      targetCtx.font = `normal ${expFontSize}px ${fontFam}`;
      const expClean = formatKorlantasGlyphs(trimmedExp, usePlatNomor);
      const expParts = expClean.split(/[·.\-\s]+/).filter(Boolean);

      if (expParts.length === 2) {
        const leftPart = expParts[0];
        const rightPart = expParts[1];
        const dotRadius = Math.max(0.9, targetExpCapH * 0.14);
        const dotSpace = Math.max(2.5, targetExpCapH * 0.42);
        const leftW = targetCtx.measureText(leftPart).width + expStrokeThick * 0.6;
        const rightW = targetCtx.measureText(rightPart).width + expStrokeThick * 0.6;
        const expTotalW = leftW + dotSpace * 2 + dotRadius * 2 + rightW;
        const startX = pw / 2 + offsetX - (expTotalW * charAspectX) / 2;

        targetCtx.translate(startX, offsetY);
        targetCtx.scale(charAspectX, 1.0);

        drawStampedGlyph(targetCtx, leftPart, 0, expBaselineY, expStrokeThick + extraStroke * 0.5);

        const dotCx = leftW + dotSpace + dotRadius;
        targetCtx.beginPath();
        targetCtx.arc(dotCx, expCenterY, dotRadius + extraStroke * 0.25, 0, Math.PI * 2);
        targetCtx.fill();

        const rightX = dotCx + dotRadius + dotSpace;
        drawStampedGlyph(targetCtx, rightPart, rightX, expBaselineY, expStrokeThick + extraStroke * 0.5);
      } else {
        targetCtx.translate(pw / 2 + offsetX, offsetY);
        targetCtx.scale(charAspectX, 1.0);
        targetCtx.textAlign = 'center';
        drawStampedGlyph(targetCtx, expClean, 0, expBaselineY, expStrokeThick + extraStroke * 0.5);
      }
      targetCtx.restore();
    }

    targetCtx.restore();
  };

  // Pass 3A: Soft contact shadow cast downward onto aluminum surface by raised embossed digits
  pCtx.save();
  pCtx.shadowColor = 'rgba(0, 0, 0, 0.26)';
  pCtx.shadowBlur = Math.max(1.2, ph * 0.028);
  pCtx.shadowOffsetX = 0.2 * ss;
  pCtx.shadowOffsetY = Math.max(0.8, ph * 0.016);
  pCtx.globalAlpha = 0.55;
  drawAllTextPass(pCtx, inner.textColor, 0, 0, 0);
  pCtx.restore();

  // Pass 3B: Faint top-left metallic bevel rim highlight along raised stamped metal ridges
  pCtx.save();
  pCtx.globalAlpha = 0.14;
  drawAllTextPass(pCtx, '#ffffff', -0.22 * ss, -0.32 * ss, 0.15 * ss);
  pCtx.restore();

  // Pass 3C: Render charcoal painted ink face onto dedicated offscreen layer first so stroke+fill
  // blend at uniform 91% matte/satin density without overlapping-alpha dark seams
  const inkCanvas = document.createElement('canvas');
  inkCanvas.width = pw;
  inkCanvas.height = ph;
  const inkCtx = inkCanvas.getContext('2d');
  if (inkCtx) {
    drawAllTextPass(inkCtx, inner.textColor, 0, 0, 0);
    pCtx.save();
    pCtx.globalAlpha = 0.91;
    pCtx.drawImage(inkCanvas, 0, 0);
    pCtx.restore();
  }

  // 4. Subtle recessed plate edge hairline (soft, never harsh digital outline)
  pCtx.strokeStyle = 'rgba(20, 23, 28, 0.42)';
  pCtx.lineWidth = Math.max(1, ss * 0.85);
  pCtx.beginPath();
  pCtx.roundRect(0.5, 0.5, pw - 1, ph - 1, cornerR);
  pCtx.stroke();

  // 5. Apply uniform ISO camera grain across BOTH plate metal and stamped characters
  const imgData = pCtx.getImageData(0, 0, pw, ph);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const grain = (Math.random() - 0.5) * 7.5;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  pCtx.putImageData(imgData, 0, 0);

  // 6. Composite onto master image with perspective transform & natural lens softness
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
    const adaptiveBlur = Math.min(0.42, Math.max(0.24, w * 0.0036));
    ctx.filter = `blur(${adaptiveBlur.toFixed(2)}px)`;
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
