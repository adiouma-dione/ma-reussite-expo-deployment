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
  Spinner,
  Text,
  useDisclose,
} from "native-base";
import React, { useEffect, useState } from "react";
import { BackgroundWrapper, CircularProgress } from "../../components";
import config from "../../api/config";
import { getObject, jsonrpcRequest } from "../../api/apiClient";
import { useAppContext } from "../../hooks/AppProvider";

const NoteScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState();
  const [course, setCourse] = useState();
  const [institute, setInstitute] = useState();
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
    const fetchNote = async () => {
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
            domain = [["partner_id", "=", selectedChild.partner_id[0]]];
            break;
          case "student":
            domain = [["partner_id", "=", connectedUser.partnerid[0]]];
            break;
          default:
            console.error("Unsupported role:", connectedUser.role);
            return;
        }

        const noteData = await jsonrpcRequest(
          connectedUser.sessionId,
          connectedUser.password,
          config.model.opStudent,
          [domain],
          ["prev_result", "prev_course_id", "prev_institute_id"]
        );

        if (noteData?.length > 0) {
          console.log("Note - ", noteData);
          setNote(noteData[0]?.prev_result);
          setCourse(noteData[0]?.prev_course_id);
          setInstitute(noteData[0]?.prev_institute_id);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    if (connectedUser && selectedChild) fetchNote();
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
          w={"80%"}
        >
          <Text
            textAlign={"center"}
            color={"black"}
            fontSize="lg"
            fontWeight="bold"
          >
            Notes
          </Text>
        </HStack>
        {loading ? (
          <Center h={"70%"} w={"90%"} mx={"auto"}>
            <Spinner size="xl" />
          </Center>
        ) : (
          <>
            <HStack p={4} alignItems={"baseline"}>
              <Text color={"black"} fontSize={14}>
                Institut:
              </Text>
              <Text color={"black"} fontSize={18} fontWeight={"bold"}>
                {institute}
              </Text>
            </HStack>
            <HStack p={4} alignItems={"baseline"}>
              <Text color={"black"} fontSize={14}>
                Filière:
              </Text>
              <Text color={"black"} fontSize={18} fontWeight={"bold"}>
                {course}
              </Text>
            </HStack>
            <Box justifyContent={"center"} alignItems={"center"}>
              {note ? (
                <>
                  <Text color={"black"} fontSize={18} fontWeight={"bold"} p={4}>
                    Moyenne Annuelle :
                  </Text>
                  <CircularProgress
                    progress={note}
                    width={20}
                    size={150}
                    note={true}
                  />
                </>
              ) : (
                <Box>
                  <Text
                    mt={"30%"}
                    color={"black"}
                    textAlign={"center"}
                    fontSize={"2xl"}
                    fontWeight={"bold"}
                  >
                    Pas de note
                  </Text>
                </Box>
              )}
            </Box>
          </>
        )}
        <Actionsheet
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
        >
          <Actionsheet.Content bg={"white"}>
            <Box w="100%" h={60} px={4} justifyContent="center">
              <Text
                textAlign={"center"}
                color={"black"}
                fontSize="lg"
                fontWeight="bold"
              >
                Changer de rôle
              </Text>
            </Box>
          </Actionsheet.Content>
        </Actionsheet>
      </BackgroundWrapper>
    </Box>
  );
};

export default NoteScreen;
