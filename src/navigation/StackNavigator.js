import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  LoginScreen,
  ParticipantScreen,
  ProfileScreen,
  SessionScreen,
} from "../screens";
import TabNavigator from "./TabNavigator";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        options={{ headerShown: false }}
        name="TabNavigator"
        component={TabNavigator}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        // options={{ headerShown: false }}
        name="Profile"
        component={ProfileScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Participants"
        component={ParticipantScreen}
      />
      <Stack.Screen
        options={{ headerShown: true, headerTitle: "Details" }}
        name="Sessions"
        component={SessionScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
