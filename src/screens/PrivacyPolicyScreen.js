import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import customTheme from "../themes/customTheme";
import { Button, NativeBaseProvider } from "native-base";
import WebView from "react-native-webview";

const PrivacyPolicyScreen = ({ setPolicyAccepted }) => {
  const [currentPolicyVersion, setCurrentPolicyVersion] = useState(null);

  const handleWebViewMessage = (event) => {
    const policyVersion = event.nativeEvent.data;
    setCurrentPolicyVersion(policyVersion);
  };

  const checkPolicyAcceptance = async () => {
    const value = await AsyncStorage.getItem("policyAccepted");
    const storedPolicyVersion = await AsyncStorage.getItem("policyVersion");

    if (value === "true" && storedPolicyVersion === currentPolicyVersion) {
      setPolicyAccepted(true);
    }
  };

  const handleAccept = async () => {
    await AsyncStorage.setItem("policyAccepted", "true");
    await AsyncStorage.setItem("policyVersion", currentPolicyVersion);
    setPolicyAccepted(true);
  };

  useEffect(() => {
    if (currentPolicyVersion) {
      checkPolicyAcceptance();
      SplashScreen.hideAsync();
    }
  }, [currentPolicyVersion]);

  return (
    <NativeBaseProvider isSSR theme={customTheme}>
      <WebView
        source={{ uri: "https://ma-reussite-privacy.netlify.app/" }}
        style={{ flex: 1, marginTop: "10%", marginBottom: "5%" }}
        onMessage={handleWebViewMessage}
      />
      <Button w={"50%"} mx={"auto"} mb={"2%"} onPress={handleAccept}>
        Accept
      </Button>
    </NativeBaseProvider>
  );
};

export default PrivacyPolicyScreen;
