/**
 * Curated set of selectable SVG icons for categories (react-icons/fi).
 * Stored by key (string) so categories persist a stable icon reference.
 */
import {
  FiBriefcase, FiCode, FiTrendingUp, FiGift, FiDollarSign,
  FiCoffee, FiTruck, FiHome, FiShoppingBag, FiHeart,
  FiMonitor, FiBookOpen, FiZap, FiPackage, FiSmartphone,
  FiCreditCard, FiAward, FiActivity, FiMusic, FiCamera,
  FiWifi, FiGlobe, FiTool, FiScissors, FiCloud,
} from 'react-icons/fi';

export const ICON_REGISTRY = {
  briefcase: FiBriefcase, code: FiCode, trending: FiTrendingUp, gift: FiGift, dollar: FiDollarSign,
  coffee: FiCoffee, truck: FiTruck, home: FiHome, bag: FiShoppingBag, heart: FiHeart,
  monitor: FiMonitor, book: FiBookOpen, zap: FiZap, package: FiPackage, phone: FiSmartphone,
  card: FiCreditCard, award: FiAward, activity: FiActivity, music: FiMusic, camera: FiCamera,
  wifi: FiWifi, globe: FiGlobe, tool: FiTool, scissors: FiScissors, cloud: FiCloud,
};

export const ICON_KEYS = Object.keys(ICON_REGISTRY);

export const resolveIcon = (key) => ICON_REGISTRY[key] || FiPackage;

/** Selectable category colors (warm palette). */
export const CATEGORY_COLORS = [
  '#C2703D', '#4B8B6F', '#D99A4E', '#8C6A52', '#B5544A',
  '#6E8C7E', '#D4A373', '#9C6B4F', '#7A8B99', '#C8553D',
];
