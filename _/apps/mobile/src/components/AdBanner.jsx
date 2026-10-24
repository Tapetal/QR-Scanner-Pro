import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useTheme } from "../utils/ThemeProvider";
import { initializeMobileAds } from "../utils/mobileAds";

const adUnitId = Platform.select({
  ios: __DEV__ ? TestIds.BANNER : "ca-app-pub-5036330009914748/3890610985",
  android: __DEV__ ? TestIds.BANNER : "ca-app-pub-5036330009914748/8460411385",
});

export default function AdBanner() {
  const { colors } = useTheme();
  const [adsInitialized, setAdsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    initializeMobileAds()
      .then(() => {
        if (mounted) setAdsInitialized(true);
      })
      .catch((error) => {
        console.error("AdMob initialization failed:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {adsInitialized && (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdFailedToLoad={(error) => {
            console.error("Banner ad failed to load:", error);
          }}
        />
      )}
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
    minHeight: 50,
  },
});