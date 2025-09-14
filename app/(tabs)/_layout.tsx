import { Tabs, useRouter } from "expo-router";
import Entypo from "../../node_modules/@expo/vector-icons/Entypo";
import Feather from "../../node_modules/@expo/vector-icons/Feather";
import FontAwesome6 from "../../node_modules/@expo/vector-icons/FontAwesome6";
import Ionicons from "../../node_modules/@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarLabel: () => null,
          tabBarIcon(props) {
            return (
              <Entypo
                name="home"
                size={24}
                color={props.focused ? "black" : "gray"}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: () => null,
          tabBarIcon(props) {
            return (
              <Feather
                name="search"
                size={24}
                color={props.focused ? "black" : "gray"}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="add"
        listeners={{
          tabPress(e) {
            e.preventDefault();
            router.navigate("/modal");
          },
        }}
        options={{
          tabBarLabel: () => null,
          tabBarIcon(props) {
            return (
              <FontAwesome6
                name="add"
                size={24}
                color={props.focused ? "black" : "gray"}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarLabel: () => null,
          tabBarIcon(props) {
            return (
              <Feather
                name="heart"
                size={24}
                color={props.focused ? "black" : "gray"}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="[username]"
        options={{
          tabBarLabel: () => null,
          tabBarIcon(props) {
            return (
              <Ionicons
                name="person"
                size={24}
                color={props.focused ? "black" : "gray"}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="following"
        options={{
          tabBarLabel: () => null,
          tabBarIcon(props) {
            return (
              <Ionicons
                name="person"
                size={24}
                color={props.focused ? "black" : "gray"}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
