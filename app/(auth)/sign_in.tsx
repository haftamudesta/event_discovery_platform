import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ThemedView from "@/components/Themedview";
import ThemedText from "@/components/Themedtext";
import Spacer from "@/components/Spacer";
import { Link, useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useAuth } from "@/hooks/useUser";
import { Colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setError("");
      if (!email.trim() || !password.trim()) {
        setError("Error,Please fill in all fields");
        return;
      }
      if (password.length < 8) {
        setError("Error, Invalid credentials");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Error,Please enter a valid email address");
        return;
      }
      setIsSubmitting(true);
      await signIn(email, password);
      router.replace("/");
    } catch (error) {
      setError(`Error, Sign up failed. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <ThemedView safe={false} style={styles.container}>
      <ThemedText bold={true} variant="heading" style={styles.title}>
        Sign In To Start
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Create an account to access all features
      </ThemedText>
      <Spacer height={24} />
      <ThemedTextInput
        placeholder="Enter your email"
        style={{ width: "95%" }}
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <Spacer height={12} />
      <ThemedTextInput
        placeholder="Enter your password"
        style={{ width: "95%" }}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Spacer height={12} />
      {error && <Text style={styles.error}>{error}</Text>}

      <ThemedButton onPress={handleSubmit}>
        <Text style={{ color: "#f2f2f2", textAlign: "center" }}>Sin In</Text>
      </ThemedButton>
      <Spacer height={24} />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <ThemedText style={styles.dividerText}>OR</ThemedText>
        <View style={styles.divider} />
      </View>

      <Spacer height={20} />

      <ThemedButton
        onPress={() => {}}
        style={styles.socialButton}
        variant="outline"
      >
        <Feather name="github" size={20} color={Colors.secondaryLight} />
        <ThemedText style={styles.socialButtonText}>
          Continue with GitHub
        </ThemedText>
      </ThemedButton>
      <Spacer height={24} />
      <ThemedButton
        onPress={() => {}}
        style={styles.socialButton}
        variant="outline"
      >
        <Feather name="globe" size={20} color={Colors.warning} />
        <ThemedText style={styles.socialButtonText}>
          Continue with Google
        </ThemedText>
      </ThemedButton>
      <Spacer height={12} />
      <ThemedText>
        Don't have an account?Please{" "}
        <Link href="/sign_up" style={styles.link}>
          Register
        </Link>
      </ThemedText>
      <Spacer height={12} />
      <Link href="/" style={styles.backhome}>
        Back to Home
      </Link>
    </ThemedView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 30,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.7,
  },
  submitButton: {
    width: "70%",
  },
  link: {
    color: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "500",
    width: "100%",
    fontSize: 16,
    cursor: "pointer",
  },
  backhome: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 100,
    textAlign: "center",
    fontWeight: "500",
    width: "70%",
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: Colors.warning,
    padding: 10,
    backgroundColor: "#f5c1c8",
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 24,
    marginHorizontal: 10,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.primaryDark,
  },
  dividerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.surface,
    backgroundColor: Colors.primaryLight,
    borderRadius: 60,
    width: "70%",
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    cursor: "pointer",
  },
});
