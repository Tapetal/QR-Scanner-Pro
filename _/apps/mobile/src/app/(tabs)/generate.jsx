import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Type, Link, Wifi, AlertCircle } from "lucide-react-native";
import { Share } from "react-native";
import AdBanner from "../../components/AdBanner";
import KeyboardAvoidingAnimatedView from "../../components/KeyboardAvoidingAnimatedView";
import { ThemedText as Text, useTheme } from "../../utils/ThemeProvider";

const TYPES = [
  { id: "text", label: "Text", icon: Type },
  { id: "url", label: "URL", icon: Link },
  { id: "wifi", label: "WiFi", icon: Wifi },
];

function GenerateScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [activeType, setActiveType] = useState("text");
  const [content, setContent] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  const generateQR = () => {
    let data = "";
    if (activeType === "text") {
      data = content;
    } else if (activeType === "url") {
      data = content;
    } else if (activeType === "wifi") {
      data = `WIFI:T:WPA;S:${ssid};P:${password};;`;
    }

    if (!data) return;

    // Show privacy consent for WiFi (contains sensitive password data)
    if (activeType === "wifi" && !hasConsented) {
      setShowPrivacyConsent(true);
      return;
    }

    // Generate QR code after consent (or for non-sensitive data)
    proceedWithGeneration(data);
  };

  const proceedWithGeneration = (data) => {
    // Using a public API for QR generation
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      data
    )}`;
    setGeneratedUrl(url);
    setShowPrivacyConsent(false);
  };

  const handleConsent = () => {
    setHasConsented(true);
    const data = `WIFI:T:WPA;S:${ssid};P:${password};;`;
    proceedWithGeneration(data);
  };

  const handleDeclineConsent = () => {
    setShowPrivacyConsent(false);
    Alert.alert(
      "QR Code Not Generated",
      "To generate a WiFi QR code, we need your consent to send the network information to our QR code generation service.",
      [{ text: "OK" }]
    );
  };

  const handleShare = async () => {
    if (!generatedUrl) return;
    try {
      await Share.share({
        message: `Check out this QR Code: ${generatedUrl}`,
        url: generatedUrl, // iOS only
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Generate QR</Text>
      </View>

      <View style={styles.typeSelector}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeScroll}
        >
          {TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeBtn,
                activeType === type.id && styles.activeTypeBtn,
              ]}
              onPress={() => {
                setActiveType(type.id);
                setGeneratedUrl(null);
                setHasConsented(false); // Reset consent when switching types
              }}
            >
              <type.icon
                size={18}
                color={
                  activeType === type.id ? "#fff" : colors.secondaryText
                }
              />
              <Text
                style={[
                  styles.typeText,
                  activeType === type.id && styles.activeTypeText,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {activeType === "wifi" ? (
            <>
              <Text style={styles.label}>Network Name (SSID)</Text>
              <TextInput
                style={styles.input}
                value={ssid}
                onChangeText={setSsid}
                placeholder="e.g. MyHomeWiFi"
                placeholderTextColor={colors.mutedText}
                selectionColor={colors.primary}
              />
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="WiFi Password"
                placeholderTextColor={colors.mutedText}
                selectionColor={colors.primary}
                secureTextEntry
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>
                {activeType === "url" ? "Website URL" : "Content"}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={content}
                onChangeText={setContent}
                placeholder={
                  activeType === "url"
                    ? "https://example.com"
                    : "Enter text here"
                }
                placeholderTextColor={colors.mutedText}
                selectionColor={colors.primary}
                multiline={activeType === "text"}
              />
            </>
          )}

          <TouchableOpacity style={styles.generateBtn} onPress={generateQR}>
            <Text style={styles.generateBtnText}>Generate Code</Text>
          </TouchableOpacity>
        </View>

        {generatedUrl && (
          <View style={styles.resultContainer}>
            <View style={styles.qrWrapper}>
              <Image
                source={{ uri: generatedUrl }}
                style={styles.qrImage}
                contentFit="contain"
              />
            </View>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.shareBtnText}>Share QR Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Privacy Consent Modal */}
      <Modal
        visible={showPrivacyConsent}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDeclineConsent}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.consentModal}>
            <View style={styles.iconContainer}>
              <AlertCircle size={48} color="#f59e0b" />
            </View>

            <Text style={styles.consentTitle}>Privacy Notice</Text>

            <Text style={styles.consentText}>
              To generate your WiFi QR code, your network name (SSID) and
              password will be sent to our third-party QR code generation
              service (api.qrserver.com).
            </Text>

            <Text style={styles.consentText}>
              This data is only used to create the QR code image and is not
              stored by the service. The generated QR code will contain your
              WiFi credentials.
            </Text>

            <Text style={[styles.consentText, styles.boldText]}>
              Do you consent to sharing this information?
            </Text>

            <View style={styles.consentButtons}>
              <TouchableOpacity
                style={[styles.consentBtn, styles.declineBtn]}
                onPress={handleDeclineConsent}
              >
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.consentBtn, styles.acceptBtn]}
                onPress={handleConsent}
              >
                <Text style={styles.acceptBtnText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AdBanner />
    </KeyboardAvoidingAnimatedView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  typeSelector: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeScroll: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    gap: 6,
  },
  activeTypeBtn: {
    backgroundColor: colors.primary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.secondaryText,
  },
  activeTypeText: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.primaryText,
  },
  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    color: colors.primaryText,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  generateBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  generateBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.surface,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
  },
  shareBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  consentModal: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  consentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: colors.primaryText,
  },
  consentText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.secondaryText,
    marginBottom: 12,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "600",
    marginTop: 8,
  },
  consentButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  consentBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  declineBtn: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  acceptBtn: {
    backgroundColor: "#2563eb",
  },
  declineBtnText: {
    color: colors.secondaryText,
    fontSize: 16,
    fontWeight: "600",
  },
  acceptBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
export default GenerateScreen;