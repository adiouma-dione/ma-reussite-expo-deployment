import { extendTheme } from "native-base";
import { colors } from "./colors";
import { shadows } from "./shadows";
import { typography } from "./typography";

const customTheme = extendTheme({
  colors,
  shadows,
  opacity: {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    25: 0.25,
    30: 0.3,
    40: 0.4,
    50: 0.5,
    60: 0.6,
    70: 0.7,
    75: 0.75,
    80: 0.8,
    90: 0.9,
    95: 0.95,
    100: 1,
  },
  ...typography,
  fontConfig: {
    Lato: {
      100: {
        normal: "Lato-Thin",
        italic: "Lato-ThinItalic",
      },
      200: {
        normal: "Lato-Light",
        italic: "Lato-LightItalic",
      },
      300: {
        normal: "Lato-Light",
        italic: "Lato-LightItalic",
      },
      400: {
        normal: "Lato-Regular",
        italic: "Lato-Italic",
      },
      700: {
        normal: "Lato-Bold",
        italic: "Lato-BoldItalic",
      },
      800: {
        normal: "Lato-Bold",
        italic: "Lato-BoldItalic",
      },
      900: {
        normal: "Lato-Black",
        italic: "Lato-BlackItalic",
      },
    },
  },
  fonts: {
    heading: "Lato",
    body: "Lato",
    mono: "Lato",
  },
  components: {
    Button: {
      baseStyle: {
        rounded: "md",
      },
      defaultProps: {
        colorScheme: "primary",
      },
      variants: {
        solid: () => {
          return {
            bg: "primary.500",
            _hover: {
              bg: "primary.600",
            },
          };
        },
        outline: () => {
          return {
            borderColor: "primary.500",
            borderWidth: "1.5px",
            _hover: {
              bg: "primary.600",
            },
          };
        },
      },
    },
    // Customize other components here
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: "dark",
  },
});

export default customTheme;
