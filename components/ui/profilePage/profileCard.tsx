import { IconSymbol } from "@/components/ui/icon-symbol";
import { Styles, Spacing, BorderRadius } from "@/constants/design-system";
import { StyleSheet, Text, View } from "react-native";
import { ProfileCardProps } from "../../../interfaces/index";
import { Image } from "expo-image";

export function ProfileCard({ userProfile }: ProfileCardProps) {
  const profilePictureLink = require("../../../assets/profilePicture.png");
  return (
    <View style={styles.profileContainer}>
      <View style={styles.flex}>
        {userProfile?.profileImageUrl ? (
          <Image
            source={{ uri: userProfile.profileImageUrl }}
            style={styles.profilePicture}
            cachePolicy="memory-disk"
          />
        ) : (
          <Image source={profilePictureLink} style={styles.profilePicture} />
        )}
        <View style={styles.profileInformation}>
          <Text style={Styles.heading1}>{userProfile?.username}</Text>
          <View style={styles.creditContainer}>
            <IconSymbol size={34} name="star.circle.fill" color={"#f2b900"} />
            <Text style={Styles.bodyXL}>{userProfile?.credits}</Text>
          </View>
          <Text style={styles.bio}>{userProfile?.bio}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    gap: Spacing.m,
  },
  profileContainer: {
    padding: Spacing.m,
  },
  profilePicture: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius.xl,
  },
  creditContainer: {
    flexDirection: "row",
    gap: Spacing.s,
    alignItems: "center",
  },
  profileInformation: {
    flexDirection: "column",
    gap: Spacing.s,
    width: 200,
  },
  bio: {
    marginRight: Spacing.m,
  },
});
