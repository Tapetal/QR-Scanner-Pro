import mobileAds from "react-native-google-mobile-ads";

let initializationPromise;

export const initializeMobileAds = () => {
  if (!initializationPromise) {
    initializationPromise = mobileAds()
      .initialize()
      .catch((error) => {
        initializationPromise = null;
        throw error;
      });
  }

  return initializationPromise;
};
