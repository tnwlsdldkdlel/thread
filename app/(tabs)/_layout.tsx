import { Tabs, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Entypo from "../../node_modules/@expo/vector-icons/Entypo";
import Feather from "../../node_modules/@expo/vector-icons/Feather";
import FontAwesome6 from "../../node_modules/@expo/vector-icons/FontAwesome6";
import Ionicons from "../../node_modules/@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const router = useRouter();
  const isLoggedIn = true;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Tabs backBehavior="history" screenOptions={{ headerShown: false }}>
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
            <Text>로그인모달</Text>
            <TouchableOpacity onPress={closeLoginModal}>
              <Ionicons name="close" size={24} color="black"></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
