import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Actionsheet,
  Box,
  Center,
  HStack,
  Icon,
  IconButton,
  Menu,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  useDisclose,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { getObject, jsonrpcRequest } from "../../api/apiClient";
import config from "../../api/config";
import { BackgroundWrapper, CircularProgress } from "../../components";
import { useAppContext } from "../../hooks/AppProvider";

const GroupScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectedUser, setConnectedUser] = useState({
    sessionId: "",
    email: "",
    password: "",
    partnerid: "",
    role: "",
  });
  const [childrenList, setChildrenList] = useState([]);
  // const [selectedChild, setSelectedChild] = useState({});
  const { selectedChild, setSelectedChild } = useAppContext();

  useEffect(() => {
    const getConnectedUser = async () => {
      if (!connectedUser) return;
      try {
        const connectedUser = await getObject("connectedUser");
        setConnectedUser(connectedUser);
        if (connectedUser) {
          if (!selectedChild) return;

          const selectedChild = await getObject("selectedChild");
          setSelectedChild(selectedChild);
        }
      } catch (error) {
        console.error("Error while getting connectedUser:", error);
      }
    };
    getConnectedUser();
  }, [route, setSelectedChild]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (
          !connectedUser ||
          !connectedUser.sessionId ||
          !connectedUser.password ||
          !connectedUser.partnerid
        ) {
          return;
        }

        let domain = [];
        switch (connectedUser.role) {
          case "parent":
            if (!selectedChild?.partner_id) return;
            domain = [["partner_ids", "=", selectedChild.partner_id[0]]];
            break;
          case "student":
            domain = [["partner_ids", "=", connectedUser.partnerid[0]]];
            break;
          default:
            console.error("Unsupported role:", connectedUser.role);
            return;
        }

        const groupsData = await jsonrpcRequest(
          connectedUser.sessionId,
          connectedUser.password,
          config.model.groups
          // domain
        );
        setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (connectedUser && selectedChild) fetchGroups();
  }, [connectedUser, selectedChild]);

  return (
    <Box flex={1} bg="white">
      <BackgroundWrapper navigation={navigation}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt={4}
          mb={4}
          mx={"auto"}
          w={"80%"}
        >
          <Text
            textAlign={"center"}
            color={"black"}
            fontSize="lg"
            fontWeight="bold"
          >
            Master 1 DevOps
          </Text>
          {/* <Menu
            trigger={(triggerProps) => {
              return (
                <Pressable {...triggerProps}>
                  <IconButton
                    icon={<Icon as={MaterialIcons} name="swap-horiz" />}
                    borderRadius="lg"
                    bg={"white"}
                    _icon={{
                      color: "black",
                      size: "lg",
                    }}
                    _pressed={{
                      bg: "coolGray.800:alpha.20",
                      _icon: {
                        name: "swap-horiz",
                      },
                      _ios: {
                        _icon: {
                          size: "2xl",
                        },
                      },
                    }}
                  />
                </Pressable>
              );
            }}
          >
             Add menu items for role switching here 
          </Menu>*/}
        </HStack>
        {loading ? (
          <Center h={"70%"} w={"90%"} mx={"auto"}>
            <Spinner size="xl" />
          </Center>
        ) : (
          <ScrollView
            h={"80%"}
            p={2}
            flexGrow={1}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            <VStack w={"100%"} mb={"20%"}>
              {groups?.length > 0 ? (
                groups.map((group, index) => (
                  <Pressable
                    shadow={"9"}
                    key={index}
                    onPress={() => {
                      navigation.navigate("Sessions", {
                        groupName: group.name,
                      });
                    }}
                  >
                    <Box
                      bg="white"
                      p={4}
                      mx={2}
                      my={2}
                      rounded="lg"
                      shadow={2}
                      justifyContent="center"
                      height="100"
                    >
                      <HStack alignItems="center">
                        <CircularProgress progress={group.progress} />
                        <Box flex={1} mr={5} alignItems="center">
                          <Text color={"black"} fontWeight="bold" fontSize="lg">
                            {group.name}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </Pressable>
                ))
              ) : (
                <Box>
                  <Text
                    mt={"30%"}
                    color={"black"}
                    textAlign={"center"}
                    fontSize={"2xl"}
                    fontWeight={"bold"}
                  >
                    Pas de groupe
                  </Text>
                </Box>
              )}
            </VStack>
          </ScrollView>
        )}
      </BackgroundWrapper>
    </Box>
  );
};

export default GroupScreen;
