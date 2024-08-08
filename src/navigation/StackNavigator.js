import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { LoginScreen, ProfileScreen } from "../screens";
import { ParentTabNavigator } from "./ParentTabNavigator";
import { TeacherTabNavigator } from "./TeacherTabNavigator";
import { AdminTabNavigator } from "./AdminTabNavigator";
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
        name="TeacherTabNavigator"
        component={TeacherTabNavigator}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AdminTabNavigator"
        component={AdminTabNavigator}
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
