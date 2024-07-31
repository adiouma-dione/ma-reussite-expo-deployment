import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { LoginScreen, ProfileScreen } from "../screens";
import { ParentTabNavigator } from "./ParentTabNavigator";
import TabNavigator from "./TabNavigator";
import { AppProvider } from "../hooks/AppProvider";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          options={{ headerShown: false }}
          name="ParentTabNavigator"
          component={ParentTabNavigator}
        />
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
      </Stack.Navigator>
    // </AppProvider>
  );
};

export default StackNavigator;
