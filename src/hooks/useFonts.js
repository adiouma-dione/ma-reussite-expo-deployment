import * as Font from "expo-font";
import { useState, useEffect } from "react";

const useFonts = (fontMap) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync(fontMap);
      setFontsLoaded(true);
    };

    loadFonts();
  }, [fontMap]);

  return fontsLoaded;
};

export default useFonts;
