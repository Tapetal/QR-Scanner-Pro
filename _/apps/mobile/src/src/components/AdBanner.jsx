import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import mobileAds from 'react-native-google-mobile-ads';

const adUnitId = Platform.select({
  ios: __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-5036330009914748/3890610985",
  android: __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-5036330009914748/8460411385",
});

export default function AdBanner() {
  useEffect(() => {                    // ✅ INSIDE the component now
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('✅ AdMob initialized successfully');
        console.log('Adapter statuses:', adapterStatuses);
      })
      .catch(error => {
        console.error('❌ AdMob initialization failed:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => console.log('✅ Banner ad loaded successfully')}
        onAdFailedToLoad={(error) => {
          console.error('❌ Banner ad failed to load:', error.code, error.message);
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
    minHeight: 50,
  },
});