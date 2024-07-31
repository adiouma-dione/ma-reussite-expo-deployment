import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  ParentActivityScreen,
  ParentGlobalHomeScreen,
  ParentGroupScreen,
  ParentHomeScreen,
  ParentHomeScreensWrapper,
  ParentNoteScreen,
  ParentPaymentScreen,
} from "../screens";
import MA_REUSSITE_CUSTOM_COLORS from "../themes/variables";
import { AppProvider } from "../hooks/AppProvider";

const Tab = createBottomTabNavigator();

export const ParentTabNavigator = () => {
  const propagedRoute = useRoute();
  return (
    <AppProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            route.params = propagedRoute?.params;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Payment") {
              iconName = "payment";
            } else if (route.name === "Groups") {
              iconName = "group";
            } else if (route.name === "Notes") {
              iconName = "timeline";
            } else if (route.name === "Activities") {
              iconName = "notifications";
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
            minHeight: "7%",
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={ParentHomeScreen}
          options={{ tabBarLabel: "Home" }}
        />
        <Tab.Screen
          name="Payment"
          component={ParentPaymentScreen}
          options={{ tabBarLabel: "Payement" }}
        />
        <Tab.Screen
          name="Groups"
          component={ParentGroupScreen}
          options={{ tabBarLabel: "Groupes" }}
        />
        <Tab.Screen
          name="Notes"
          component={ParentNoteScreen}
          options={{ tabBarLabel: "Notes" }}
        />
        <Tab.Screen
          name="Activities"
          component={ParentActivityScreen}
          options={{ tabBarLabel: "Activités" }}
        />
      </Tab.Navigator>
    </AppProvider>
  );
};

// export default ParentTabNavigator;
