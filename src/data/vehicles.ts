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
    originalPlate: 'B 9781 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak belakang di dalam gedung pengujian kendaraan bermotor Dishub DKI Jakarta.',
    badge: 'Belakang',
    plateInner: {
      cx: 51.76,
      cy: 59.52,
      width: 12.89,
      height: 2.18,
      charHeightPx: 19,
      expHeightPx: 6.5,
      mainOffsetYPx: -2.8,
      expOffsetYPx: 8.8,
      topColor: '#c3c4c2',
      botColor: '#b7b8b6',
      textColor: '#242628',
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
    originalPlate: 'B 9781 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak serong kanan di atas alat uji rem lajur KIR Dishub DKI Jakarta.',
    badge: 'Kanan',
    plateInner: {
      cx: 82.29,
      cy: 65.32,
      width: 10.94,
      height: 2.25,
      charHeightPx: 19,
      expHeightPx: 6.5,
      mainOffsetYPx: -2.8,
      expOffsetYPx: 9.0,
      topColor: '#9d9f92',
      botColor: '#919386',
      textColor: '#252620',
      angle: 0,
      skewY: -0.22,
    },
  },
  {
    id: 'car-3',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Serong Kiri (3/4 Front Left)',
    viewTitle: 'Foto 3: Serong Kiri',
    filename: '/vehicles/car-3.jpg',
    originalPlate: 'B 9781 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak serong kiri di lajur pengujian kendaraan Dishub DKI Jakarta.',
    badge: 'Kiri',
    plateInner: {
      cx: 32.42,
      cy: 64.7,
      width: 9.77,
      height: 2.25,
      charHeightPx: 19,
      expHeightPx: 6.5,
      mainOffsetYPx: -2.8,
      expOffsetYPx: 9.0,
      topColor: '#a8a699',
      botColor: '#9b998c',
      textColor: '#222421',
      angle: 0,
      skewY: 0.195,
    },
  },
  {
    id: 'car-4',
    category: 'car',
    name: 'Daihatsu Gran Max',
    subtitle: 'Tampak Depan (Gerbang Uji Dishub)',
    viewTitle: 'Foto 4: Tampak Depan',
    filename: '/vehicles/car-4.jpg',
    originalPlate: 'B 9781 UXI',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Daihatsu Gran Max putih tampak depan lurus menghadap pintu masuk gedung uji KIR Dinas Perhubungan Provinsi Daerah Khusus Jakarta.',
    badge: 'Depan',
    plateInner: {
      cx: 50.78,
      cy: 68.28,
      width: 12.5,
      height: 2.25,
      charHeightPx: 19,
      expHeightPx: 6.5,
      mainOffsetYPx: -2.8,
      expOffsetYPx: 9.0,
      topColor: '#cfd8dc',
      botColor: '#c0c9ce',
      textColor: '#262b30',
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
    subtitle: 'Tampak Belakang (Lajur Uji KIR)',
    viewTitle: 'Foto 1: Tampak Belakang',
    filename: '/vehicles/truck-1.jpg',
    originalPlate: 'B 9106 UXD',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Isuzu Elf boks putih tampak belakang di dalam gedung pengujian kendaraan bermotor Dishub DKI Jakarta.',
    badge: 'Belakang',
    plateInner: {
      cx: 51.17,
      cy: 65.3,
      width: 11.72,
      height: 2.11,
      charHeightPx: 17,
      expHeightPx: 5.8,
      mainOffsetYPx: -2.5,
      expOffsetYPx: 8.2,
      topColor: '#7c7e79',
      botColor: '#6c6e69',
      textColor: '#1b1d1c',
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
    originalPlate: 'B 9106 UXD',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Isuzu Elf boks putih tampak serong kanan di atas alat uji rem lajur KIR Dishub DKI Jakarta.',
    badge: 'Kanan',
    plateInner: {
      cx: 80.73,
      cy: 62.32,
      width: 9.77,
      height: 2.4,
      charHeightPx: 18,
      expHeightPx: 6.2,
      mainOffsetYPx: -2.6,
      expOffsetYPx: 8.8,
      topColor: '#a0a193',
      botColor: '#949587',
      textColor: '#262720',
      angle: 0,
      skewY: -0.15,
    },
  },
  {
    id: 'truck-3',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Tampak Serong Kiri (3/4 Front Left)',
    viewTitle: 'Foto 3: Serong Kiri',
    filename: '/vehicles/truck-3.jpg',
    originalPlate: 'B 9106 UXD',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Isuzu Elf boks putih tampak serong kiri di lajur pengujian kendaraan Dishub DKI Jakarta.',
    badge: 'Kiri',
    plateInner: {
      cx: 34.7,
      cy: 61.06,
      width: 9.64,
      height: 2.18,
      charHeightPx: 17,
      expHeightPx: 5.8,
      mainOffsetYPx: -2.5,
      expOffsetYPx: 8.2,
      topColor: '#a5a395',
      botColor: '#989689',
      textColor: '#232420',
      angle: 0,
      skewY: 0.144,
    },
  },
  {
    id: 'truck-4',
    category: 'truck',
    name: 'Isuzu Elf Boks',
    subtitle: 'Tampak Depan (Gerbang Uji Dishub)',
    viewTitle: 'Foto 4: Tampak Depan',
    filename: '/vehicles/truck-4.jpg',
    originalPlate: 'B 9019 UXL',
    originalExp: '04·28',
    isWhitePlate: true,
    description: 'Isuzu Elf boks putih tampak depan lurus menghadap pintu masuk gedung uji KIR Dinas Perhubungan Provinsi Daerah Khusus Jakarta.',
    badge: 'Depan',
    plateInner: {
      cx: 51.69,
      cy: 60.68,
      width: 9.24,
      height: 1.96,
      charHeightPx: 16,
      expHeightPx: 5.4,
      mainOffsetYPx: -2.3,
      expOffsetYPx: 7.6,
      topColor: '#9fa7ac',
      botColor: '#8e969b',
      textColor: '#1e2226',
      angle: 0,
      skewY: 0,
    },
  },
];
