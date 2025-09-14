import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Login() {
  const isLoggedIn = true;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)"></Redirect>;
  }

  return (
    <View>
      <Text>로그인</Text>
    </View>
  );
}
