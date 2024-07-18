import { MaterialIcons } from "@expo/vector-icons";
import { Box, HStack, Icon, Text, VStack } from "native-base";
import React from "react";

function CalendarCard({ date, tag, time, subject, teacher, classroom }) {
  let tagColor = "";
  if (tag === "cours") {
    tagColor = "tertiary.500";
  } else if (tag === "examen") {
    tagColor = "danger.500";
  }

  return (
    <Box
      borderRadius={10}
      borderWidth={0.5}
      borderColor={"gray.400"}
      overflow={"hidden"}
    >
      <HStack
        justifyContent="space-between"
        alignItems="center"
        bg="gray.100"
        p={4}
      >
        <VStack>
          <HStack>
            <Icon
              as={MaterialIcons}
              name="trip-origin"
              color={tagColor}
              size={4}
              alignSelf={"center"}
              mr={0.5}
            />
            <Text color="gray.500">
              {date}, {time}, {`(Salle ${classroom})`}
            </Text>
          </HStack>
          <HStack my={1}>
            <Text
              color={"black"}
              fontWeight="bold"
              fontSize={"lg"}
              textTransform={"capitalize"}
            >
              {tag} : {subject}
            </Text>
          </HStack>
          <Text color="gray.500">{`Prof : ${teacher}`}</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

export default CalendarCard;
