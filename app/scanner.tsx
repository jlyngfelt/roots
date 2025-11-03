import ScanTransferCode from "@/components/ScanTransferCode";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function ScanTransferScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSuccess = () => {
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <ScanTransferCode userId={user?.uid!} onSuccess={handleSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});