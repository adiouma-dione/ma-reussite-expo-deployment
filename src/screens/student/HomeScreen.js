import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Actionsheet,
  Box,
  ScrollView,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import { default as React, useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { jsonrpcRequest } from "../../api/apiClient";
import config from "../../api/config";
import { CalendarCard } from "../../components";
import BackgroundWrapper from "../../components/BackgroundWrapper";
import MA_REUSSITE_CUSTOM_COLORS from "../../themes/variables";
import CalendarLocalConfig from "../../utils/CalendarLocalConfig";
import { formatOdooEvents } from "../../utils/MarkedDatesFormatage";

CalendarLocalConfig;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { isOpen, onOpen, onClose } = useDisclose();
  const route = useRoute();
  const [sessionId, setSessionId] = useState(null);
  const [password, setPassword] = useState(null);
  const [partnerid, setPartnerid] = useState(null);
  const [events, setEvents] = useState(null);
  const [markedDate, setMarkedDate] = useState({});
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [today, setToday] = useState();
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  useEffect(() => {
    const connectedUser = route?.params;
    const { sessionId, email, password, partnerid } = connectedUser;
    setSessionId(sessionId);
    setPassword(password);
    setPartnerid(partnerid[0]);
  }, [route]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await jsonrpcRequest(
          sessionId,
          password,
          config.model.craftSession,
          [[["partner_ids", "=", partnerid]]],
          [
            "classroom_id",
            "recurrency",
            "rrule",
            "start",
            "stop",
            "subject_id",
            "teacher_id",
            "description",
          ]
        );
        // console.log("eventsData[0]...", eventsData[0]);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    if (sessionId && password) {
      fetchEvents();
    }
  }, [sessionId, password, partnerid]);

  useEffect(() => {
    if (events) {
      const formatedOdooEvents = formatOdooEvents(events);
      setMarkedDate(formatedOdooEvents);
    }
  }, [events]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const dayOfWeek = CalendarLocalConfig.dayNamesShort[today.getDay()];

    const currentDay = `${year}-${month}-${day}`;
    setToday(`${dayOfWeek} ${day}`);
    setTodaysEvents(markedDate[currentDay]?.dots);
  }, [markedDate]);

  return (
    <Box flex={1} bg={"white"}>
      <BackgroundWrapper navigation={navigation}>
        <Box
          mt={4}
          mb={6}
          mx={"auto"}
          width={"90%"}
          borderRadius={10}
          shadow={"9"}
          overflow={"hidden"}
        >
          <Calendar
            markingType={"multi-dot"}
            onDayPress={(day) => {
              const currentDaySelected = new Date(day.timestamp).getDay();
              setSelectedDay(
                `${CalendarLocalConfig.dayNamesShort[currentDaySelected]} ${day.day}`
              );
              if (markedDate[day.dateString] !== undefined) {
                setSelectedDayEvents(markedDate[day.dateString].dots);
              }
              onOpen();
            }}
            monthFormat={"MMMM yyyy"}
            hideArrows={false}
            disableMonthChange={false}
            firstDay={1}
            markedDates={markedDate}
            theme={{
              selectedDayBackgroundColor: MA_REUSSITE_CUSTOM_COLORS.Primary,
              todayTextColor: "white",
              todayBackgroundColor: MA_REUSSITE_CUSTOM_COLORS.Primary,
              arrowColor: MA_REUSSITE_CUSTOM_COLORS.Primary,
              monthTextColor: MA_REUSSITE_CUSTOM_COLORS.Primary,
            }}
          />
        </Box>
        <ScrollView flexGrow={1} h={"100%"} w={"90%"} mx={"auto"} mb={"10%"}>
          <VStack w={"full"} mb={"20%"} space={4} mt={4}>
            {todaysEvents &&
              todaysEvents.map((eventMarked, index) => (
                <CalendarCard
                  key={index}
                  tag={eventMarked.tag}
                  date={today}
                  time={eventMarked.time}
                  subject={eventMarked.subject}
                  teacher={eventMarked.teacher}
                  classroom={eventMarked.classroom}
                />
              ))}
          </VStack>
        </ScrollView>

        <Actionsheet
          isOpen={isOpen}
          onClose={() => {
            setSelectedDayEvents([]);
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
                Événements
              </Text>
            </Box>
            <ScrollView
              w="100%"
              flexGrow={1}
              mx={"auto"}
              // mb={"5%"}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <VStack space={4} px={4}>
                {selectedDayEvents &&
                  selectedDayEvents.map((eventMarked, index) => (
                    <CalendarCard
                      key={index}
                      tag={eventMarked.tag}
                      date={today}
                      time={eventMarked.time}
                      subject={eventMarked.subject}
                      teacher={eventMarked.teacher}
                      classroom={eventMarked.classroom}
                    />
                  ))}
              </VStack>
            </ScrollView>
          </Actionsheet.Content>
        </Actionsheet>
      </BackgroundWrapper>
    </Box>
  );
};

export default HomeScreen;
