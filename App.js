import React, { useEffect, useState } from "react";
import { NativeBaseProvider } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import useFonts from "./src/hooks/useFonts";
import AppNavigator from "./src/navigation/AppNavigator";
import customTheme from "./src/themes/customTheme";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const fontsLoaded = useFonts({
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
  });

  useEffect(() => {
    const checkPolicyAcceptance = async () => {
      const value = await AsyncStorage.getItem("policyAccepted");
      if (value === "true") {
        setPolicyAccepted(true);
      }
    };

    checkPolicyAcceptance();
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!policyAccepted) {
    return <PrivacyPolicyScreen setPolicyAccepted={setPolicyAccepted} />;
  }

  return (
    <NativeBaseProvider isSSR theme={customTheme}>
      <AppNavigator />
    </NativeBaseProvider>
  );
};

export default App;
