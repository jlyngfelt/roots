import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TopBar } from "@/components/ui/TopBar";
import { Colors } from "@/constants/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { getTotalUnreadCount } from "@/services/chatService";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function TabLayout() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUnread = async () => {
      const count = await getTotalUnreadCount(user.uid);
      setUnreadCount(count);
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);

    return () => clearInterval(interval);
  }, [user?.uid]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.starkWhite,
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
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          header: () => <TopBar showBackButton={false} />,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? "rgba(226, 232, 215, 0.2)"
                  : "transparent",
                padding: focused ? 10 : 8,
                borderRadius: 16,
              }}
            >
              <IconSymbol
                size={focused ? 34 : 32}
                name="apple.meditate"
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          header: () => <TopBar showBackButton={false} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.accent,
            color: Colors.light,
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? "rgba(226, 232, 215, 0.2)"
                  : "transparent",
                padding: focused ? 10 : 8,
                borderRadius: 16,
              }}
            >
              <IconSymbol
                size={focused ? 34 : 32}
                name="ellipsis.message"
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "upload",
          header: () => <TopBar showBackButton={true} />,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? "rgba(226, 232, 215, 0.2)"
                  : "transparent",
                padding: focused ? 10 : 8,
                borderRadius: 16,
              }}
            >
              <IconSymbol size={focused ? 34 : 32} name="plus" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          header: () => <TopBar showBackButton={true} />,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? "rgba(226, 232, 215, 0.2)"
                  : "transparent",
                padding: focused ? 10 : 8,
                borderRadius: 16,
              }}
            >
              <IconSymbol
                size={focused ? 34 : 32}
                name={focused ? "heart.fill" : "heart"}
                color={focused ? Colors.accent : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Profile",
          header: () => (
            <TopBar showBackButton={true} showSettingsButton={true} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? "rgba(226, 232, 215, 0.2)"
                  : "transparent",
                padding: focused ? 10 : 8,
                borderRadius: 16,
              }}
            >
              <IconSymbol
                size={focused ? 34 : 32}
                name="person"
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          href: null,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          href: null,
          tabBarStyle: { display: "none" },
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      {/* <Tabs.Screen
        name="edit-plant/[plantId]"
        options={{
          title: "Edit Plant",
          href: null,
          header: () => <TopBar showBackButton={true} />,
        }}
      /> */}
      <Tabs.Screen
        name="view-plant/[plantId]"
        options={{
          title: "View Plant",
          href: null,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      <Tabs.Screen
        name="view-profile/[userId]"
        options={{
          title: "View Profile",
          href: null,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          href: null,
          header: () => <TopBar showBackButton={true} />,
        }}
      />
    </Tabs>
  );
}
