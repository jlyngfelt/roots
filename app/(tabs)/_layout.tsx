import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/design-system";
import { router, Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarStyle: {
          backgroundColor: Colors.primary,
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
        headerTitle: () => (
          <IconSymbol size={32} name="leaf.fill" color={Colors.secondary} />
        ),
        headerStyle: {
          backgroundColor: Colors.primary,
          height: 110,
        },
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
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
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <IconSymbol
                size={30}
                name="chevron.left"
                color={Colors.secondary}
              />
            </Pressable>
          ),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <IconSymbol
                size={30}
                name="chevron.left"
                color={Colors.secondary}
              />
            </Pressable>
          ),
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
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <IconSymbol
                size={30}
                name="chevron.left"
                color={Colors.secondary}
              />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.push("/settings")}>
              <IconSymbol size={30} name="gearshape" color={Colors.secondary} />
            </Pressable>
          ),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="person" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          href: null,
          headerLeft: () => (
            <Pressable onPress={() => router.push("/(tabs)")}>
              <IconSymbol
                size={30}
                name="chevron.left"
                color={Colors.secondary}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          href: null,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <IconSymbol
                size={30}
                name="chevron.left"
                color={Colors.secondary}
              />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
