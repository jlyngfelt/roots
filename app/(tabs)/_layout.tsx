import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/design-system";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.background,
        tabBarStyle: {
          backgroundColor: Colors.secondary,
          height: 70,
          paddingTop: 12,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          overflow: "hidden",
          marginHorizontal: 0,
          position: "absolute",
          borderTopWidth: 0,
        },
        headerShown: true,
        headerTitle: "",
        headerStyle: {
          backgroundColor: Colors.secondary,
          height: 100,
        },
        headerShadowVisible: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="apple.meditate" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="ellipsis.message" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "upload",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={32}
              name={focused ? "heart.fill" : "heart"}
              color={focused ? "#ff7abd" : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
