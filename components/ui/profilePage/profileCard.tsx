import { IconSymbol } from "@/components/ui/icon-symbol";
import { Styles } from "@/constants/design-system";
import { Image, StyleSheet, Text, View } from "react-native";
import { UserProfile } from "../../../interfaces/index";

interface ProfileCardProps {
  userProfile: Partial<UserProfile> | null;
}

export function ProfileCard({ userProfile }: ProfileCardProps) {
  const profilePictureLink = require("../../../assets/profilePicture.png");
  return (
    <View style={styles.profileContainer}>
      <View style={styles.flex}>
        {userProfile?.profileImageUrl ? (
          <Image
            source={{ uri: userProfile.profileImageUrl }}
            style={styles.profilePicture}
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
          <Text>{userProfile?.bio}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    gap: 16,
  },
  profileContainer: {
    padding: 16,
  },
  profilePicture: {
    width: 160,
    height: 160,
    borderRadius: 16,
  },
  creditContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  profileInformation: {
    flexDirection: "column",
    gap: 8,
    width: 200,
  },
});
