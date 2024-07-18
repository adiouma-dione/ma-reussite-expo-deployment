import { Box } from "native-base";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const sessions = {
  participants: [
    { id: "1", name: "Samir Tata (Enseignant)" },
    { id: "2", name: "Mohamed Mohamed" },
    { id: "3", name: "Khalil Galalem" },
    { id: "4", name: "Berthonge Christ" },
    { id: "5", name: "Nagil Glad" },
    { id: "6", name: "Rayen Dhmaied" },
    { id: "7", name: "Asad Babur" },
    { id: "8", name: "Wael Marak" },
    { id: "9", name: "Khadija Amri" },
  ],
  past: [
    { id: "1", date: "14/06/2023", time: "10:00-12:00", attended: true },
    { id: "2", date: "21/06/2023", time: "10:00-12:00", attended: false },
  ],
  future: [
    { id: "3", date: "28/06/2024", time: "10:00-12:00", attended: false },
    { id: "4", date: "05/07/2024", time: "10:00-12:00", attended: false },
  ],
};

const SessionScreen = () => {
  const [activeTab, setActiveTab] = useState("participants");

  const renderItem = ({ item }) =>
    item.name === undefined ? (
      <Box
        bg={"white"}
        p={4}
        my={0.5}
        borderRadius={"md"}
        style={styles.session}
      >
        <Text>{item.date}</Text>
        <Text>{item.time}</Text>
        <Text>{item.attended ? "Présent" : "Absent"}</Text>
      </Box>
    ) : (
      <Box
        bg={"white"}
        p={4}
        my={0.5}
        borderRadius={"md"}
        style={styles.session}
      >
        <Text>{item.name}</Text>
      </Box>
    );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("participants")}>
          <Text
            style={
              activeTab === "participants"
                ? styles.activeTab
                : styles.inactiveTab
            }
          >
            Participants
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("past")}>
          <Text
            style={activeTab === "past" ? styles.activeTab : styles.inactiveTab}
          >
            Sessions Passées
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("future")}>
          <Text
            style={
              activeTab === "future" ? styles.activeTab : styles.inactiveTab
            }
          >
            Sessions Futures
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sessions[activeTab]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabs: {
    marginTop: "10%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  activeTab: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "blue",
  },
  inactiveTab: {
    color: "gray",
  },
  session: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
});

export default SessionScreen;
