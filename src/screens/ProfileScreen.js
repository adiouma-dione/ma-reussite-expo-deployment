// import { MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import {
//   Avatar,
//   Box,
//   Button,
//   Center,
//   Checkbox,
//   Heading,
//   HStack,
//   Icon,
//   IconButton,
//   Link,
//   Pressable,
//   ScrollView,
//   Text,
//   VStack,
// } from "native-base";
// import React, { useEffect, useState } from "react";
// import { getObject, jsonrpcRequest, storeObject } from "../../api/apiClient";
// import config from "../../api/config";
// import MA_REUSSITE_CUSTOM_COLORS from "../../themes/variables";

// const ProfileScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const [connectedUser, setConnectedUser] = useState({
//     sessionId: "",
//     email: "",
//     password: "",
//     partnerid: "",
//     role: "",
//   });
//   const [childrenList, setChildrenList] = useState([]);
//   const [selectedChild, setSelectedChild] = useState({});
//   const [imageUri, setImageUri] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userInformation, setUserInformation] = useState();

//   useEffect(() => {
//     const getConnectedUser = async () => {
//       try {
//         const connectedUser = await getObject("connectedUser");
//         if (connectedUser) {
//           // console.log("connectedUser...", connectedUser);
//           setConnectedUser(connectedUser);
//           // const { sessionId, email, password, partnerid, role } = connectedUser;
//           // setSessionId(sessionId);
//           // setPassword(password);
//           // setPartnerid(partnerid[0]);
//           // setRole(role);
//           const childrenList = await getObject("children");
//           // console.log("childrenList...", childrenList);
//           setChildrenList(childrenList);
//           const selectedChild = await getObject("selectedChild");
//           // console.log("selectedChild...", selectedChild);
//           setSelectedChild(selectedChild);
//         }
//       } catch (error) {
//         console.error("Error while getting connectedUser:", error);
//       }
//     };
//     getConnectedUser();
//   }, []);

//   useEffect(() => {
//     const loadProfileImage = async () => {
//       try {
//         const cachedImage = await AsyncStorage.getItem("image_1024");
//         if (cachedImage) {
//           setImageUri(`data:image/png;base64,${cachedImage}`);
//         }
//         let userData = [];
//         switch (connectedUser.role) {
//           case "parent":
//             userData = await jsonrpcRequest(
//               connectedUser.sessionId,
//               connectedUser.password,
//               config.model.parents,
//               [[["contact_id", "=", connectedUser.partnerid[0]]]],
//               ["image_1024", "name", "email", "contact_id"]
//             );
//             break;

//           default:
//             userData = await jsonrpcRequest(
//               connectedUser.sessionId,
//               connectedUser.password,
//               config.model.opStudent,
//               [[["partner_id", "=", connectedUser.partnerid[0]]]],
//               ["image_1024", "name", "email"]
//             );
//             break;
//         }

//         if (userData && Array.isArray(userData) && userData.length > 0) {
//           const { image_1024, name, email } = userData[0];

//           setUserInformation({
//             name: name,
//             email: email,
//           });
//           if (image_1024) {
//             const base64Image = image_1024;
//             const newImageUri = `data:image/png;base64,${base64Image}`;

//             if (newImageUri !== imageUri) {
//               setImageUri(newImageUri);
//               await AsyncStorage.setItem("image_1024", base64Image);
//             }
//           }
//         } else {
//           await AsyncStorage.removeItem("image_1024");
//           console.log("No avatar found for the user.");
//         }
//       } catch (error) {
//         console.error("Error fetching profile image:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (connectedUser) {
//       loadProfileImage();
//     }
//   }, [connectedUser, imageUri]);

//   return (
//     <Box flex={1} bg="white">
//       <Center>
//         {loading ? (
//           <Avatar
//             size="2xl"
//             source={{ uri: "https://placehold.co/400x400.png" }}
//             onError={(e) => {
//               console.error("Error displaying image:", e.nativeEvent.error);
//             }}
//           />
//         ) : (
//           <Avatar
//             size="2xl"
//             source={{ uri: imageUri }}
//             onError={(e) => {
//               console.error("Error displaying image:", e.nativeEvent.error);
//             }}
//           >
//             <Avatar.Badge
//               bg="white"
//               borderWidth={0}
//               position="absolute"
//               bottom={0}
//               right={0}
//               size={10}
//             >
//               <IconButton
//                 icon={
//                   <Icon
//                     as={MaterialIcons}
//                     name="edit"
//                     size="lg"
//                     color="black"
//                     mx={"auto"}
//                   />
//                 }
//                 borderRadius="full"
//                 _icon={{
//                   color: "white",
//                   size: "xs",
//                 }}
//                 _pressed={{
//                   bg: "primary.600:alpha.20",
//                 }}
//               />
//             </Avatar.Badge>
//           </Avatar>
//         )}
//         <Heading color={"black"} mt={2}>
//           {userInformation && userInformation.name}
//         </Heading>
//       </Center>
//       <ScrollView
//         mt={2}
//         space={2}
//         flexGrow={1}
//         h={"100%"}
//         w={"100%"}
//         mb={"10%"}
//         contentContainerStyle={{ paddingBottom: 80 }}
//       >
//         <Box mt={4}>
//           <Heading mx={4} color={"black"} size="md">
//             Contact
//           </Heading>
//           <Box h={"100%"} justifyContent={"space-between"}>
//             <VStack mx={4}>
//               <Text mt={2} color={"black"} bold>
//                 Adresse email :
//               </Text>
//               <Link href={userInformation && userInformation.email}>
//                 <Text color={"primary.500"}>
//                   {userInformation && userInformation.email}
//                 </Text>
//               </Link>
//             </VStack>
//             <ScrollView mt={5}>
//               {childrenList &&
//                 childrenList?.map((child, index) => (
//                   <Pressable
//                     py={2}
//                     my={1}
//                     key={index}
//                     bgColor={"gray.200"}
//                     onPress={async () => {
//                       try {
//                         await storeObject("selectedChild", child);
//                         navigation.navigate("Home", {
//                           selectedChild: child,
//                         });
//                       } catch (error) {}
//                     }}
//                   >
//                     <HStack px={4} justifyContent={"space-between"}>
//                       <HStack>
//                         <Avatar
//                           size="sm"
//                           mr={2}
//                           bgColor={MA_REUSSITE_CUSTOM_COLORS.Secondary}
//                         >
//                           <IconButton
//                             icon={
//                               <Icon
//                                 as={MaterialIcons}
//                                 name="person"
//                                 size="lg"
//                                 color="white"
//                                 mx={"auto"}
//                               />
//                             }
//                             borderRadius="full"
//                             _icon={{
//                               color: "white",
//                               size: "xs",
//                             }}
//                             _pressed={{
//                               bg: "primary.600:alpha.20",
//                             }}
//                           />
//                         </Avatar>
//                         <Text
//                           color={"black"}
//                           fontWeight={"bold"}
//                           fontSize={"lg"}
//                         >
//                           {child.partner_id[1]}
//                         </Text>
//                       </HStack>
//                       {child.id === selectedChild.id ? (
//                         <Checkbox
//                           value="danger"
//                           colorScheme="white"
//                           aria-label="label"
//                           size={"md"}
//                           accessibilityLabel="This is a dummy checkbox"
//                           isChecked
//                         />
//                       ) : (
//                         ""
//                       )}
//                     </HStack>
//                   </Pressable>
//                 ))}
//             </ScrollView>
//           </Box>
//         </Box>
//       </ScrollView>
//       <Box bottom={"5%"}>
//         <Button
//           mx={"auto"}
//           bgColor={"danger.600"}
//           w={"80%"}
//           onPress={() => {
//             AsyncStorage.clear();
//             navigation.navigate("Login");
//           }}
//         >
//           Déconnexion
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ProfileScreen;

/* -------------------------------------------------------------------------- */
/*                                  VERSION 2                                 */
/* -------------------------------------------------------------------------- */

// ProfileScreen.js

import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { getObject, jsonrpcRequest, storeObject } from "../api/apiClient";
import config from "../api/config";
import MA_REUSSITE_CUSTOM_COLORS from "../themes/variables";

const ProfileScreen = () => {
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
  const [selectedChild, setSelectedChild] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInformation, setUserInformation] = useState();

  useEffect(() => {
    const getConnectedUser = async () => {
      try {
        const connectedUser = await getObject("connectedUser");
        if (connectedUser) {
          setConnectedUser(connectedUser);
          const childrenList = await getObject("children");
          setChildrenList(childrenList);
          const selectedChild = await getObject("selectedChild");
          setSelectedChild(selectedChild);
        }
      } catch (error) {
        console.error("Error while getting connectedUser:", error);
      }
    };
    getConnectedUser();
  }, []);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const cachedImage = await AsyncStorage.getItem("image_1024");
        if (cachedImage) {
          setImageUri(`data:image/png;base64,${cachedImage}`);
        }
        let userData = [];
        switch (connectedUser.role) {
          case "parent":
            userData = await jsonrpcRequest(
              connectedUser.sessionId,
              connectedUser.password,
              config.model.parents,
              [[["contact_id", "=", connectedUser.partnerid[0]]]],
              ["image_1024", "name", "email", "contact_id"]
            );
            break;

          default:
            userData = await jsonrpcRequest(
              connectedUser.sessionId,
              connectedUser.password,
              config.model.opStudent,
              [[["partner_id", "=", connectedUser.partnerid[0]]]],
              ["image_1024", "name", "email"]
            );
            break;
        }

        if (userData && Array.isArray(userData) && userData.length > 0) {
          const { image_1024, name, email } = userData[0];

          setUserInformation({
            name: name,
            email: email,
          });
          if (image_1024) {
            const base64Image = image_1024;
            const newImageUri = `data:image/png;base64,${base64Image}`;

            if (newImageUri !== imageUri) {
              setImageUri(newImageUri);
              await AsyncStorage.setItem("image_1024", base64Image);
            }
          }
        } else {
          await AsyncStorage.removeItem("image_1024");
          console.log("No avatar found for the user.");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      } finally {
        setLoading(false);
      }
    };

    if (connectedUser) {
      loadProfileImage();
    }
  }, [connectedUser, imageUri]);

  return (
    <Box flex={1} bg="white">
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
            source={{ uri: imageUri }}
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
        h={"100%"}
        w={"100%"}
        mb={"10%"}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Box mt={4}>
          <Heading mx={4} color={"black"} size="md">
            Contact
          </Heading>
          <Box h={"100%"} justifyContent={"space-between"}>
            <VStack mx={4}>
              <Text mt={2} color={"black"} bold>
                Adresse email :
              </Text>
              <Link href={userInformation && userInformation.email}>
                <Text color={"primary.500"}>
                  {userInformation && userInformation.email}
                </Text>
              </Link>
            </VStack>
            <ScrollView mt={5}>
              {childrenList &&
                childrenList?.map((child, index) => (
                  <Pressable
                    py={2}
                    my={1}
                    key={index}
                    bgColor={"gray.200"}
                    onPress={async () => {
                      try {
                        await storeObject("selectedChild", child);
                        setSelectedChild(child); // update the state
                        navigation.navigate("Home", {
                          selectedChild: child, // pass the updated child
                        });
                      } catch (error) {
                        console.error("Error while selecting child:", error);
                      }
                    }}
                  >
                    <HStack px={4} justifyContent={"space-between"}>
                      <HStack>
                        <Avatar
                          size="sm"
                          mr={2}
                          bgColor={MA_REUSSITE_CUSTOM_COLORS.Secondary}
                        >
                          <IconButton
                            icon={
                              <Icon
                                as={MaterialIcons}
                                name="person"
                                size="lg"
                                color="white"
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
                        </Avatar>
                        <Text
                          color={"black"}
                          fontWeight={"bold"}
                          fontSize={"lg"}
                        >
                          {child.partner_id[1]}
                        </Text>
                      </HStack>
                      {child.id === selectedChild.id ? (
                        <Checkbox
                          value="danger"
                          colorScheme="white"
                          aria-label="label"
                          size={"md"}
                          accessibilityLabel="This is a dummy checkbox"
                          isChecked
                        />
                      ) : (
                        ""
                      )}
                    </HStack>
                  </Pressable>
                ))}
            </ScrollView>
          </Box>
        </Box>
      </ScrollView>
      <Box bottom={"5%"}>
        <Button
          mx={"auto"}
          bgColor={"danger.600"}
          w={"80%"}
          onPress={() => {
            AsyncStorage.clear();
            navigation.navigate("Login");
          }}
        >
          Déconnexion
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileScreen;
