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
  // CARS: DAIHATSU GRAN MAX (4 FOTO LATAR DISHUB DKI JAKARTA)
  // Plat Dasar Putih Tulisan Hitam (Standar TNKB Plat Putih)
  // ==========================================
  {
    id: 'car-1',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Belakang (Lajur Uji KIR)',
    viewTitle: 'Foto 1: Tampak Belakang',
    filename: '/vehicles/car-1.jpg',
    originalPlate: 'B 9726 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak belakang di depan gerbang pengujian kendaraan bermotor Dishub DKI Jakarta.',
    badge: 'Belakang',
    plateInner: {
      cx: 49.65,
      cy: 69.98,
      width: 13.82,
      height: 3.20,
      charHeightPx: 20,
      expHeightPx: 6.0,
      mainOffsetYPx: -2.0,
      expOffsetYPx: 8.8,
      topColor: '#b8bbbe',
      botColor: '#eaecef',
      textColor: '#121518',
      angle: 0,
      skewY: 0,
    },
  },
  {
    id: 'car-2',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Serong Kanan (3/4 Front Right)',
    viewTitle: 'Foto 2: Serong Kanan',
    filename: '/vehicles/car-2.jpg',
    originalPlate: 'B 9726 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak serong kanan di atas alat uji rem lajur KIR Dishub DKI Jakarta.',
    badge: 'Kanan',
    plateInner: {
      cx: 67.00,
      cy: 72.46,
      width: 10.58,
      height: 5.22,
      charHeightPx: 19,
      expHeightPx: 5.8,
      mainOffsetYPx: -2.2,
      expOffsetYPx: 8.2,
      topColor: '#b3b8b9',
      botColor: '#bfc3c6',
      textColor: '#131619',
      angle: 0,
      skewY: -0.118,
    },
  },
  {
    id: 'car-3',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Serong Kiri (3/4 Front Left)',
    viewTitle: 'Foto 3: Serong Kiri',
    filename: '/vehicles/car-3.jpg',
    originalPlate: 'B 9726 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak serong kiri di atas alat uji lajur pengujian kendaraan Dishub DKI Jakarta.',
    badge: 'Kiri',
    plateInner: {
      cx: 27.93,
      cy: 70.80,
      width: 11.42,
      height: 3.03,
      charHeightPx: 19.5,
      expHeightPx: 5.8,
      mainOffsetYPx: -2.2,
      expOffsetYPx: 8.4,
      topColor: '#d3d6d4',
      botColor: '#e0e3e2',
      textColor: '#121515',
      angle: 0,
      skewY: 0.084,
    },
  },
  {
    id: 'car-4',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Depan (Lajur Uji KIR)',
    viewTitle: 'Foto 4: Tampak Depan',
    filename: '/vehicles/car-4.jpg',
    originalPlate: 'B 9726 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak depan lurus di dalam gedung uji KIR Dinas Perhubungan Provinsi DKI Jakarta.',
    badge: 'Depan',
    plateInner: {
      cx: 49.51,
      cy: 76.49,
      width: 15.66,
      height: 3.56,
      charHeightPx: 21.5,
      expHeightPx: 6.4,
      mainOffsetYPx: -2.4,
      expOffsetYPx: 9.2,
      topColor: '#cacdc9',
      botColor: '#e1e2e0',
      textColor: '#121618',
      angle: 0,
      skewY: 0,
    },
  },

  // ==========================================
  // TRUCKS: ISUZU ELF BOKS (4 FOTO LATAR DISHUB DKI JAKARTA)
  // Plat Putih Tulisan Hitam (Standar TNKB Plat Putih)
  // ==========================================
  {
    id: 'truck-1',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Tampak Belakang (Gerbang Uji Dishub)',
    viewTitle: 'Foto 1: Tampak Belakang',
    filename: '/vehicles/truck-1.jpg',
    originalPlate: 'AB 8920 EL',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Isuzu Elf boks putih tampak belakang di depan gerbang gedung pengujian kendaraan bermotor Dishub DKI Jakarta.',
    badge: 'Belakang',
    plateInner: {
      cx: 50.95,
      cy: 62.48,
      width: 8.75,
      height: 1.76,
      charHeightPx: 18.5,
      expHeightPx: 5.5,
      mainOffsetYPx: -2.0,
      expOffsetYPx: 7.6,
      topColor: '#dfe5ec',
      botColor: '#eaeff6',
      textColor: '#22252a',
      angle: 0,
      skewY: 0,
    },
  },
  {
    id: 'truck-2',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Tampak Serong Kanan (3/4 Front Right)',
    viewTitle: 'Foto 2: Serong Kanan',
    filename: '/vehicles/truck-2.jpg',
    originalPlate: 'AB 8920 EL',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Isuzu Elf NMR boks putih tampak serong kanan di atas alat uji rem lajur KIR Dishub DKI Jakarta.',
    badge: 'Kanan',
    plateInner: {
      cx: 76.06,
      cy: 74.05,
      width: 8.71,
      height: 2.25,
      charHeightPx: 19,
      expHeightPx: 5.8,
      mainOffsetYPx: -2.2,
      expOffsetYPx: 8.0,
      topColor: '#8e8879',
      botColor: '#8d8873',
      textColor: '#1d1b15',
      angle: 0,
      skewY: -0.052,
    },
  },
  {
    id: 'truck-3',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Tampak Serong Kiri (3/4 Front Left)',
    viewTitle: 'Foto 3: Serong Kiri',
    filename: '/vehicles/truck-3.jpg',
    originalPlate: 'AB 8920 EL',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Isuzu Elf NMR boks putih tampak serong kiri di atas alat uji lajur pengujian kendaraan Dishub DKI Jakarta.',
    badge: 'Kiri',
    plateInner: {
      cx: 36.44,
      cy: 60.61,
      width: 8.26,
      height: 2.04,
      charHeightPx: 17,
      expHeightPx: 5.3,
      mainOffsetYPx: -2.0,
      expOffsetYPx: 7.2,
      topColor: '#a3a198',
      botColor: '#a7a296',
      textColor: '#232117',
      angle: 0,
      skewY: 0.045,
    },
  },
  {
    id: 'truck-4',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Tampak Depan (Lajur Uji KIR)',
    viewTitle: 'Foto 4: Tampak Depan',
    filename: '/vehicles/truck-4.jpg',
    originalPlate: 'AB 8920 EL',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Isuzu Elf NMR boks putih tampak depan lurus di dalam gedung uji KIR Dinas Perhubungan Provinsi DKI Jakarta.',
    badge: 'Depan',
    plateInner: {
      cx: 51.06,
      cy: 65.27,
      width: 8.93,
      height: 1.96,
      charHeightPx: 17,
      expHeightPx: 5.3,
      mainOffsetYPx: -2.0,
      expOffsetYPx: 7.2,
      topColor: '#a4a69d',
      botColor: '#a2a39a',
      textColor: '#1b1c15',
      angle: 0,
      skewY: 0,
    },
  },
];
