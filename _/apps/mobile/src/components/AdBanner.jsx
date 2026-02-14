import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import mobileAds from 'react-native-google-mobile-ads';

// CRITICAL: Initialize AdMob - Must be called before any ads load!
useEffect(() => {
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

// YOUR ACTUAL AD UNIT IDs FROM ADMOB
// Go to: https://apps.admob.google.com/ → QR Scanner Pro → Ad units → "Home Screen Banner"
// Copy the FULL ad unit ID and paste below
const adUnitId = Platform.select({
  ios: __DEV__ 
    ? TestIds.BANNER 
    : "ca-app-pub-5036330009914748/3890610985", // Your iOS Banner ID
  android: __DEV__ 
    ? TestIds.BANNER 
    : "ca-app-pub-5036330009914748/8460411385", // REPLACE with "Home Screen Banner" ID
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
        onAdLoaded={() => {
          console.log('✅ Banner ad loaded successfully');
        }}
        onAdFailedToLoad={(error) => {
          console.error('❌ Banner ad failed to load');
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Using ad unit ID:', adUnitId);
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