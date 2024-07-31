import * as FileSystem from "expo-file-system";
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
  VStack,
  useDisclose,
} from "native-base";
import React, { useEffect, useState } from "react";
import { BackgroundWrapper } from "../../components";
import config from "../../api/config";
import { getObject, jsonrpcRequest } from "../../api/apiClient";
import { useAppContext } from "../../hooks/AppProvider";

const ActivityScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState();
  const [connectedUser, setConnectedUser] = useState({
    sessionId: "",
    email: "",
    password: "",
    partnerid: "",
    role: "",
  });
  
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
    const fetchActivities = async () => {
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
            domain = [["student_id", "=", selectedChild.partner_id[1]]];
            break;
          case "student":
            domain = [["student_id", "=", connectedUser.partnerid[1]]];
            break;
          default:
            console.error("Unsupported role:", connectedUser.role);
            return;
        }

        const activitiesData = await jsonrpcRequest(
          connectedUser?.sessionId,
          connectedUser?.password,
          config.model.opActivity,
          [domain],
          ["student_id", "type_id", "date", "description"]
        );

        if (activitiesData?.length > 0) {
          setActivities(activitiesData);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    if (connectedUser && selectedChild) fetchActivities();
  }, [connectedUser, selectedChild]);

  return (
    <Box flex={1} bg={"white"}>
      <BackgroundWrapper navigation={navigation}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt={4}
          mb={4}
          mx={"auto"}
          // w={"80%"}
        >
          <Text
            textAlign={"center"}
            color={"black"}
            fontSize="lg"
            fontWeight="bold"
          >
            Activités
          </Text>
        </HStack>
        {loading ? (
          <Center h={"70%"} w={"90%"} mx={"auto"}>
            <Spinner size="xl" />
          </Center>
        ) : (
          <ScrollView
            p={4}
            h={"100%"}
            flexGrow={1}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <Box
                  key={index}
                  bg={"white"}
                  p={4}
                  my={0.5}
                  borderRadius={"md"}
                >
                  <HStack justifyContent={"space-between"}>
                    <Text color={"black"} fontWeight={"bold"}>
                      {activity.type_id[1]}
                    </Text>
                    <Text color={"black"} fontWeight={"bold"}>
                      {activity.date}
                    </Text>
                  </HStack>
                  {activity.description && (
                    <VStack>
                      <Text color={"black"} maxH={5}>
                        {activity.description}
                      </Text>
                      <Text
                        underline={true}
                        fontWeight="500"
                        color="blue.500"
                        onPress={() => {
                          setSelectedActivity(activity);
                          onOpen();
                        }}
                      >
                        Voir plus...
                      </Text>
                    </VStack>
                  )}
                </Box>
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
                  Pas d'evenement
                </Text>
              </Box>
            )}
          </ScrollView>
        )}

        <Actionsheet
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
        >
          <Actionsheet.Content bg={"white"}>
            <Box w="100%" h={60} pt={4} justifyContent="center">
              <Text
                textAlign={"center"}
                color={"black"}
                fontSize="lg"
                fontWeight="bold"
              >
                {selectedActivity && selectedActivity.type_id[1]}
              </Text>
            </Box>
            <VStack p={2} w={"100%"} m={2}>
              <Text my={4} color={"black"}>
                <Text fontWeight={"bold"}>Date : </Text>
                {selectedActivity && selectedActivity.date}
              </Text>
              <Text color={"black"} lineHeight={24}>
                <Text fontWeight={"bold"}>Description : </Text>
                {selectedActivity && selectedActivity.description}
              </Text>
            </VStack>
          </Actionsheet.Content>
        </Actionsheet>
      </BackgroundWrapper>
    </Box>
  );
};

export default ActivityScreen;
