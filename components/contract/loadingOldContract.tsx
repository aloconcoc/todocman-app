import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const LoadingPopup = ({ visible, setVisible, oldName }: any) => {
  const [progress, setProgress] = useState(0);
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (visible) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 99) {
            clearInterval(interval as NodeJS.Timeout);
            return 99;
          }
          return prevProgress + 3;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }; // Clear interval on component unmount or when `visible` changes
  }, [visible]);

  const onClose = () => {
    setVisible(false);
    setProgress(0); // Reset progress when closing
  };

  if (!visible) return null; // Don't render anything if not visible

  return (
    <View style={[styles.overlay]}>
      <View style={styles.activityIndicatorWrapper}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>x</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {oldName}
          </Text>
          <ActivityIndicator size="small" color="dodgerblue" />
        </View>
        {/* <Text style={styles.progressText}>{progress}%</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 200,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    elevation: 4,
    padding: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    borderRadius: 12,
    marginTop: -10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default LoadingPopup;
