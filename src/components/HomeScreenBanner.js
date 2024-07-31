import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Avatar,
  Box,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { getObject, jsonrpcRequest } from "../api/apiClient";
import config from "../api/config";
import MA_REUSSITE_CUSTOM_COLORS from "../themes/variables";
import { useAppContext } from "../hooks/AppProvider";

function HomeScreenBanner() {
  const route = useRoute();
  const navigation = useNavigation();
  const [connectedUser, setConnectedUser] = useState({
    sessionId: "",
    email: "",
    password: "",
    partnerid: "",
    role: "",
  });
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [account, setAccount] = useState();
  const { selectedChild, setSelectedChild } = useAppContext();
  // const [ selectedChild, setSelectedChild ] = useState();

  useEffect(() => {
    const getConnectedUser = async () => {
      try {
        const connectedUser = await getObject("connectedUser");
        setConnectedUser(connectedUser);

        if (connectedUser?.role === "parent") {
          const storedSelectedChild = await getObject("selectedChild");
          setSelectedChild(storedSelectedChild);
        }
      } catch (error) {
        console.error("Error while getting connectedUser:", error);
      }
    };
    getConnectedUser();
  }, [route, setSelectedChild]);

  useMemo(async () => {
    const cachedImage = await AsyncStorage.getItem("image_1024");
    if (cachedImage) {
      setImageUri(`data:image/png;base64,${cachedImage}`);
    }
    setLoading(false);
  }, [connectedUser]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const { sessionId, password, partnerid } = connectedUser;
      try {
        const userData = await jsonrpcRequest(
          sessionId,
          password,
          config.model.partner,
          [[["id", "=", partnerid[0]]]],
          ["image_1024"]
        );

        if (userData?.length > 0 && userData[0]?.image_1024) {
          const { image_1024 } = userData[0];
          const base64Image = image_1024;
          const newImageUri = `data:image/png;base64,${base64Image}`;

          if (newImageUri !== imageUri) {
            setImageUri(newImageUri);
            await AsyncStorage.setItem("image_1024", base64Image);
          }
        } else {
          await AsyncStorage.removeItem("image_1024");
          console.log("No avatar found for the user.");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    if (connectedUser.partnerid) {
      fetchProfileImage();
    }
  }, [connectedUser, imageUri]);

  const goToProfile = () => {
    navigation.navigate("Profile", {
      children: childrenList,
    });
  };

  useEffect(() => {
    if (connectedUser.role === "parent" && selectedChild?.partner_id) {
      setAccount(
        <Text color={"white"} fontWeight={"medium"}>
          {selectedChild.partner_id[1]}
        </Text>
      );
    }
  }, [connectedUser.role, selectedChild]);

  return (
    <Box bg="white">
      <VStack>
        <HStack>
          <Image
            size="sm"
            w={"70%"}
            ml={2}
            source={require("../../assets/images/ma_reussite_other_screens.png")}
            alt="Alternate Text"
          />
          <Pressable m={"auto"} onPress={goToProfile}>
            {loading ? (
              <Avatar
                size="md"
                source={{ uri: "https://placehold.co/400x400.png" }}
                onError={(e) => {
                  console.error("Error displaying image:", e.nativeEvent.error);
                }}
              />
            ) : (
              <Avatar
                size="md"
                source={{ uri: imageUri }}
                onError={(e) => {
                  console.error("Error displaying image:", e.nativeEvent.error);
                }}
              />
            )}
          </Pressable>
        </HStack>
        {connectedUser.role === "parent" && selectedChild?.partner_id && (
          <Box
            alignSelf={"baseline"}
            ml={8}
            px={2}
            py={0.5}
            mb={1}
            borderRadius={"sm"}
            bgColor={MA_REUSSITE_CUSTOM_COLORS.Secondary}
          >
            {account}
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default HomeScreenBanner;
