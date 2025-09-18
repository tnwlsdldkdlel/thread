import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../auth";

const AnimatedTabBarButton = (props: BottomTabBarButtonProps) => {
  const { children, onPress, style, ...restProps } = props;
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      {...(restProps as any)}
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(scale, {
          toValue: 1.2,
          speed: 200,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, {
          toValue: 1,
          speed: 200,
          useNativeDriver: true,
        }).start();
      }}
      style={[
        { flex: 1, justifyContent: "center", alignItems: "center" },
        style,
      ]}
      android_ripple={{ borderless: false, BorderRadius: 0 }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => Boolean(s.accessToken && s.user));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {};

  const toLoginPage = () => {
    setIsLoginModalOpen(false);
    router.push("/login");
  };

  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
        }}
      >
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
              if (isLoggedIn) {
                router.navigate("/modal");
              } else {
                openLoginModal();
              }
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
          listeners={() => ({
            tabPress(e) {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          })}
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
          listeners={() => ({
            tabPress(e) {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          })}
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
        <Tabs.Screen
          name="(post)/[username]/post/[postID]"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <Modal
        visible={isLoginModalOpen}
        onRequestClose={closeLoginModal}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Pressable onPress={toLoginPage}>
              <Text>로그인모달</Text>
            </Pressable>
            <TouchableOpacity onPress={closeLoginModal}>
              <Ionicons name="close" size={24} color="black"></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
