import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logOut } from "../../auth";

export default function SettingsScreen() {
  const router = useRouter();

  const SettingItem = ({
    title,
    onPress,
    isLogout = false,
    iconName = "chevron.right",
  }: {
    title: string;
    onPress: () => void;
    isLogout?: boolean;
    iconName?: any;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.settingText, isLogout && styles.logoutText]}>
        {title}
      </Text>
      <IconSymbol
        name={iconName}
        size={28}
        color={isLogout ? Colors.warning : Colors.text}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Inställningar</Text>
      <View style={styles.divider} />

      <View style={styles.section}>
        <SettingItem
          title="Redigera profil"
          onPress={() => router.push("/edit-profile")}
        />

        <View style={styles.divider} />

        <SettingItem title="Uppdatera e-postadress" onPress={() => {}} />

        <View style={styles.divider} />

        <SettingItem title="Byt lösenord" onPress={() => router.push("/update-password")} />

        <View style={styles.divider} />

        <SettingItem
          title="Logga ut"
          onPress={() => logOut()}
          isLogout
          iconName="rectangle.portrait.and.arrow.right"
        />
        <View style={styles.divider} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  heading: {
    ...Styles.heading2,
    textAlign: "center",
    marginVertical: Spacing.m,
  },
  section: {
    backgroundColor: Colors.secondary,
    marginHorizontal: 0,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    backgroundColor: Colors.secondary,
  },
  settingText: {
    ...Styles.heading3,
    color: Colors.text,
  },
  logoutText: {
    color: Colors.warning,
  },
  divider: {
    height: 1.5,
    backgroundColor: Colors.grey,
    marginLeft: 0,
  },
});
