export interface PlateInnerZone {
  cx: number;           // % from left of image
  cy: number;           // % from top of image
  width: number;        // % width of image
  height: number;       // % height of image
  charHeightPx: number; // font size for main plate text
  expHeightPx: number;  // font size for expiration date
  mainOffsetYPx: number;// Y offset from plate center for main text
  expOffsetYPx: number; // Y offset from plate center for expiration date
  topColor: string;     // sampled plate gradient top color
  botColor: string;     // sampled plate gradient bottom color
  textColor: string;    // sampled paint color
  angle?: number;       // rotation angle in degrees
  skewY?: number;       // perspective vertical skew
  reflectionZone?: {
    cx: number;
    cy: number;
    width: number;
    height: number;
    charHeightPx: number;
    topColor: string;
    botColor: string;
    textColor: string;
  };
}

export interface VehicleAsset {
  id: string;
  category: 'car' | 'truck';
  name: string;
  subtitle: string;
  viewTitle: string;
  filename: string;
  originalPlate: string;
  originalExp: string;
  isWhitePlate: boolean;
  description: string;
  badge: string;
  plateInner: PlateInnerZone;
}

export const VEHICLE_CATALOG: VehicleAsset[] = [
  // ==========================================
  // CARS: DAIHATSU GRAN MAX (4 FOTO ASLI REFERENSI)
  // Plat Asli: B 9781 UXI (Plat Dasar Putih Tulisan Hitam)
  // ==========================================
  {
    id: 'car-1',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Belakang (Rear View)',
    viewTitle: 'Foto 1: Belakang Pintu Kargo',
    filename: '/vehicles/car-1.jpg',
    originalPlate: 'B 9781 UXI',
    originalExp: '10·26',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak belakang di dalam gedung pengujian kendaraan bermotor (KIR).',
    badge: 'Tampak Belakang',
    plateInner: {
      cx: 51.31,
      cy: 56.15,
      width: 11.75,
      height: 3.76,
      charHeightPx: 36,
      expHeightPx: 12,
      mainOffsetYPx: -6,
      expOffsetYPx: 18,
      topColor: '#e4e5e7',
      botColor: '#d4d5d7',
      textColor: '#151618',
      angle: 0,
      skewY: 0,
    },
  },
  {
    id: 'car-2',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Depan di Kolong Pit',
    viewTitle: 'Foto 2: Depan Kolong Pit Uji',
    filename: '/vehicles/car-2.jpg',
    originalPlate: 'B 9781 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak depan di atas lubang kolong pemeriksaan dengan lis oranye.',
    badge: 'Kolong Pit Depan',
    plateInner: {
      cx: 45.72,
      cy: 62.04,
      width: 11.19,
      height: 3.65,
      charHeightPx: 35,
      expHeightPx: 12,
      mainOffsetYPx: -6,
      expOffsetYPx: 18,
      topColor: '#f1f4fb',
      botColor: '#e5ecf4',
      textColor: '#14161c',
      angle: 0,
      skewY: 0,
    },
  },
  {
    id: 'car-3',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Depan & Monitor Tes',
    viewTitle: 'Foto 3: Depan Monitor Posisi',
    filename: '/vehicles/car-3.jpg',
    originalPlate: 'B 9781 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak depan di samping monitor uji Ptr1 Position dengan pantulan di lantai hijau.',
    badge: 'Uji Monitor Depan',
    plateInner: {
      cx: 48.47,
      cy: 69.66,
      width: 9.31,
      height: 2.92,
      charHeightPx: 27,
      expHeightPx: 10,
      mainOffsetYPx: -5,
      expOffsetYPx: 14,
      topColor: '#eff2eb',
      botColor: '#e0e4dd',
      textColor: '#131518',
      angle: 0,
      skewY: 0,
      reflectionZone: {
        cx: 48.47,
        cy: 85.39,
        width: 9.31,
        height: 2.92,
        charHeightPx: 27,
        topColor: '#0d2d1e',
        botColor: '#0a2417',
        textColor: '#071810',
      },
    },
  },
  {
    id: 'car-4',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Serong Depan (3/4 Side)',
    viewTitle: 'Foto 4: Serong Samping 45°',
    filename: '/vehicles/car-4.jpg',
    originalPlate: 'B 9781 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak serong samping di jalur lorong pemeriksaan pengujian.',
    badge: 'Serong Depan 45°',
    plateInner: {
      cx: 75.44,
      cy: 66.19,
      width: 11.38,
      height: 4.05,
      charHeightPx: 36,
      expHeightPx: 12,
      mainOffsetYPx: -6,
      expOffsetYPx: 19,
      topColor: '#dbe0e9',
      botColor: '#d2dbe5',
      textColor: '#141720',
      angle: -2.3,
      skewY: -0.038,
    },
  },

  // ==========================================
  // TRUCKS: ISUZU ELF BOKS (4 FOTO ASLI REFERENSI)
  // Plat Asli: B 9019 UXL / B 9106 UXD (Plat Dasar Hitam Tulisan Putih)
  // ==========================================
  {
    id: 'truck-1',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Tampak Depan di Samping Monitor',
    viewTitle: 'Foto 1: Depan Monitor Posisi',
    filename: '/vehicles/truck-1.jpg',
    originalPlate: 'B 9019 UXL',
    originalExp: '04·28',
    isWhitePlate: false,
    description: 'Isuzu Elf boks putih tampak depan di samping layar monitor Ptr1 Position di jalur pengujian.',
    badge: 'Uji Dimensi Depan',
    plateInner: {
      cx: 52.75,
      cy: 63.97,
      width: 12.54,
      height: 3.05,
      charHeightPx: 9,
      expHeightPx: 3.5,
      mainOffsetYPx: -1.5,
      expOffsetYPx: 4.5,
      topColor: '#121215',
      botColor: '#101013',
      textColor: '#edf2f7',
      angle: 0,
      skewY: 0,
    },
  },
  {
    id: 'truck-2',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Pintu Belakang Boks (Rear Door)',
    viewTitle: 'Foto 2: Pintu Boks Belakang',
    filename: '/vehicles/truck-2.jpg',
    originalPlate: 'B 9106 UXD',
    originalExp: '11·26',
    isWhitePlate: false,
    description: 'Isuzu Elf boks putih tampak belakang memperlihatkan pintu kargo besi dan bumper bawah.',
    badge: 'Pintu Belakang',
    plateInner: {
      cx: 51.94,
      cy: 78.62,
      width: 15.49,
      height: 3.73,
      charHeightPx: 11,
      expHeightPx: 4,
      mainOffsetYPx: -2,
      expOffsetYPx: 5.5,
      topColor: '#161619',
      botColor: '#141416',
      textColor: '#e2e8f0',
      angle: 0,
      skewY: 0,
    },
  },
  {
    id: 'truck-3',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Tampak Serong Samping (3/4 View)',
    viewTitle: 'Foto 3: Serong Kolong Pit',
    filename: '/vehicles/truck-3.jpg',
    originalPlate: 'B 9106 UXD',
    originalExp: '04·28',
    isWhitePlate: false,
    description: 'Isuzu Elf boks putih tampak serong samping di atas lubang servis pengujian.',
    badge: 'Serong 3/4 Kolong',
    plateInner: {
      cx: 76.10,
      cy: 62.17,
      width: 10.21,
      height: 3.29,
      charHeightPx: 10,
      expHeightPx: 3.5,
      mainOffsetYPx: -1.5,
      expOffsetYPx: 4.5,
      topColor: '#1c1e22',
      botColor: '#1a1b1f',
      textColor: '#cbd5e1',
      angle: -1.6,
      skewY: -0.025,
    },
  },
  {
    id: 'truck-4',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Tampak Depan Menghadap Pit',
    viewTitle: 'Foto 4: Depan Lurus Kolong Pit',
    filename: '/vehicles/truck-4.jpg',
    originalPlate: 'B 9106 UXD',
    originalExp: '04·28',
    isWhitePlate: false,
    description: 'Isuzu Elf boks putih lurus menghadap lubang kolong pit di jalur pengujian.',
    badge: 'Depan Lurus Pit',
    plateInner: {
      cx: 49.55,
      cy: 48.65,
      width: 9.58,
      height: 3.14,
      charHeightPx: 9,
      expHeightPx: 3.5,
      mainOffsetYPx: -1.5,
      expOffsetYPx: 4.5,
      topColor: '#151518',
      botColor: '#131316',
      textColor: '#e2e8f0',
      angle: 0,
      skewY: 0,
    },
  },
];
