import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import HomeScreenBanner from "./HomeScreenBanner";
import { StatusBar } from "native-base";

const BackgroundWrapper = ({
  children,
  selectedChild,
  navigation,
  listOfChildren,
  // role,
}) => {
  return (
    <>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <HomeScreenBanner
        // role={role}
        listOfChildren={listOfChildren}
        selectedChild={selectedChild}
        navigation={navigation}
      />
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

export default BackgroundWrapper;
