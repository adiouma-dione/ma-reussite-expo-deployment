import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { ParticipantScreen, SessionScreen } from "../screens";
import MA_REUSSITE_CUSTOM_COLORS from "../themes/variables";

const Tab = createBottomTabNavigator();

const TopTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Participant") {
          } else if (route.name === "Sessions") {
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: MA_REUSSITE_CUSTOM_COLORS.Primary,
        tabBarInactiveTintColor: "white",
        tabBarActiveBackgroundColor: "white",
        tabBarItemStyle: {
          paddingBottom: 5,
        },
        tabBarIconStyle: {
          backgroundColor: "white",
        },
        tabBarStyle: {
          backgroundColor: MA_REUSSITE_CUSTOM_COLORS.Primary,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Participant"
        component={ParticipantScreen}
        options={{ tabBarLabel: "Participants" }}
      />
      <Tab.Screen
        name="Sessions"
        component={SessionScreen}
        options={{ tabBarLabel: "Sessions Passées" }}
      />
    </Tab.Navigator>
  );
};

export default TopTabNavigator;
