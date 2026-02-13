import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

// IMPORTANT: Replace these with your actual AdMob IDs from https://apps.admob.com
const adUnitId = Platform.select({
  ios: __DEV__ ? TestIds.BANNER : "ca-app-pub-5036330009914748/9333471940", // Replace with your iOS ad unit ID
  android: __DEV__ ? TestIds.BANNER : "ca-app-pub-5036330009914748/5090974609", // Replace with your Android ad unit ID
});

export default function AdBanner() {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
});


