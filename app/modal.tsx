import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Thread {
  id: string;
  text: string;
  hashtag?: string;
  location?: [number, number];
  imageUris: string[];
}

export function ListFooter({
  canAddThread,
  addThread,
}: {
  canAddThread: boolean;
  addThread: () => void;
}) {
  return (
    <View style={styles.listFooter}>
      <View style={styles.listFooterAvatar}>
        <Image
          source={require("../assets/images/avatar.png")}
          style={styles.avatarSmall}
        />
      </View>
      <View>
        <Pressable onPress={addThread} style={styles.input}>
          <Text style={{ color: canAddThread ? "#999" : "#aaa" }}>
            Add to thread
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function NewThreadModal() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([
    { id: Date.now().toString(), text: "", imageUris: [] },
  ]);
  const insets = useSafeAreaInsets();
  const [replyOption, setReplyOption] = useState("Anyone");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [editingHashtagId, setEditingHashtagId] = useState<string | null>(null);

  const replyOptions = ["Anyone", "Profiles you follow", "Mentioned only"];

  const handleCancel = () => {};

  const handlePost = () => {};

  const updateThreadText = (id: string, text: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id ? { ...thread, text } : thread
      )
    );
  };

  const updateThreadHashtag = (id: string, hashtag: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id ? { ...thread, hashtag } : thread
      )
    );
  };

  const canAddThread =
    (threads.at(-1)?.text.trim().length ?? 0) > 0 ||
    (threads.at(-1)?.imageUris.length ?? 0) > 0;
  const canPost = threads.every(
    (thread) => thread.text.trim().length > 0 || thread.imageUris.length > 0
  );

  const addImageToThread = (id: string, uri: string) => {};

  const addLocationToThread = (id: string, location: [number, number]) => {};

  const removeThread = (id: string) => {
    setThreads((prevThreads) =>
      prevThreads.filter((thread) => thread.id !== id)
    );
  };

  const pickImage = async (id: string) => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("사진을 선택하려면 미디어 라이브러리 접근 권한이 필요합니다.");
      Linking.openSettings();
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos", "livePhotos"],
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled && result.assets.length > 0) {
      result.assets.forEach((asset) => {
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.id === id
              ? { ...thread, imageUris: [...thread.imageUris, asset.uri] }
              : thread
          )
        );
      });
    }
  };

  const takePhoto = async (id: string) => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== "granted") {
      alert("사진을 찍으려면 카메라 접근 권한이 필요합니다.");
      Linking.openSettings();
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos", "livePhotos"],
    });

    if (result.canceled) {
      return;
    }

    const { status: mediaLibraryStatus } =
      await MediaLibrary.requestPermissionsAsync();
    if (mediaLibraryStatus === "granted" && result.assets?.[0].uri) {
      await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
    }

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === id
            ? { ...thread, imageUris: [...thread.imageUris, uri] }
            : thread
        )
      );
    }
  };

  const removeImageFromThread = (id: string, uriToRemove: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              imageUris: thread.imageUris.filter((uri) => uri !== uriToRemove),
            }
          : thread
      )
    );
  };

  const getMyLocation = async (id: string) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("위치 정보를 추가하려면 위치 접근 권한이 필요합니다.");
      Linking.openSettings();
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              location: [location.coords.latitude, location.coords.longitude],
            }
          : thread
      )
    );
  };

  const renderThreadItem = ({
    item,
    index,
  }: {
    item: Thread;
    index: number;
  }) => (
    <View style={styles.threadContainer}>
      <View style={styles.avatarContainer}>
        <Image
          source={require("../assets/images/avatar.png")}
          style={styles.avatar}
        />
        <View style={styles.threadLine} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              marginRight: 8,
            }}
          >
            <Text style={styles.username}>zerohch0</Text>
            <Text style={{ color: "#999", marginLeft: 5, marginRight: 8 }}>
              {">"}
            </Text>
            {editingHashtagId === item.id ? (
              <TextInput
                style={styles.topicInput}
                value={item.hashtag || ""}
                placeholder="주제 추가"
                placeholderTextColor="#999"
                onChangeText={(hashtag) =>
                  updateThreadHashtag(item.id, hashtag)
                }
                autoFocus
                onBlur={() => setEditingHashtagId(null)}
              />
            ) : (
              <TouchableOpacity
                onPress={() => !isPosting && setEditingHashtagId(item.id)}
              >
                {item.hashtag ? (
                  <Text style={styles.topicText}>#{item.hashtag}</Text>
                ) : (
                  <Text style={styles.addTopicPlaceholder}>주제 추가</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => removeThread(item.id)}
              style={styles.removeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-outline" size={20} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder={"What's new?"}
          placeholderTextColor="#999"
          value={item.text}
          onChangeText={(text) => updateThreadText(item.id, text)}
          multiline
        />
        {item.imageUris && item.imageUris.length > 0 && (
          <FlatList
            data={item.imageUris}
            renderItem={({ item: uri, index: imgIndex }) => (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  onPress={() =>
                    !isPosting && removeImageFromThread(item.id, uri)
                  }
                  style={styles.removeImageButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="rgba(0,0,0,0.7)"
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(uri, imgIndex) =>
              `${item.id}-img-${imgIndex}-${uri}`
            }
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageFlatList}
          />
        )}
        {item.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              {item.location[0]}, {item.location[1]}
            </Text>
          </View>
        )}
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.actionButton}
            onPress={() => !isPosting && pickImage(item.id)}
          >
            <Ionicons name="image-outline" size={24} color="#777" />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => !isPosting && takePhoto(item.id)}
          >
            <Ionicons name="camera-outline" size={24} color="#777" />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              getMyLocation(item.id);
            }}
          >
            <FontAwesome name="map-marker" size={24} color="#777" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={handleCancel} disabled={isPosting}>
          <Text style={[styles.cancel, isPosting && styles.disabledText]}>
            Cancel
          </Text>
        </Pressable>
        <Text style={styles.title}>New Thread</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>
      <FlatList
        data={threads}
        renderItem={renderThreadItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <ListFooter
            canAddThread={canAddThread}
            addThread={() => {
              if (canAddThread) {
                setThreads([
                  ...threads,
                  { id: Date.now().toString(), text: "", imageUris: [] },
                ]);
              }
            }}
          />
        }
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 100, backgroundColor: "#ddd" }}
        keyboardShouldPersistTaps="handled"
      />
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Pressable onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
          <Text style={styles.footerText}>{replyOption} can reply & quote</Text>
        </Pressable>
        <Pressable
          style={[
            styles.postButton,
            (!canPost || isPosting) && styles.postButtonDisabled,
          ]}
          disabled={!canPost || isPosting}
          onPress={handlePost}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </Pressable>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDropdownVisible}
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsDropdownVisible(false)}
          >
            <View
              style={[
                styles.dropdownContainer,
                { marginBottom: insets.bottom + 5 },
              ]}
            >
              {replyOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownOption,
                    replyOption === option && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setReplyOption(option);
                    setIsDropdownVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      replyOption === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerRightPlaceholder: {
    width: 60,
  },
  cancel: {
    color: "#000",
    fontSize: 16,
  },
  disabledText: {
    color: "#ccc",
  },
  title: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    flex: 1,
    backgroundColor: "#eee",
  },
  threadContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  avatarContainer: {
    alignItems: "center",
    marginRight: 12,
    paddingTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#555",
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#555",
  },
  threadLine: {
    width: 1.5,
    flexGrow: 1,
    backgroundColor: "#aaa",
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 6,
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
    color: "#000",
  },
  input: {
    fontSize: 15,
    color: "#000",
    paddingTop: 4,
    paddingBottom: 8,
    minHeight: 24,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 15,
  },
  imageFlatList: {
    marginTop: 12,
    marginBottom: 4,
  },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 8,
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    color: "#8e8e93",
    fontSize: 14,
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#000",
    borderRadius: 18,
  },
  postButtonDisabled: {
    backgroundColor: "#ccc",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: "hidden",
    marginBottom: 5,
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  selectedOption: {},
  dropdownOptionText: {
    fontSize: 16,
    color: "#000",
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#007AFF",
  },
  removeButton: {
    padding: 4,
    marginRight: -4,
    marginLeft: 8,
  },
  listFooter: {
    paddingLeft: 26,
    paddingTop: 10,
    flexDirection: "row",
  },
  listFooterAvatar: {
    marginRight: 20,
    paddingTop: 2,
  },
  locationContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#8e8e93",
  },
  topicContainer: {},
  topicText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "500",
  },
  addTopicContainer: {},
  addTopicPlaceholder: {
    fontSize: 15,
    color: "#999",
    lineHeight: 20,
  },
  topicInput: {
    fontSize: 15,
    color: "#999",
    fontWeight: "500",
    paddingVertical: 0,
    flex: 1,
  },
});
