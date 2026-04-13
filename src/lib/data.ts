// Deterministic demo data for UzAnalytics (Uzbekistan market prices)

export interface PricePoint {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit: string;
  change: number;
  changeType: "up" | "down";
  category: string;
  subCategory: string;
  sparkline: number[];
  history: PricePoint[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  gradient: string;
  description: string;
  productCount: number;
  avgGrowth: number;
  growthType: "up" | "down";
  subCategories: SubCategory[];
}

export interface SubCategory {
  name: string;
  slug: string;
  items: string[];
}

export interface TickerItem {
  name: string;
  price: number;
  change: number;
  changeType: "up" | "down";
}

type ProductTemplate = {
  name: string;
  slug: string;
  min: number;
  max: number;
  unit: string;
  seasonality?: number;
  trendBias?: number;
  volatility?: number;
};

type SubCategoryTemplate = {
  name: string;
  slug: string;
  targetCount: number;
  templates: ProductTemplate[];
};

type CategoryTemplate = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  gradient: string;
  description: string;
  subCategories: SubCategoryTemplate[];
};

const variantLabels = [
  "Toshkent",
  "Samarqand",
  "Farg'ona",
  "Andijon",
  "Namangan",
  "Buxoro",
  "Xorazm",
  "Qashqadaryo",
  "Premium",
  "Standart",
  "Ekonom",
  "Import",
  "Mahalliy",
  "Organik",
  "Yangi hosil",
];

const today = new Date();
today.setHours(0, 0, 0, 0);

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) || 1;
}

function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function buildHistory(template: ProductTemplate, uniqueSeed: string, days = 365): PricePoint[] {
  const baseSeed = hashString(uniqueSeed);
  const mid = (template.min + template.max) / 2;
  const seasonality = template.seasonality ?? 0.12;
  const trendBias = template.trendBias ?? 0;
  const points: PricePoint[] = [];
  const categorySlug = uniqueSeed.split("-").slice(0, 2).join("-");

  const dailyVolatilityByCategory: Record<string, { min: number; max: number; drift: number }> = {
    "oziq-ovqat": { min: 0.005, max: 0.02, drift: 0.0011 },
    qurilish: { min: 0.003, max: 0.01, drift: -0.00035 },
    tekstil: { min: 0.0045, max: 0.014, drift: 0.0008 },
    elektronika: { min: 0.0055, max: 0.018, drift: 0.0016 },
  };

  const volatilityBand =
    dailyVolatilityByCategory[categorySlug] || dailyVolatilityByCategory["oziq-ovqat"];
  const volatilityScale = template.volatility ?? 0.025;
  const dailyVol =
    clamp(volatilityBand.min + volatilityScale * 0.45, volatilityBand.min, volatilityBand.max);

  const startNoise = (seeded(baseSeed + 0.39) - 0.5) * 0.12;
  let current = clamp(mid * (1 + startNoise), template.min * 1.02, template.max * 0.98);
  const momentumDir = seeded(baseSeed + 11.2) > 0.5 ? 1 : -1;
  const phase = seeded(baseSeed + 7.7) * Math.PI * 2;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const month = date.getMonth();
    const dayOfYear = (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000;
    const seasonWave = Math.sin(((month + 1) / 12) * Math.PI * 2 + phase) * seasonality * 0.012;
    const shortMomentum = Math.sin((dayOfYear / 11) * Math.PI * 2 + phase) * 0.0028 * momentumDir;
    const longMomentum = Math.sin((dayOfYear / 34) * Math.PI * 2 + phase * 0.7) * 0.0036;
    const randomShock = (seeded(baseSeed + i * 2.31) - 0.5) * 2 * dailyVol;
    const directionalDrift = volatilityBand.drift + trendBias * 0.0035;

    const dailyMove = directionalDrift + seasonWave + shortMomentum + longMomentum + randomShock;
    current = clamp(current * (1 + dailyMove), template.min, template.max);
    points.push({ date: toIsoDate(date), price: Math.round(current) });
  }
  return points;
}

function subCategoryTemplatesToItems(sub: SubCategoryTemplate): string[] {
  return sub.templates.map((template) => template.name);
}

const categoryTemplates: CategoryTemplate[] = [
  {
    id: "1",
    name: "Oziq-ovqat mahsulotlari",
    slug: "oziq-ovqat",
    icon: "Apple",
    gradient: "from-orange-500 to-red-500",
    description: "Kunlik oziq-ovqat narxlari, mavsumiy tebranishlar va asosiy bozor dinamikasi.",
    subCategories: [
      {
        name: "Mevalar",
        slug: "mevalar",
        targetCount: 24,
        templates: [
          { name: "Olma", slug: "olma", min: 15000, max: 20000, unit: "kg", seasonality: 0.2, trendBias: -0.06 },
          { name: "Nok", slug: "nok", min: 18000, max: 25000, unit: "kg", seasonality: 0.16 },
          { name: "Uzum", slug: "uzum", min: 12000, max: 30000, unit: "kg", seasonality: 0.3 },
          { name: "Banan", slug: "banan", min: 22000, max: 28000, unit: "kg", seasonality: 0.04 },
          { name: "Anor", slug: "anor", min: 10000, max: 35000, unit: "kg", seasonality: 0.35 },
          { name: "Gilos", slug: "gilos", min: 25000, max: 60000, unit: "kg", seasonality: 0.34 },
          { name: "Shaftoli", slug: "shaftoli", min: 15000, max: 40000, unit: "kg", seasonality: 0.3 },
          { name: "Limon", slug: "limon", min: 20000, max: 35000, unit: "kg", seasonality: 0.1 },
          { name: "Mandarin", slug: "mandarin", min: 15000, max: 30000, unit: "kg", seasonality: 0.22 },
          { name: "Xurmo", slug: "xurmo", min: 25000, max: 45000, unit: "kg", seasonality: 0.24 },
        ],
      },
      {
        name: "Sabzavotlar",
        slug: "sabzavotlar",
        targetCount: 24,
        templates: [
          { name: "Pomidor", slug: "pomidor", min: 8000, max: 15000, unit: "kg", seasonality: 0.2 },
          { name: "Bodring", slug: "bodring", min: 6000, max: 12000, unit: "kg", seasonality: 0.22 },
          { name: "Kartoshka", slug: "kartoshka", min: 3500, max: 6000, unit: "kg", seasonality: 0.07 },
          { name: "Piyoz", slug: "piyoz", min: 4000, max: 8000, unit: "kg", seasonality: 0.12 },
          { name: "Sabzi", slug: "sabzi", min: 4000, max: 9000, unit: "kg", seasonality: 0.15 },
          { name: "Karam", slug: "karam", min: 3000, max: 5000, unit: "kg", seasonality: 0.1 },
          { name: "Baqlajon", slug: "baqlajon", min: 8000, max: 14000, unit: "kg", seasonality: 0.2 },
          { name: "Qalampir", slug: "qalampir", min: 10000, max: 20000, unit: "kg", seasonality: 0.19 },
          { name: "Rediska", slug: "rediska", min: 5000, max: 10000, unit: "kg", seasonality: 0.17 },
          { name: "Sholgom", slug: "sholgom", min: 4000, max: 8000, unit: "kg", seasonality: 0.13 },
        ],
      },
      {
        name: "Go'sht va baliq",
        slug: "gosht-baliq",
        targetCount: 24,
        templates: [
          { name: "Mol go'shti", slug: "mol-goshti", min: 85000, max: 120000, unit: "kg", volatility: 0.025 },
          { name: "Qo'y go'shti", slug: "qoy-goshti", min: 90000, max: 130000, unit: "kg", volatility: 0.028 },
          { name: "Tovuq", slug: "tovuq", min: 32000, max: 45000, unit: "kg", volatility: 0.02 },
          { name: "Baliq (oq)", slug: "baliq-oq", min: 40000, max: 70000, unit: "kg", seasonality: 0.09 },
          { name: "Baliq (qizil)", slug: "baliq-qizil", min: 80000, max: 150000, unit: "kg", seasonality: 0.08 },
          { name: "Kolbasa", slug: "kolbasa", min: 45000, max: 80000, unit: "kg", volatility: 0.03 },
        ],
      },
      {
        name: "Don mahsulotlari",
        slug: "don",
        targetCount: 20,
        templates: [
          { name: "Bug'doy", slug: "bugdoy", min: 4000, max: 6000, unit: "kg", volatility: 0.016 },
          { name: "Guruch", slug: "guruch", min: 14000, max: 22000, unit: "kg", volatility: 0.02 },
          { name: "Un (1-sort)", slug: "un-1-sort", min: 5500, max: 8000, unit: "kg", volatility: 0.017 },
          { name: "Un (oliy)", slug: "un-oliy", min: 7000, max: 10000, unit: "kg", volatility: 0.018 },
          { name: "Makkajo'xori", slug: "makkajoxori", min: 3500, max: 5500, unit: "kg", volatility: 0.018 },
          { name: "Yormalar", slug: "yormalar", min: 8000, max: 14000, unit: "kg", volatility: 0.019 },
        ],
      },
      {
        name: "Sut mahsulotlari",
        slug: "sut",
        targetCount: 20,
        templates: [
          { name: "Sut", slug: "sut", min: 8000, max: 12000, unit: "l", volatility: 0.016 },
          { name: "Qatiq", slug: "qatiq", min: 10000, max: 15000, unit: "l", volatility: 0.017 },
          { name: "Sariyog'", slug: "sariyog", min: 65000, max: 90000, unit: "kg", volatility: 0.02 },
          { name: "Pishloq", slug: "pishloq", min: 70000, max: 120000, unit: "kg", volatility: 0.021 },
          { name: "Tvorog", slug: "tvorog", min: 25000, max: 40000, unit: "kg", volatility: 0.02 },
          { name: "Smetana", slug: "smetana", min: 20000, max: 35000, unit: "kg", volatility: 0.018 },
        ],
      },
      {
        name: "Yog'lar",
        slug: "yoglar",
        targetCount: 16,
        templates: [
          { name: "O'simlik yog'i", slug: "osimlik-yogi", min: 22000, max: 30000, unit: "l", volatility: 0.018 },
          { name: "Kungaboqar yog'i", slug: "kungaboqar-yogi", min: 24000, max: 32000, unit: "l", volatility: 0.018 },
          { name: "Zaytun yog'i", slug: "zaytun-yogi", min: 80000, max: 140000, unit: "l", volatility: 0.021 },
          { name: "Sarimshoq yog'i", slug: "sarimshoq-yogi", min: 60000, max: 100000, unit: "l", volatility: 0.02 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Qurilish materiallari",
    slug: "qurilish",
    icon: "Building2",
    gradient: "from-blue-500 to-cyan-500",
    description: "Qurilish bozori uchun xomashyo va materiallar narx indekslari.",
    subCategories: [
      {
        name: "Sement va beton",
        slug: "sement-beton",
        targetCount: 24,
        templates: [
          { name: "Sement M400", slug: "sement-m400", min: 62000, max: 72000, unit: "50kg" },
          { name: "Sement M500", slug: "sement-m500", min: 68000, max: 78000, unit: "50kg" },
          { name: "Quruq qorishma", slug: "quruq-qorishma", min: 35000, max: 55000, unit: "25kg" },
          { name: "Qum", slug: "qum", min: 150000, max: 250000, unit: "m3" },
          { name: "Shag'al", slug: "shagal", min: 180000, max: 300000, unit: "m3" },
        ],
      },
      {
        name: "Metall",
        slug: "metall",
        targetCount: 22,
        templates: [
          { name: "Armatura 8mm", slug: "armatura-8mm", min: 12000, max: 16000, unit: "m" },
          { name: "Armatura 10mm", slug: "armatura-10mm", min: 15000, max: 20000, unit: "m" },
          { name: "Armatura 12mm", slug: "armatura-12mm", min: 18000, max: 24000, unit: "m" },
          { name: "Profil truba 40x20", slug: "profil-truba-40x20", min: 25000, max: 40000, unit: "m" },
          { name: "Sim", slug: "sim", min: 8000, max: 12000, unit: "kg" },
          { name: "Quvur (polipropilen)", slug: "quvur-polipropilen", min: 15000, max: 30000, unit: "m" },
        ],
      },
      {
        name: "Yog'och",
        slug: "yogoch",
        targetCount: 20,
        templates: [
          { name: "Taxta (obreznoy)", slug: "taxta-obreznoy", min: 8000000, max: 12000000, unit: "m3" },
          { name: "Fanera 4mm", slug: "fanera-4mm", min: 50000, max: 80000, unit: "list" },
          { name: "Fanera 10mm", slug: "fanera-10mm", min: 120000, max: 200000, unit: "list" },
          { name: "Brus 100x100", slug: "brus-100x100", min: 9000000, max: 14000000, unit: "m3" },
          { name: "OSB 9mm", slug: "osb-9mm", min: 100000, max: 160000, unit: "list" },
        ],
      },
      {
        name: "Bo'yoq va qoplama",
        slug: "boyoq-qoplama",
        targetCount: 19,
        templates: [
          { name: "Bo'yoq (ichki)", slug: "boyoq-ichki", min: 45000, max: 80000, unit: "kg" },
          { name: "Bo'yoq (tashqi)", slug: "boyoq-tashqi", min: 55000, max: 95000, unit: "kg" },
          { name: "Gruntovka", slug: "gruntovka", min: 35000, max: 55000, unit: "kg" },
          { name: "Shpaklyovka", slug: "shpaklyovka", min: 25000, max: 45000, unit: "kg" },
          { name: "Lak", slug: "lak", min: 50000, max: 90000, unit: "kg" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Tekstil va kiyim-kechak",
    slug: "tekstil",
    icon: "Shirt",
    gradient: "from-purple-500 to-pink-500",
    description: "Tekstil xomashyosi va tayyor kiyimlar bozorining narx trendlari.",
    subCategories: [
      {
        name: "Paxta va ip",
        slug: "paxta-ip",
        targetCount: 22,
        templates: [
          { name: "Xom paxta", slug: "xom-paxta", min: 8000, max: 12000, unit: "kg" },
          { name: "Paxta tolasi", slug: "paxta-tolasi", min: 14000, max: 20000, unit: "kg" },
          { name: "Ip (paxta)", slug: "ip-paxta", min: 15000, max: 25000, unit: "kg" },
          { name: "Kalava", slug: "kalava", min: 3000, max: 8000, unit: "dona" },
        ],
      },
      {
        name: "Gazlama",
        slug: "gazlama",
        targetCount: 20,
        templates: [
          { name: "Atlas", slug: "atlas", min: 40000, max: 80000, unit: "m" },
          { name: "Adras", slug: "adras", min: 50000, max: 120000, unit: "m" },
          { name: "Surp", slug: "surp", min: 15000, max: 30000, unit: "m" },
          { name: "Krep", slug: "krep", min: 25000, max: 50000, unit: "m" },
          { name: "Shoyi", slug: "shoyi", min: 60000, max: 150000, unit: "m" },
        ],
      },
      {
        name: "Tayyor kiyim",
        slug: "tayyor-kiyim",
        targetCount: 22,
        templates: [
          { name: "Erkaklar ko'ylagi", slug: "erkaklar-koylagi", min: 80000, max: 250000, unit: "dona" },
          { name: "Ayollar ko'ylagi", slug: "ayollar-koylagi", min: 100000, max: 350000, unit: "dona" },
          { name: "Bolalar kiyimi", slug: "bolalar-kiyimi", min: 50000, max: 180000, unit: "dona" },
          { name: "Jinsi shim", slug: "jinsi-shim", min: 150000, max: 500000, unit: "dona" },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Elektronika va texnika",
    slug: "elektronika",
    icon: "Laptop",
    gradient: "from-emerald-500 to-teal-500",
    description: "Elektronika segmenti bo'yicha brendlar, modellar va narx indekslari.",
    subCategories: [
      {
        name: "Telefonlar",
        slug: "telefonlar",
        targetCount: 28,
        templates: [
          { name: "Smartfon (byudjet)", slug: "smartfon-byudjet", min: 1500000, max: 3000000, unit: "dona" },
          { name: "Smartfon (o'rtacha)", slug: "smartfon-ortacha", min: 3000000, max: 7000000, unit: "dona" },
          { name: "Smartfon (premium)", slug: "smartfon-premium", min: 8000000, max: 20000000, unit: "dona" },
          { name: "Telefon aksessuarlari", slug: "telefon-aksessuarlari", min: 30000, max: 500000, unit: "dona" },
        ],
      },
      {
        name: "Maishiy texnika",
        slug: "maishiy-texnika",
        targetCount: 32,
        templates: [
          { name: "Muzlatgich", slug: "muzlatgich", min: 4000000, max: 12000000, unit: "dona" },
          { name: "Kir yuvish mashinasi", slug: "kir-yuvish-mashinasi", min: 3500000, max: 10000000, unit: "dona" },
          { name: "Konditsioner", slug: "konditsioner", min: 5000000, max: 15000000, unit: "dona" },
          { name: "Changyutgich", slug: "changyutgich", min: 1500000, max: 5000000, unit: "dona" },
          { name: "Mikroto'lqinli pech", slug: "mikrotolqinli-pech", min: 800000, max: 3000000, unit: "dona" },
        ],
      },
      {
        name: "Kompyuter texnikasi",
        slug: "kompyuter",
        targetCount: 32,
        templates: [
          { name: "Noutbuk", slug: "noutbuk", min: 5000000, max: 20000000, unit: "dona" },
          { name: "Monitor", slug: "monitor", min: 2000000, max: 8000000, unit: "dona" },
          { name: "Printer", slug: "printer", min: 2000000, max: 6000000, unit: "dona" },
          { name: "Klaviatura+sichqoncha", slug: "klaviatura-sichqoncha", min: 100000, max: 800000, unit: "to'plam" },
        ],
      },
    ],
  },
];

function expandProducts(
  categorySlug: string,
  sub: SubCategoryTemplate,
  startId: number,
): { products: Product[]; nextId: number } {
  const output: Product[] = [];
  const perTemplate = Math.floor(sub.targetCount / sub.templates.length);
  let remainder = sub.targetCount % sub.templates.length;
  let id = startId;

  sub.templates.forEach((template, templateIndex) => {
    const totalForTemplate = perTemplate + (remainder > 0 ? 1 : 0);
    remainder = Math.max(0, remainder - 1);

    for (let variantIndex = 0; variantIndex < totalForTemplate; variantIndex++) {
      const isBase = variantIndex === 0;
      const label = variantLabels[(templateIndex + variantIndex) % variantLabels.length];
      const name = isBase ? template.name : `${template.name} (${label})`;
      const slug = isBase ? template.slug : `${template.slug}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const history = buildHistory(template, `${categorySlug}-${sub.slug}-${slug}`);
      const latest = history[history.length - 1]?.price ?? template.max;
      const weekOld = history[Math.max(0, history.length - 8)]?.price ?? latest;
      const change = Number((((latest - weekOld) / weekOld) * 100).toFixed(1));

      output.push({
        id: String(id),
        name,
        slug: `${categorySlug}-${slug}`,
        price: latest,
        unit: template.unit,
        change: Math.abs(change),
        changeType: change >= 0 ? "up" : "down",
        category: categorySlug,
        subCategory: sub.slug,
        sparkline: history.slice(-30).map((p) => p.price),
        history,
      });
      id += 1;
    }
  });

  return { products: output, nextId: id };
}

let cursorId = 1;
const builtProducts: Product[] = [];

for (const category of categoryTemplates) {
  for (const sub of category.subCategories) {
    const generated = expandProducts(category.slug, sub, cursorId);
    cursorId = generated.nextId;
    builtProducts.push(...generated.products);
  }
}

export const products: Product[] = builtProducts;

function categoryGrowth(categorySlug: string): number {
  const list = products.filter((product) => product.category === categorySlug);
  if (!list.length) return 0;
  const latestAvg =
    list.reduce((acc, product) => acc + (product.history[product.history.length - 1]?.price || 0), 0) /
    list.length;
  const weekAgoAvg =
    list.reduce((acc, product) => acc + (product.history[Math.max(0, product.history.length - 8)]?.price || 0), 0) /
    list.length;
  if (!weekAgoAvg) return 0;
  const pct = ((latestAvg - weekAgoAvg) / weekAgoAvg) * 100;
  return Number(pct.toFixed(1));
}

export const categories: Category[] = categoryTemplates.map((category) => {
  const growth = categoryGrowth(category.slug);
  const growthTargets: Record<string, number> = {
    "oziq-ovqat": 8.5,
    qurilish: -2.1,
    tekstil: 5.3,
    elektronika: 12.1,
  };
  const target = growthTargets[category.slug] ?? growth;
  const adjustedGrowth = Number((growth * 0.35 + target * 0.65).toFixed(1));
  const count = products.filter((product) => product.category === category.slug).length;
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    gradient: category.gradient,
    description: category.description,
    productCount: count,
    avgGrowth: Math.abs(adjustedGrowth),
    growthType: adjustedGrowth >= 0 ? "up" : "down",
    subCategories: category.subCategories.map((sub) => ({
      name: sub.name,
      slug: sub.slug,
      items: subCategoryTemplatesToItems(sub),
    })),
  };
});

export function getCategoryProducts(categorySlug: string): Product[] {
  return products.filter((product) => product.category === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getSubCategoryName(
  categorySlug: string,
  subCategorySlug: string,
): string | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.subCategories.find((sub) => sub.slug === subCategorySlug)?.name;
}

export function getProductChangePercent(product: Product, days: number): number {
  const history = product.history;
  if (!history.length) return 0;
  const latest = history[history.length - 1].price;
  const previous = history[Math.max(0, history.length - 1 - days)]?.price ?? latest;
  if (!previous) return 0;
  return Number((((latest - previous) / previous) * 100).toFixed(2));
}

export function getProductStats(product: Product, days = 30): {
  average: number;
  min: number;
  max: number;
  volatility: number;
} {
  const slice = product.history.slice(-days);
  if (!slice.length) {
    return { average: 0, min: 0, max: 0, volatility: 0 };
  }

  const prices = slice.map((point) => point.price);
  const average = prices.reduce((acc, value) => acc + value, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1];
    const curr = prices[i];
    if (prev > 0) returns.push((curr - prev) / prev);
  }

  const meanReturn =
    returns.length > 0
      ? returns.reduce((acc, value) => acc + value, 0) / returns.length
      : 0;
  const variance =
    returns.length > 0
      ? returns.reduce((acc, value) => acc + (value - meanReturn) ** 2, 0) /
        returns.length
      : 0;
  const volatility = Math.sqrt(variance) * 100;

  return {
    average: Math.round(average),
    min,
    max,
    volatility: Number(volatility.toFixed(2)),
  };
}

export type ForecastPoint = {
  date: string;
  price?: number;
  forecast?: number;
  upper?: number;
  lower?: number;
};

export function getProductForecastSeries(product: Product): {
  points: ForecastPoint[];
  summary: { oneMonth: number; fiveMonths: number; oneYear: number; confidence: number };
  factors: string[];
} {
  const baseHistory = product.history.map((point) => ({ date: point.date, price: point.price }));
  const last = product.history[product.history.length - 1]?.price ?? product.price;
  const drift = getProductChangePercent(product, 90) / 100;
  const volatility = getProductStats(product, 30).volatility / 100;
  const forecastDays = 365;
  const future: ForecastPoint[] = [];

  let current = last;
  for (let i = 1; i <= forecastDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const season = Math.sin(((date.getMonth() + 1) / 12) * Math.PI * 2) * 0.0035;
    const noise = (seeded(hashString(product.slug) + i * 3.17) - 0.5) * 0.004;
    current = Math.max(last * 0.7, current * (1 + drift * 0.0009 + season + noise));
    const uncertainty = 1 + Math.min(0.2, volatility * Math.sqrt(i / 30));

    future.push({
      date: toIsoDate(date),
      forecast: Math.round(current),
      upper: Math.round(current * uncertainty),
      lower: Math.round(current / uncertainty),
    });
  }

  const getDayPrice = (day: number) => future[Math.max(0, day - 1)]?.forecast ?? last;
  const confidenceBase = clamp(82 - volatility * 140, 58, 92);
  const factorsByCategory: Record<string, string[]> = {
    "oziq-ovqat": ["Mavsumiy talab", "Import dinamikasi", "Logistika xarajatlari"],
    qurilish: ["Qurilish loyihalari", "Xomashyo narxlari", "Valyuta bosimi"],
    tekstil: ["Eksport buyurtmalari", "Tolalar taklifi", "Ishlab chiqarish quvvati"],
    elektronika: ["Global chip ta'minoti", "Import kursi", "Yangi model sikli"],
  };

  return {
    points: [...baseHistory, ...future],
    summary: {
      oneMonth: getDayPrice(30),
      fiveMonths: getDayPrice(150),
      oneYear: getDayPrice(365),
      confidence: Number(confidenceBase.toFixed(1)),
    },
    factors: factorsByCategory[product.category] ?? factorsByCategory["oziq-ovqat"],
  };
}

export function getSupplyDemandSeries(product: Product): Array<{
  month: string;
  supply: number;
  demand: number;
}> {
  const labels = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
  const seed = hashString(product.slug);
  return labels.map((month, index) => {
    const seasonal = Math.sin(((index + 1) / 12) * Math.PI * 2);
    const supply = Math.round(68 + seasonal * 10 + seeded(seed + index) * 9);
    const demand = Math.round(66 + seasonal * 8 + seeded(seed + index * 2.1) * 12);
    return { month, supply: Math.max(42, supply), demand: Math.max(40, demand) };
  });
}

export function getMarketComposition(product: Product): Array<{ name: string; value: number }> {
  const seed = hashString(product.slug);
  if (product.category === "oziq-ovqat") {
    const local = Math.round(58 + seeded(seed) * 22);
    return [
      { name: "Ichki ishlab chiqarish", value: local },
      { name: "Import", value: 100 - local },
    ];
  }
  const a = Math.round(22 + seeded(seed) * 14);
  const b = Math.round(18 + seeded(seed + 4) * 16);
  const c = Math.round(20 + seeded(seed + 9) * 18);
  const sum = a + b + c;
  return [
    { name: "Toshkent", value: a },
    { name: "Farg'ona vodiysi", value: b },
    { name: "Samarqand", value: c },
    { name: "Boshqa hududlar", value: Math.max(5, 100 - sum) },
  ];
}

export function getRegionalComparison(product: Product): Array<{
  region: string;
  price: number;
  change: number;
  status: "Yuqori" | "O'rtacha" | "Past";
}> {
  const regions = ["Toshkent", "Samarqand", "Farg'ona", "Andijon", "Namangan", "Buxoro", "Xorazm"];
  const seed = hashString(product.slug);
  return regions.map((region, index) => {
    const delta = (seeded(seed + index * 7.1) - 0.5) * 0.18;
    const price = Math.round(product.price * (1 + delta));
    const change = Number((((seeded(seed + index * 11.3) - 0.5) * 2) * 4.8).toFixed(1));
    const ratio = price / product.price;
    let status: "Yuqori" | "O'rtacha" | "Past" = "O'rtacha";
    if (ratio > 1.06) status = "Yuqori";
    if (ratio < 0.95) status = "Past";
    return { region, price, change, status };
  });
}

export function getRelatedProducts(product: Product, limit = 8): Product[] {
  return products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.category === product.category &&
        item.subCategory === product.subCategory,
    )
    .slice(0, limit);
}

export type DashboardIndexPoint = {
  date: string;
  overall: number;
  "oziq-ovqat": number;
  qurilish: number;
  tekstil: number;
  elektronika: number;
};

function normalizeSeries(values: Array<{ date: string; index: number }>): Array<{ date: string; value: number }> {
  if (!values.length) return [];
  const base = values[0].index || 1;
  return values.map((point) => ({
    date: point.date,
    value: Number(((point.index / base) * 100).toFixed(2)),
  }));
}

export function getDashboardIndexSeries(): DashboardIndexPoint[] {
  const oziq = normalizeSeries(getCategoryIndexSeries("oziq-ovqat"));
  const qurilishSeries = normalizeSeries(getCategoryIndexSeries("qurilish"));
  const tekstilSeries = normalizeSeries(getCategoryIndexSeries("tekstil"));
  const elektronikaSeries = normalizeSeries(getCategoryIndexSeries("elektronika"));
  const len = Math.min(
    oziq.length,
    qurilishSeries.length,
    tekstilSeries.length,
    elektronikaSeries.length,
  );

  const out: DashboardIndexPoint[] = [];
  for (let i = 0; i < len; i++) {
    const oziqVal = oziq[i].value;
    const qurilishVal = qurilishSeries[i].value;
    const tekstilVal = tekstilSeries[i].value;
    const elektronikaVal = elektronikaSeries[i].value;
    const overall = Number(((oziqVal + qurilishVal + tekstilVal + elektronikaVal) / 4).toFixed(2));
    out.push({
      date: oziq[i].date,
      overall,
      "oziq-ovqat": oziqVal,
      qurilish: qurilishVal,
      tekstil: tekstilVal,
      elektronika: elektronikaVal,
    });
  }
  return out;
}

export function getTopMovers(limit = 10): {
  gainers: Array<{ name: string; slug: string; change: number; price: number }>;
  losers: Array<{ name: string; slug: string; change: number; price: number }>;
} {
  const scored = products.map((product) => ({
    name: product.name,
    slug: product.slug,
    price: product.price,
    change: getProductChangePercent(product, 7),
  }));
  const gainers = [...scored]
    .filter((item) => item.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, limit)
    .map((item) => ({ ...item, change: Number(item.change.toFixed(1)) }));
  const losers = [...scored]
    .filter((item) => item.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, limit)
    .map((item) => ({ ...item, change: Number(item.change.toFixed(1)) }));
  return { gainers, losers };
}

export function getDashboardSummary() {
  const indexSeries = getDashboardIndexSeries();
  const latest = indexSeries[indexSeries.length - 1]?.overall ?? 100;
  const weekAgo = indexSeries[Math.max(0, indexSeries.length - 8)]?.overall ?? latest;
  const weeklyIndexChange = Number((((latest - weekAgo) / weekAgo) * 100).toFixed(2));

  const inflationRaw =
    categories.reduce((acc, category) => {
      const series = getCategoryIndexSeries(category.slug);
      const now = series[series.length - 1]?.index ?? 100;
      const monthAgo = series[Math.max(0, series.length - 31)]?.index ?? now;
      return acc + ((now - monthAgo) / monthAgo) * 100;
    }, 0) / Math.max(1, categories.length);

  const inflation = Number(inflationRaw.toFixed(2));

  const usdBase = 12750;
  const usdSeries = Array.from({ length: 30 }, (_, i) => {
    const wave = Math.sin((i / 6) * Math.PI) * 35;
    const noise = (seeded(i + 4.1) - 0.5) * 24;
    return Math.round(usdBase + wave + noise);
  });
  const usdCurrent = usdSeries[usdSeries.length - 1];
  const usdPrev = usdSeries[usdSeries.length - 8] ?? usdCurrent;
  const usdChange = Number((((usdCurrent - usdPrev) / usdPrev) * 100).toFixed(2));

  return {
    marketIndex: latest,
    marketIndexChange: weeklyIndexChange,
    trackedProducts: products.length,
    inflation,
    usdRate: usdCurrent,
    usdChange,
    marketSparkline: indexSeries.slice(-30).map((item) => item.overall),
    productSparkline: Array.from({ length: 24 }, (_, i) => products.length - 8 + Math.round(Math.sin(i / 3) * 6)),
    inflationSparkline: Array.from({ length: 24 }, (_, i) => Number((inflation + Math.sin(i / 4) * 0.6).toFixed(2))),
    usdSparkline: usdSeries,
  };
}

export function getCategoryWeeklyPerformance(categorySlug: string): number {
  const categoryProducts = products.filter((product) => product.category === categorySlug);
  if (!categoryProducts.length) return 0;
  const avg =
    categoryProducts.reduce((acc, product) => acc + getProductChangePercent(product, 7), 0) /
    categoryProducts.length;
  return Number(avg.toFixed(2));
}

export function getDashboardCategoryPerformance(): Array<{
  slug: string;
  name: string;
  change: number;
}> {
  return categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    change: getCategoryWeeklyPerformance(category.slug),
  }));
}

export function getDashboardAlerts(categorySlug: string | "hammasi" = "hammasi"): Array<{
  id: string;
  slug: string;
  icon: string;
  text: string;
  time: string;
}> {
  const pool =
    categorySlug === "hammasi"
      ? products
      : products.filter((product) => product.category === categorySlug);
  const ranked = pool
    .map((product) => ({
      product,
      daily: getProductChangePercent(product, 1),
      weekly: getProductChangePercent(product, 7),
      monthlyStats: getProductStats(product, 30),
    }))
    .sort((a, b) => Math.abs(b.daily) - Math.abs(a.daily));

  const alerts: Array<{ id: string; slug: string; icon: string; text: string; time: string }> = [];
  const times = ["2 soat oldin", "3 soat oldin", "5 soat oldin", "bugun", "bugun", "kecha"];

  ranked.slice(0, 5).forEach((entry, idx) => {
    alerts.push({
      id: `jump-${entry.product.slug}`,
      slug: entry.product.slug,
      icon: "⚠️",
      text: `${entry.product.name} narxi 1 kunda ${Math.abs(entry.daily).toFixed(1)}% ${entry.daily >= 0 ? "oshdi" : "tushdi"}`,
      time: times[idx % times.length],
    });
  });

  ranked
    .filter((entry) => entry.product.price <= entry.monthlyStats.min * 1.02)
    .slice(0, 3)
    .forEach((entry, idx) => {
      alerts.push({
        id: `low-${entry.product.slug}`,
        slug: entry.product.slug,
        icon: "📉",
        text: `${entry.product.name} narxi oylik minimumda`,
        time: idx % 2 === 0 ? "kecha" : "bugun",
      });
    });

  ranked
    .filter((entry) => Math.abs(entry.weekly) < 2)
    .slice(0, 3)
    .forEach((entry, idx) => {
      alerts.push({
        id: `stable-${entry.product.slug}`,
        slug: entry.product.slug,
        icon: "🔔",
        text: `${entry.product.name} narxi barqarorlashmoqda`,
        time: idx % 2 === 0 ? "bugun" : "kecha",
      });
    });

  ranked
    .filter((entry) => entry.product.changeType === "up")
    .slice(0, 4)
    .forEach((entry, idx) => {
      alerts.push({
        id: `season-${entry.product.slug}`,
        slug: entry.product.slug,
        icon: "📈",
        text: `${entry.product.name} narxi mavsumiy o'sishda`,
        time: idx % 2 === 0 ? "2 soat oldin" : "bugun",
      });
    });

  return alerts.slice(0, 15);
}

export function getDashboardAccuracy() {
  const byCategory = {
    "oziq-ovqat": 89,
    qurilish: 78,
    tekstil: 83,
    elektronika: 81,
  };
  return {
    overall: 87,
    best: { name: "Guruch", accuracy: 94 },
    worst: { name: "Sement M400", accuracy: 72 },
    byCategory,
  };
}

export function getCategoryIndexSeries(categorySlug: string): Array<{ date: string; index: number }> {
  const catProducts = getCategoryProducts(categorySlug);
  if (!catProducts.length) return [];

  const len = catProducts[0].history.length;
  const output: Array<{ date: string; index: number }> = [];

  for (let day = 0; day < len; day++) {
    const date = catProducts[0].history[day].date;
    const avgPrice =
      catProducts.reduce((acc, product) => acc + product.history[day].price, 0) / catProducts.length;
    output.push({ date, index: avgPrice });
  }

  const baseline = output[0]?.index || 1;
  return output.map((point) => ({
    date: point.date,
    index: Number(((point.index / baseline) * 100).toFixed(2)),
  }));
}

export function generateHistoricalData(basePrice: number, days = 365) {
  const min = Math.round(basePrice * 0.75);
  const max = Math.round(basePrice * 1.25);
  return buildHistory(
    { name: "Demo", slug: "demo", min, max, unit: "dona" },
    `historical-${basePrice}-${days}`,
    days,
  ).map((point, i) => ({
    date: point.date,
    price: point.price,
    volume: 500 + Math.round(seeded(i + basePrice) * 1000),
  }));
}

export function generateForecastData(lastPrice: number, months = 12) {
  const output = [];
  let current = lastPrice;
  for (let i = 1; i <= months * 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const noise = (seeded(lastPrice + i * 2.17) - 0.45) * lastPrice * 0.004;
    current = Math.max(lastPrice * 0.75, current + noise);
    output.push({
      date: toIsoDate(date),
      price: Math.round(current),
      upper: Math.round(current * 1.08),
      lower: Math.round(current * 0.92),
    });
  }
  return output;
}

export const tickerData: TickerItem[] = products.slice(0, 12).map((product, index) => {
  const adjusted = clamp(product.change + (index % 4) * 0.9, 3, 16);
  return {
    name: product.name,
    price: product.price,
    change: Number(adjusted.toFixed(1)),
    changeType: product.changeType,
  };
});

const bySignedChange = [...products].sort((a, b) => {
  const aa = a.changeType === "up" ? a.change : -a.change;
  const bb = b.changeType === "up" ? b.change : -b.change;
  return bb - aa;
});

export const topGainers = bySignedChange
  .filter((item) => item.changeType === "up")
  .slice(0, 5)
  .map((item, index) => ({
    name: item.name,
    change: Number(clamp(item.change + (4 - index) * 1.3, 8, 18).toFixed(1)),
  }));

export const topLosers = bySignedChange
  .filter((item) => item.changeType === "down")
  .slice(0, 5)
  .map((item, index) => ({
    name: item.name,
    change: Number((-clamp(item.change + (4 - index) * 0.55, 3, 8)).toFixed(1)),
  }));

export const forecastChartData = (() => {
  const base = products[0]?.price ?? 10000;
  const data = [];
  let current = base;
  for (let i = 0; i < 12; i++) {
    current += (seeded(i + base) - 0.44) * 700;
    data.push({ month: `${i + 1}-oy`, historical: Math.round(current) });
  }
  for (let i = 12; i < 18; i++) {
    current += (seeded(i + base) - 0.36) * 520;
    data.push({
      month: `${i + 1}-oy`,
      forecast: Math.round(current),
      upper: Math.round(current * 1.08),
      lower: Math.round(current * 0.92),
    });
  }
  return data;
})();
