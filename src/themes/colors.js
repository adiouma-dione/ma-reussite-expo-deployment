/**
 * This file contains the application's variables.
 *
 * Define color, hex color, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

import { theme } from "native-base";

const colors = {
  ...theme.colors,
  primary: {
    50: "#7f6cfa",
    100: "#624cf3",
    200: "#462de9",
    300: "#361ed1",
    400: "#2d19ae",
    500: "#2b1b94",
    600: "#291c7c",
    700: "#251c65",
    800: "#211a4f",
    900: "#1b163b",
  },
  secondary: {
    50: "#ffdbd7",
    100: "#ffb7af",
    200: "#ff9488",
    300: "#ff7060",
    400: "#ff4e3a",
    500: "#f83c27",
    600: "#f02d18",
    700: "#db2916",
    800: "#bf2b1a",
    900: "#a42b1d",
  },
  tertiary: {
    50: "#67ffcc",
    100: "#43fbbe",
    200: "#23f3ae",
    300: "#13dc99",
    400: "#10b981",
    500: "#139c6e",
    600: "#15835e",
    700: "#166a4e",
    800: "#15543f",
    900: "#133f30",
  },
  quaternary: {
    50: "#f6e5ff",
    100: "#dbb5ff",
    200: "#c185fa",
    300: "#a855f7",
    400: "#8f25f4",
    500: "#750cda",
    600: "#5b08aa",
    700: "#41057b",
    800: "#27014b",
    900: "#0f001d",
  },
  blue: {
    50: "#dafffe",
    100: "#aff2ff",
    200: "#82e2fa",
    300: "#53cff6",
    400: "#27baf2",
    500: "#0d99d8",
    600: "#0082a9",
    700: "#00667a",
    800: "#00434c",
    900: "#001b1f",
  },
  ligth: {
    50: "#feeff5",
    100: "#ded7da",
    200: "#c2bec0",
    300: "#a7a5a6",
    400: "#8c8c8c",
    500: "#737373",
    600: "#5a5959",
    700: "#423f40",
    800: "#2a2527",
    900: "#170811",
  },
  danger: {
    50: "#ffd2da",
    100: "#ffaab8",
    200: "#fc8699",
    300: "#f6647c",
    400: "#f43f5e",
    500: "#ec2f4e",
    600: "#e22141",
    700: "#c9223e",
    800: "#af253c",
    900: "#962739",
  },
  success: {
    50: "#dffeec",
    100: "#b9f5d0",
    200: "#8fedb2",
    300: "#65e594",
    400: "#3bdd77",
    500: "#22c45d",
    600: "#169848",
    700: "#0c6d33",
    800: "#01421c",
    900: "#001803",
  },
  warning: {
    50: "#ffeedc",
    100: "#ffd1af",
    200: "#feb381",
    300: "#fc9650",
    400: "#f9791f",
    500: "#e05f06",
    600: "#af4a02",
    700: "#7d3400",
    800: "#4d1f00",
    900: "#1f0800",
  },
  // Add more color categories as needed
};

/**
 * Convert a hex color to an RGBA color with the specified opacity.
 * @param hex - The hex color code.
 * @param opacity - The opacity value (0 to 1).
 * @returns The RGBA color string.
 */
const hexToRGB = (hexcolor, alpha) => {
  const r = parseInt(hexcolor?.slice(1, 3), 16);
  const g = parseInt(hexcolor?.slice(3, 5), 16);
  const b = parseInt(hexcolor?.slice(5, 7), 16);

  return `rgba(${r},${g},${b}${alpha ? `, ${alpha}` : ""})`;
};
/**
 * Get the color with the specified opacity.
 * @param color - The color in the theme.
 * @param opacityValue - The opacity value (0 to 100).
 * @returns The RGBA color string with the specified opacity.
 */
const getColorWithOpacity = (hexColor, opacity) => {
  opacity = Math.max(0, Math.min(1, opacity));
  hexColor = hexColor?.replace("#", "");
  const r = parseInt(hexColor?.slice(0, 2), 16);
  const g = parseInt(hexColor?.slice(2, 4), 16);
  const b = parseInt(hexColor?.slice(4, 6), 16);
  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  return rgbaColor;
};

export { colors, getColorWithOpacity };
