import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import ParentHomeScreenBanner from "./ParentHomeScreenBanner";

const ParentBackgroundWrapper = ({ children, navigation }) => {
  return (
    <>
      <ParentHomeScreenBanner navigation={navigation} />

      <ImageBackground
        style={styles.background}
        source={require("../../assets/images/ma_reussite_background.png")}
      >
        {children}
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    resizeMode: "contain",
    minHeight: "100%",
  },
});

export default ParentBackgroundWrapper;
