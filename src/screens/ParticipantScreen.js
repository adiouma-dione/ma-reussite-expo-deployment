import { Box, Pressable, ScrollView, Text } from "native-base";
import React from "react";
import { ImageBackground } from "react-native";
import { HomeScreenBanner } from "../components";

const participants = [
  { id: "1", name: "Samir Tata (Enseignant)" },
  { id: "2", name: "Mohamed Mohamed" },
  { id: "3", name: "Khalil Galalem" },
  { id: "4", name: "Berthonge Christ" },
  { id: "5", name: "Nagil Glad" },
  { id: "6", name: "Rayen Dhmaied" },
  { id: "7", name: "Asad Babur" },
  { id: "8", name: "Wael Marak" },
  { id: "9", name: "Khadija Amri" },
];

const ParticipantScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <Pressable
      bg={"white"}
      p={4}
      my={1}
      borderRadius={"md"}
      borderColor={"gray.400"}
      onPress={() => navigation.navigate("Sessions")}
    >
      <Text>{item.name}</Text>
    </Pressable>
  );

  return (
    <Box flex={1} bg={"white"}>
      <HomeScreenBanner />
      <ImageBackground
        style={{ resizeMode: "contain" }}
        source={require("../../assets/images/ma_reussite_background.png")}
      >
        <Box pt={4} w={"100%"}>
          <Text
            color={"black"}
            textAlign={"center"}
            fontWeight="bold"
            fontSize="lg"
          >
            Master 1 DevOps
          </Text>
        </Box>
        <ScrollView
          p={4}
          //   h={"100%"}
          h={"100%"}
          //   p={2}
          flexGrow={1}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {participants &&
            participants.map((participant, index) => (
              <Pressable
                key={index}
                bg={"white"}
                p={4}
                my={0.5}
                borderRadius={"md"}
                onPress={() => navigation.navigate("Sessions")}
              >
                <Text color={"black"}>{participant.name}</Text>
              </Pressable>
            ))}
        </ScrollView>
      </ImageBackground>
    </Box>
  );
};

export default ParticipantScreen;
