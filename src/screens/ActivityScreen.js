import * as FileSystem from "expo-file-system";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Box,
  Text,
  Image,
  ScrollView,
  Pressable,
  HStack,
  VStack,
  useDisclose,
  Actionsheet,
} from "native-base";
import React, { useEffect, useState } from "react";
import { BackgroundWrapper } from "../components";
import config from "../api/config";
import { jsonrpcRequest } from "../api/apiClient";

const ActivityScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [sessionId, setSessionId] = useState(null);
  const [password, setPassword] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [activities, setActivities] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedActivity, setSelectedActivity] = useState();

  useEffect(() => {
    const { sessionId, email, password, studentId } = route?.params;
    setSessionId(sessionId);
    setPassword(password);
    setStudentId(studentId[1]);
  }, [route]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesData = await jsonrpcRequest(
          sessionId,
          config.password,
          config.model.opActivity,
          [[["student_id", "=", studentId]]],
          ["student_id", "type_id", "date", "description"]
        );

        if (activitiesData.length > 0) {
          setActivities(activitiesData);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    if (sessionId && password && studentId) {
      fetchActivities();
    }
  }, [sessionId, password, studentId]);

  return (
    <Box flex={1} bg={"white"}>
      <BackgroundWrapper navigation={navigation}>
        <Box>
          <ScrollView
            p={4}
            //   h={"100%"}
            h={"100%"}
            //   p={2}
            flexGrow={1}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {activities &&
              activities.map((activity, index) => (
                <Box
                  key={index}
                  bg={"white"}
                  p={4}
                  my={0.5}
                  borderRadius={"md"}
                  // onPress={() => navigation.navigate("Sessions")}
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
              ))}
          </ScrollView>
        </Box>

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
