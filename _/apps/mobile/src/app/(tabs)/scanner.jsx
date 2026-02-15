import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  Share,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Copy, ExternalLink, Share2, X } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import mobileAds from 'react-native-google-mobile-ads';
import AdBanner from "../../components/AdBanner";

// CRITICAL: Initialize AdMob
mobileAds()
  .initialize()
  .then(adapterStatuses => {
    console.log('✅ AdMob initialized in Scanner');
  })
  .catch(error => {
    console.error('❌ AdMob init error:', error);
  });

// Storage helper
const addToHistory = async (scanData) => {
  try {
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    const historyKey = "qr_scan_history";
    const existing = await AsyncStorage.getItem(historyKey);
    const history = existing ? JSON.parse(existing) : [];
    
    const newEntry = {
      ...scanData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    };
    
    // Keep last 20 scans
    const updated = [newEntry, ...history].slice(0, 20);
    await AsyncStorage.setItem(historyKey, JSON.stringify(updated));
  } catch (error) {
    console.log("Error saving to history:", error);
  }
};

// YOUR ACTUAL AD UNIT ID FROM ADMOB
// Go to: https://apps.admob.google.com/ → QR Scanner Pro → Ad units → "Scan Interstitial"
// Copy the FULL ad unit ID and paste below
const adUnitId = Platform.select({
  ios: __DEV__
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-5036330009914748/4329594688", // Your iOS Interstitial ID
  android: __DEV__
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-5036330009914748/9526081045", // REPLACE with "Scan Interstitial" ID
});

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

 function ScanScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  // Load interstitial ad
  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('✅ Interstitial ad loaded');
        setInterstitialLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('📱 Interstitial ad closed');
        setInterstitialLoaded(false);
        // Load next ad
        interstitial.load();
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('❌ Interstitial ad error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        setInterstitialLoaded(false);
      }
    );

    // Start loading the first ad
    console.log('🔄 Loading first interstitial ad...');
    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  // Show interstitial ad after every 3 scans
  useEffect(() => {
    if (scanCount > 0 && scanCount % 3 === 0 && interstitialLoaded) {
      console.log(`📢 Showing interstitial ad after ${scanCount} scans`);
      interstitial.show().catch(error => {
        console.error('❌ Error showing interstitial:', error);
      });
    }
  }, [scanCount, interstitialLoaded]);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setResult({ type, data });
    setScanCount((prev) => prev + 1);

    // Save to history automatically
    await addToHistory({ type, data, category: "scan" });
  };

  const handleClose = () => {
    setScanned(false);
    setResult(null);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(result.data);
    Alert.alert("Copied", "Text copied to clipboard");
  };

  const handleOpenLink = async () => {
    try {
      const supported = await Linking.canOpenURL(result.data);
      if (supported) {
        await Linking.openURL(result.data);
      } else {
        Alert.alert("Error", "Cannot open this URL");
      }
    } catch (err) {
      Alert.alert("Error", "Invalid URL");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: result.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const isUrl =
    result?.data?.startsWith("http") || result?.data?.startsWith("www");

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "pdf417",
            "aztec",
            "datamatrix",
          ],
        }}
      />

      <View style={[styles.overlay, { top: insets.top + 20 }]}>
        <Text style={styles.overlayText}>Align QR code within the frame</Text>
      </View>

      <View style={styles.scannerFrame} />

      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <AdBanner />
      </View>

      <Modal
        visible={!!result}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan Result</Text>
              <TouchableOpacity onPress={handleClose}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.resultContainer}>
              <Text style={styles.resultType}>{result?.type}</Text>
              <Text style={styles.resultText}>{result?.data}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
                <Copy size={20} color="#fff" />
                <Text style={styles.actionBtnText}>Copy</Text>
              </TouchableOpacity>

              {isUrl && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.primaryBtn]}
                  onPress={handleOpenLink}
                >
                  <ExternalLink size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Open</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                <Share2 size={20} color="#fff" />
                <Text style={styles.actionBtnText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  resultContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultType: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  resultText: {
    fontSize: 16,
    color: "#000",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionBtn: {
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ScanScreen;