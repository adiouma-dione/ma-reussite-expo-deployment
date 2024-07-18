/* -------------------------------------------------------------------------- */
/*                                  VERSION 1                                 */
/* -------------------------------------------------------------------------- */

import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  Icon,
  IconButton,
  Link,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { jsonrpcRequest } from "../api/apiClient";
import config from "../api/config";
import QRCode from "react-native-qrcode-svg";

const ProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [sessionId, setSessionId] = useState(null);
  const [password, setPassword] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [avatarUri, setAvatarUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInformation, setUserInformation] = useState();

  useEffect(() => {
    const { sessionId, email, password, studentId } = route?.params;
    setSessionId(sessionId);
    setPassword(password);
    setStudentId(studentId);
  }, [route]);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const cachedAvatar = await AsyncStorage.getItem("avatar_1024");
        if (cachedAvatar) {
          setAvatarUri(`data:image/png;base64,${cachedAvatar}`);
        }

        const userData = await jsonrpcRequest(
          sessionId,
          config.password,
          config.model.opStudent,
          [[["partner_id", "=", studentId]]],
          [
            "avatar_1024",
            "name",
            "email",
            "microsoft_email",
            "microsoft_uid",
            "qrcode",
          ]
        );

        if (userData.length > 0 && userData[0].avatar_1024) {
          const {
            avatar_1024,
            name,
            email,
            microsoft_email,
            microsoft_uid,
            qrcode,
          } = userData[0];
          setUserInformation({
            name: name,
            email: email,
            microsoft_email: microsoft_email,
            microsoft_uid: microsoft_uid,
            qrcode: qrcode,
          });
          const base64Image = avatar_1024;
          const newAvatarUri = `data:image/png;base64,${base64Image}`;

          if (newAvatarUri !== avatarUri) {
            setAvatarUri(newAvatarUri);
            await AsyncStorage.setItem("avatar_1024", base64Image);
          }
        } else {
          console.log("No avatar found for the user.");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && password && studentId) {
      loadProfileImage();
    }
  }, [sessionId, password, studentId, avatarUri]);

  return (
    <Box flex={1} p={4} bg="white">
      <Center>
        {loading ? (
          <Avatar
            size="2xl"
            source={{ uri: "https://placehold.co/400x400.png" }}
            onError={(e) => {
              console.error("Error displaying image:", e.nativeEvent.error);
            }}
          />
        ) : (
          <Avatar
            size="2xl"
            source={{ uri: avatarUri }}
            onError={(e) => {
              console.error("Error displaying image:", e.nativeEvent.error);
            }}
          >
            <Avatar.Badge
              bg="white"
              borderWidth={0}
              position="absolute"
              bottom={0}
              right={0}
              size={10}
            >
              <IconButton
                icon={
                  <Icon
                    as={MaterialIcons}
                    name="edit"
                    size="lg"
                    color="black"
                    mx={"auto"}
                  />
                }
                borderRadius="full"
                _icon={{
                  color: "white",
                  size: "xs",
                }}
                _pressed={{
                  bg: "primary.600:alpha.20",
                }}
              />
            </Avatar.Badge>
          </Avatar>
        )}
        <Heading color={"black"} mt={2}>
          {userInformation && userInformation.name}
        </Heading>
      </Center>
      <ScrollView
        mt={2}
        space={2}
        flexGrow={1}
        h={"80%"}
        w={"100%"}
        pb={"10%"}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Box mt={4}>
          <Heading color={"black"} size="md">
            Contact
          </Heading>
          <VStack>
            <Text mt={2} color={"black"} bold>
              Adresse email Ma Réussite
            </Text>
            <Link href={userInformation && userInformation.email}>
              <Text color={"primary.500"}>
                {userInformation && userInformation.email}
              </Text>
            </Link>
          </VStack>
          <VStack>
            <Text mt={2} color={"black"} bold>
              Adresse email Microsoft
            </Text>
            <Link href={userInformation && userInformation.microsoft_email}>
              <Text color={"primary.500"}>
                {userInformation && userInformation.microsoft_email}
              </Text>
            </Link>
          </VStack>
          <VStack>
            <Text mt={2} color={"black"} bold>
              Microsoft UID
            </Text>
            <Text color={"black"}>
              {userInformation && userInformation.microsoft_uid}
            </Text>
          </VStack>
          <Box mx={"auto"} my={10}>
            <QRCode
              size={150}
              value={userInformation && userInformation.qrcode}
            ></QRCode>
          </Box>
          <Box>
            <Button
              mx={"auto"}
              bgColor={"danger.600"}
              w={"80%"}
              onPress={() => navigation.navigate("Login")}
            >
              Déconnexion
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default ProfileScreen;
