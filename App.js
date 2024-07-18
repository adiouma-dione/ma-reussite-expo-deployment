import * as SplashScreen from "expo-splash-screen";
import { NativeBaseProvider } from "native-base";
import React, { useEffect } from "react";
import useFonts from "./src/hooks/useFonts";
import AppNavigator from "./src/navigation/AppNavigator";
import customTheme from "./src/themes/customTheme";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const fontsLoaded = useFonts({
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NativeBaseProvider isSSR theme={customTheme}>
      <AppNavigator />
    </NativeBaseProvider>
  );
};

export default App;
