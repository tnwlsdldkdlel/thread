import { Redirect, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "./auth";

export default function Login() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => Boolean(s.accessToken && s.user));

  if (isLoggedIn) {
    return <Redirect href="/(tabs)"></Redirect>;
  }

  const onLogin = async () => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "ooooohsu",
          password: "password",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`로그인 실패: ${data.message}`);
        return;
      } else {
        login(data);
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
      }}
    >
      <Pressable onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
      <Pressable style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
  },
});
