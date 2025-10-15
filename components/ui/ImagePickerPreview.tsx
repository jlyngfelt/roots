import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { ImageEditor } from "./ImageEditor";
import { useState } from "react";

interface ImagePickerPreviewProps {
  imageUrl: string | null;
  onPress: () => void;
  onEditComplete?: (editedUri: string) => void;
  isUploading: boolean;
  size?: number;
  enableEditor?: boolean;
}

export function ImagePickerPreview({
  imageUrl,
  onPress,
  onEditComplete,
  isUploading,
  size = 240,
  enableEditor = true,
}: ImagePickerPreviewProps) {
  const [showEditor, setShowEditor] = useState(false);

  const handleImagePress = () => {
    if (imageUrl && enableEditor) {
      Alert.alert("", "", [
        { text: "Redigera", onPress: () => setShowEditor(true) },
        { text: "Byt bild", onPress: onPress },
        { text: "Avbryt", style: "cancel" },
      ]);
    } else {
      onPress();
    }
  };

  const handleEditorSave = (editedUri: string) => {
    setShowEditor(false);
    if (onEditComplete) {
      onEditComplete(editedUri);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handleImagePress} disabled={isUploading}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: size, height: size }}
          />
        ) : (
          <View
            style={{ width: size, height: size, backgroundColor: "#ccc" }}
          />
        )}
        {isUploading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <ActivityIndicator />
          </View>
        )}
      </TouchableOpacity>

      {imageUrl && enableEditor && (
        <ImageEditor
          visible={showEditor}
          imageUri={imageUrl}
          onSave={handleEditorSave}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </>
  );
}
