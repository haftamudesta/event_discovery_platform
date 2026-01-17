import Spacer from "@/components/Spacer";
import ThemedText from "@/components/Themedtext";
import ThemedView from "@/components/Themedview";
import { Link, useRouter } from "expo-router";
import React, { useMemo, useState, useCallback } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useAuth } from "@/hooks/useUser";
import { Colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import ThemedLogo from "@/components/ThemedLogo";
import { validateEmail, validatePassword } from "@/utils/validation";
import { SignupDto, UserRole } from "@/types/user";
interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  phoneNumber?: string;
  bio?: string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const handleInputChange = useCallback(
    (field: keyof SignUpFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
      if (errors.form) {
        setErrors((prev) => ({ ...prev, form: "" }));
      }
    },
    [errors],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation.isValid && passwordValidation.errors) {
      newErrors.password = passwordValidation.errors[0];
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const getErrorMessage = useCallback((error: any): string => {
    if (!error?.message) return "Sign up failed. Please try again.";

    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes("email-already-in-use")) {
      return "This email is already registered. Please sign in or use a different email.";
    } else if (errorMessage.includes("weak-password")) {
      return "Password is too weak. Please choose a stronger password with at least 8 characters including letters and numbers.";
    } else if (errorMessage.includes("network-request-failed")) {
      return "Network error. Please check your internet connection and try again.";
    } else if (errorMessage.includes("invalid-email")) {
      return "Invalid email address. Please check and try again.";
    } else if (errorMessage.includes("operation-not-allowed")) {
      return "Sign up is temporarily unavailable. Please try again later.";
    } else if (errorMessage.includes("too-many-requests")) {
      return "Too many attempts. Please try again later.";
    }

    return "Sign up failed. Please try again.";
  }, []);

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const signupDto: SignupDto = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.agreeToTerms,
        // Add optional fields if you have them in your form
        phoneNumber: formData.phoneNumber || undefined,
        bio: formData.bio || undefined,
        role: UserRole.USER,
        interests: [],
      };

      await signUp(signupDto);
      router.replace("/sign_in");
      // router.replace({
      //   pathname: "/sign_in",
      //   params: {
      //     message: "Account created successfully! Please sign in.",
      //     email: formData.email,
      //   },
      // });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      if (error.message?.includes("email-already-in-use")) {
        Alert.alert(
          "Account Exists",
          "An account with this email already exists. Would you like to sign in instead?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Sign In",
              style: "default",
              onPress: () => router.push("/sign_in"),
            },
          ],
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, signUp, router, getErrorMessage]);
  const { passwordBars, passwordStrengthText } = useMemo(() => {
    const len = formData.password.length;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

    let strength = 0;
    if (len > 0) strength++;
    if (len >= 8) strength++;
    if (hasUpperCase && hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;

    const thresholds = [0, 1, 2, 3, 4, 5];
    const bars = thresholds.slice(0, 5).map((_, index) => ({
      active: index < strength,
      color:
        strength <= 1
          ? Colors.warning
          : strength <= 2
            ? "#f59e0b"
            : strength <= 3
              ? "#3b82f6"
              : strength <= 4
                ? "#10b981"
                : Colors.success,
    }));

    let text = "";
    if (len === 0) text = "";
    else if (strength <= 1) text = "Very Weak";
    else if (strength <= 2) text = "Weak";
    else if (strength <= 3) text = "Fair";
    else if (strength <= 4) text = "Good";
    else text = "Strong";

    return { passwordBars: bars, passwordStrengthText: text };
  }, [formData.password]);

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim().length >= 2 &&
      validateEmail(formData.email) &&
      formData.password.length >= 8 &&
      formData.confirmPassword === formData.password &&
      formData.agreeToTerms
    );
  }, [formData]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView safe={false} style={styles.container}>
            <View style={styles.logoContainer}>
              <ThemedLogo size={120} />
            </View>

            <ThemedText bold={true} variant="heading" style={styles.title}>
              Create Your Account
            </ThemedText>

            <ThemedText style={styles.subtitle}>
              Join us to get started with amazing features
            </ThemedText>

            <Spacer height={32} />

            <ThemedView safe={false} style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Full Name</ThemedText>
                <ThemedTextInput
                  placeholder="Haftamu Desta"
                  style={[styles.input, errors.name && styles.inputError]}
                  onChangeText={(value) => handleInputChange("name", value)}
                  value={formData.name}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isSubmitting}
                />
                {errors.name && (
                  <ThemedText style={styles.fieldError}>
                    {errors.name}
                  </ThemedText>
                )}
              </View>

              <Spacer height={16} />
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Email Address</ThemedText>
                <ThemedTextInput
                  placeholder="haftamu@example.com"
                  style={[styles.input, errors.email && styles.inputError]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(value) => handleInputChange("email", value)}
                  value={formData.email}
                  editable={!isSubmitting}
                />
                {errors.email && (
                  <ThemedText style={styles.fieldError}>
                    {errors.email}
                  </ThemedText>
                )}
              </View>

              <Spacer height={16} />
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Password</ThemedText>
                <View style={styles.passwordInputContainer}>
                  <ThemedTextInput
                    placeholder="Enter Your Password"
                    style={[
                      styles.input,
                      styles.passwordInput,
                      errors.password && styles.inputError,
                    ]}
                    onChangeText={(value) =>
                      handleInputChange("password", value)
                    }
                    value={formData.password}
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
                      color={
                        isSubmitting ? Colors.textSecondary : Colors.primary
                      }
                    />
                  </TouchableOpacity>
                </View>

                {errors.password && (
                  <ThemedText style={styles.fieldError}>
                    {errors.password}
                  </ThemedText>
                )}
                {formData.password.length > 0 && (
                  <View style={styles.passwordStrengthContainer}>
                    <View style={styles.passwordBarsContainer}>
                      {passwordBars.map((bar, index) => (
                        <View
                          key={index}
                          style={[
                            styles.passwordBar,
                            {
                              backgroundColor: bar.active
                                ? bar.color
                                : Colors.primaryDark,
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <View style={styles.passwordStrengthInfo}>
                      <ThemedText
                        style={[
                          styles.passwordStrengthText,
                          {
                            color:
                              passwordBars[passwordBars.length - 1]?.color ||
                              Colors.primaryDark,
                          },
                        ]}
                      >
                        {passwordStrengthText}
                      </ThemedText>
                      <ThemedText style={styles.passwordLength}>
                        {formData.password.length} characters
                      </ThemedText>
                    </View>

                    <View style={styles.passwordRequirements}>
                      <ThemedText style={styles.requirementsTitle}>
                        Password must contain:
                      </ThemedText>
                      <View style={styles.requirementsList}>
                        <View style={styles.requirementItem}>
                          <Feather
                            name={
                              formData.password.length >= 8
                                ? "check-circle"
                                : "circle"
                            }
                            size={14}
                            color={
                              formData.password.length >= 8
                                ? Colors.success
                                : Colors.textSecondary
                            }
                          />
                          <ThemedText style={styles.requirementText}>
                            At least 8 characters
                          </ThemedText>
                        </View>
                        <View style={styles.requirementItem}>
                          <Feather
                            name={
                              /[A-Z]/.test(formData.password) &&
                              /[a-z]/.test(formData.password)
                                ? "check-circle"
                                : "circle"
                            }
                            size={14}
                            color={
                              /[A-Z]/.test(formData.password) &&
                              /[a-z]/.test(formData.password)
                                ? Colors.success
                                : Colors.textSecondary
                            }
                          />
                          <ThemedText style={styles.requirementText}>
                            Upper & lowercase letters
                          </ThemedText>
                        </View>
                        <View style={styles.requirementItem}>
                          <Feather
                            name={
                              /\d/.test(formData.password)
                                ? "check-circle"
                                : "circle"
                            }
                            size={14}
                            color={
                              /\d/.test(formData.password)
                                ? Colors.success
                                : Colors.textSecondary
                            }
                          />
                          <ThemedText style={styles.requirementText}>
                            At least one number
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
              <Spacer height={16} />
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Confirm Password</ThemedText>
                <View style={styles.passwordInputContainer}>
                  <ThemedTextInput
                    placeholder="Re-enter your password"
                    style={[
                      styles.input,
                      styles.passwordInput,
                      errors.confirmPassword && styles.inputError,
                    ]}
                    onChangeText={(value) =>
                      handleInputChange("confirmPassword", value)
                    }
                    value={formData.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isSubmitting}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color={
                        isSubmitting ? Colors.textSecondary : Colors.primary
                      }
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <ThemedText style={styles.fieldError}>
                    {errors.confirmPassword}
                  </ThemedText>
                )}
              </View>

              <Spacer height={20} />
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() =>
                  handleInputChange("agreeToTerms", !formData.agreeToTerms)
                }
                disabled={isSubmitting}
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.agreeToTerms && styles.checkboxChecked,
                    errors.agreeToTerms && styles.checkboxError,
                  ]}
                >
                  {formData.agreeToTerms && (
                    <Feather name="check" size={16} color="#fff" />
                  )}
                </View>
                <ThemedText style={styles.termsText}>
                  I agree to the{" "}
                  <Link href="/terms" style={styles.termsLink}>
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" style={styles.termsLink}>
                    Privacy Policy
                  </Link>
                </ThemedText>
              </TouchableOpacity>
              {errors.agreeToTerms && (
                <ThemedText style={[styles.fieldError, styles.termsError]}>
                  {errors.agreeToTerms}
                </ThemedText>
              )}

              <Spacer height={24} />
              {errors.form && (
                <View style={styles.formErrorContainer}>
                  <Feather
                    name="alert-circle"
                    size={20}
                    color={Colors.warning}
                  />
                  <ThemedText style={styles.formError}>
                    {errors.form}
                  </ThemedText>
                </View>
              )}
              <ThemedButton
                onPress={handleSubmit}
                disabled={isSubmitting || !isFormValid}
                style={[
                  styles.button,
                  (!isFormValid || isSubmitting) && styles.buttonDisabled,
                ]}
                variant="primary"
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <ThemedText style={styles.loadingText}>
                      Creating Account...
                    </ThemedText>
                  </View>
                ) : (
                  <ThemedText>Create Account</ThemedText>
                )}
              </ThemedButton>
            </ThemedView>

            <Spacer height={32} />
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Already have an account?{" "}
                <Link href="/(auth)/sign_in" style={styles.link} replace>
                  Sign In
                </Link>
              </ThemedText>

              <Spacer height={16} />

              <Link href="/" style={styles.homeLink} replace>
                <Feather name="home" size={16} color={Colors.primary} />
                <ThemedText style={styles.homeLinkText}>
                  Back to Home
                </ThemedText>
              </Link>
            </View>
          </ThemedView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
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
  passwordInputContainer: {
    position: "relative",
    width: "100%",
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
  button: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    backgroundColor: Colors.primary,
    color: Colors.textPrimary,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    padding: 8,
    borderRadius: 16,
    width: "95%",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
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
  footer: {
    alignItems: "center",
    width: "100%",
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
  },
  formErrorContainer: {
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
  formError: {
    color: Colors.warning,
    fontSize: 14,
    flex: 1,
  },
  fieldError: {
    color: Colors.warning,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  termsError: {
    marginTop: 8,
    marginLeft: 0,
  },
  passwordStrengthContainer: {
    marginTop: 12,
  },
  passwordBarsContainer: {
    flexDirection: "row",
    gap: 4,
    height: 6,
  },
  passwordBar: {
    flex: 1,
    height: "100%",
    borderRadius: 3,
  },
  passwordStrengthInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  passwordLength: {
    fontSize: 12,
    opacity: 0.6,
  },
  passwordRequirements: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.textSecondary,
  },
  requirementsList: {
    gap: 6,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxError: {
    borderColor: Colors.warning,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
