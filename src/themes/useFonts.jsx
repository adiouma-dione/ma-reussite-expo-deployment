import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import React from "react";

SplashScreen.preventAutoHideAsync();

const Fonts = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Lato-Black": require("_assets/fonts/Lato-Black.ttf"),
    "Lato-Black-Italic": require("_assets/fonts/Lato-BlackItalic.ttf"),
    "Lato-Bold": require("_assets/fonts/Lato-Bold.ttf"),
    "Lato-Bold-Italic": require("_assets/fonts/Lato-BoldItalic.ttf"),
    "Lato-Italic": require("_assets/fonts/Lato-Italic.ttf"),
    "Lato-Light": require("_assets/fonts/Lato-Light.ttf"),
    "Lato-Light-Italic": require("_assets/fonts/Lato-LightItalic.ttf"),
    "Lato-Regular": require("_assets/fonts/Lato-Regular.ttf"),
    "Lato-Thin": require("_assets/fonts/Lato-Thin.ttf"),
    "Lato-Thin-Italic": require("_assets/fonts/Lato-ThinItalic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
      if (onFontsLoaded) {
        onFontsLoaded();
      }
    }
  }, [fontsLoaded, onFontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      onLayoutRootView();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (fontError) {
    console.error("Error loading fonts:", fontError);
    return null;
  }

  return <View onLayout={onLayoutRootView} />;
};

export default Fonts;
