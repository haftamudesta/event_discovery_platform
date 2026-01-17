import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from "react";
import ThemedView from "@/components/Themedview";
import ThemedText from "@/components/Themedtext";
import Spacer from "@/components/Spacer";
import { Link, useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useAuth } from "@/hooks/useUser";
import { Colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { validateEmail } from "@/utils/validation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateForm = useCallback((): boolean => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return false;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    return true;
  }, [email, password]);

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      console.log("Attempting sign in with:", { email });
      await signIn(email, password, rememberMe);

      console.log("Sign in successful!");
      router.replace("/home");
    } catch (error: any) {
      console.error("Sign in error:", error);

      const errorMessage = error.message?.toLowerCase() || "";
      let userMessage = "Sign in failed. Please try again.";

      if (
        errorMessage.includes("invalid credentials") ||
        errorMessage.includes("wrong password") ||
        errorMessage.includes("invalid login")
      ) {
        userMessage = "Invalid email or password. Please try again.";
      } else if (
        errorMessage.includes("user not found") ||
        errorMessage.includes("email not found")
      ) {
        userMessage = "No account found with this email. Please sign up.";
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("connection")
      ) {
        userMessage = "Network error. Please check your internet connection.";
      } else if (errorMessage.includes("too many requests")) {
        userMessage = "Too many attempts. Please try again later.";
      } else if (errorMessage.includes("account not verified")) {
        userMessage = "Please verify your email address before signing in.";
      }

      setError(userMessage);
      Alert.alert("Sign In Failed", userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert(
        "Email Required",
        "Please enter your email address to reset your password.",
      );
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    Alert.alert(
      "Reset Password",
      `We'll send a password reset link to ${email}. Would you like to continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Reset Link",
          style: "default",
          onPress: () => {
            // TODO: Implement password reset
            Alert.alert(
              "Check Your Email",
              "Password reset instructions have been sent to your email.",
            );
          },
        },
      ],
    );
  };

  return (
    <ThemedView safe={false} style={styles.container}>
      <View style={styles.header}>
        <ThemedText bold={true} variant="heading" style={styles.title}>
          Welcome Back
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign in to continue to your account
        </ThemedText>
      </View>

      <Spacer height={32} />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Email Address</ThemedText>
          <ThemedTextInput
            placeholder="Enter your email"
            style={[styles.input, error.includes("email") && styles.inputError]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError("");
            }}
            value={email}
            editable={!isSubmitting}
          />
        </View>

        <Spacer height={16} />

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <View style={styles.passwordContainer}>
            <ThemedTextInput
              placeholder="Enter your password"
              style={[
                styles.input,
                styles.passwordInput,
                error.includes("password") && styles.inputError,
              ]}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError("");
              }}
              value={password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color={isSubmitting ? Colors.textSecondary : Colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Spacer height={8} />

        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            disabled={isSubmitting}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            >
              {rememberMe && <Feather name="check" size={14} color="#fff" />}
            </View>
            <ThemedText style={styles.rememberMeText}>Remember me</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleForgotPassword}
            disabled={isSubmitting}
          >
            <ThemedText style={styles.forgotPasswordText}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>
        </View>

        <Spacer height={24} />

        {error && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={20} color={Colors.warning} />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        <ThemedButton
          onPress={handleSubmit}
          disabled={isSubmitting || !email.trim() || !password.trim()}
          style={[
            styles.submitButton,
            (isSubmitting || !email.trim() || !password.trim()) &&
              styles.buttonDisabled,
          ]}
          variant="primary"
        >
          {isSubmitting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <ThemedText style={styles.loadingText}>Signing In...</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.buttonText}>Sign In</ThemedText>
          )}
        </ThemedButton>
      </View>

      <Spacer height={32} />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <ThemedText style={styles.dividerText}>OR</ThemedText>
        <View style={styles.divider} />
      </View>

      <Spacer height={24} />

      <View style={styles.socialButtonsContainer}>
        <ThemedButton
          onPress={() => {}}
          style={styles.socialButton}
          variant="outline"
          disabled={isSubmitting}
        >
          <Feather name="github" size={20} color={Colors.textPrimary} />
          <ThemedText style={styles.socialButtonText}>
            Continue with GitHub
          </ThemedText>
        </ThemedButton>

        <Spacer height={16} />

        <ThemedButton
          onPress={() => {}}
          style={styles.socialButton}
          variant="outline"
          disabled={isSubmitting}
        >
          <Feather name="globe" size={20} color={Colors.warning} />
          <ThemedText style={styles.socialButtonText}>
            Continue with Google
          </ThemedText>
        </ThemedButton>
      </View>

      <Spacer height={32} />

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Don't have an account?{" "}
          <Link href="/sign_up" style={styles.link}>
            Sign Up
          </Link>
        </ThemedText>

        <Spacer height={16} />

        <Link href="/" style={styles.homeLink}>
          <Feather name="home" size={16} color={Colors.primary} />
          <ThemedText style={styles.homeLinkText}>Back to Home</ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 22,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: Colors.textTertiary,
  },
  input: {
    width: "100%",
  },
  inputError: {
    borderColor: Colors.warning,
    borderWidth: 1,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 10,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.warning,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.warning,
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
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
  socialButtonsContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
    borderRadius: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    width: "100%",
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
  },
  link: {
    color: Colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  homeLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  homeLinkText: {
    color: Colors.primary,
    textAlign: "center",
    fontWeight: "500",
  },
});
