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
import { jsonrpcRequest } from "../../api/apiClient";
import config from "../../api/config";
import {
  BackgroundWrapper,
  PaymentCard,
  PaymentCardPlus,
} from "../../components";

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [sortOrder, setSortOrder] = useState("recent");
  const [sessionId, setSessionId] = useState(null);
  const [password, setPassword] = useState(null);
  const [partnerid, setPartnerid] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    const connectedUser = route?.params;
    const { sessionId, email, password, partnerid } = connectedUser;
    setSessionId(sessionId);
    setPassword(password);
    setPartnerid(partnerid[0]);
  }, [route]);

  const handlePress = (paymentDetails) => {
    setPaymentDetails(paymentDetails);
    onOpen();
  };

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const paymentState = await jsonrpcRequest(
          sessionId,
          password,
          config.model.accountMove,
          [[["partner_id", "=", partnerid]]],
          ["name", "payment_state"]
        );

        const paymentDetails = await jsonrpcRequest(
          sessionId,
          password,
          config.model.accountMoveLine,
          [[["partner_id", "=", partnerid]]],
          [
            "date",
            "display_name",
            "move_name",
            "name",
            "partner_id",
            "price_total",
            "product_id",
          ]
        );

        const paymentTab = [];
        paymentDetails.map((payment) => {
          if (payment.product_id) {
            paymentState.forEach((state) => {
              if (state.name === payment.move_name) {
                const data = { ...payment, ...state };
                paymentTab.push(data);
              }
            });
          }
        });
        setPayments(paymentTab);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && password && partnerid) {
      fetchPayment();
    }
  }, [sessionId, password, partnerid]);

  useEffect(() => {
    // payments && console.log("Partner...", new Date().getMinutes(), payments);
  }, [payments]);

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
            Historique de paiements
          </Text>
          <Menu
            trigger={(triggerProps) => {
              return (
                <Pressable {...triggerProps}>
                  <IconButton
                    icon={<Icon as={MaterialIcons} name="filter-alt" />}
                    borderRadius="lg"
                    bg={"white"}
                    _icon={{
                      color: "black",
                      size: "lg",
                    }}
                    _pressed={{
                      bg: "coolGray.800:alpha.20",
                      _icon: {
                        name: "filter-alt",
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
            {/* <Menu.Item color={"black"} onPress={() => setSortOrder("recent")}>
                Plus récents
              </Menu.Item>
              <Menu.Item color={"black"} onPress={() => setSortOrder("oldest")}>
                Plus anciens
              </Menu.Item> */}
          </Menu>
        </HStack>
        {loading ? (
          <Center h={"70%"} w={"90%"} mx={"auto"}>
            <Spinner size="xl" />
          </Center>
        ) : (
          <ScrollView
            flexGrow={1}
            h={"80%"}
            w={"90%"}
            mx={"auto"}
            mb={"10%"}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            <VStack w={"full"} mb={"10%"} space={4} minH={"80%"}>
              {console.log("payments.length...", payments.length)}
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <PaymentCard
                    key={index}
                    date={payment.date}
                    name={payment.name}
                    product_id={payment.product_id}
                    display_name={payment.display_name}
                    amount={payment.price_total}
                    state={payment.payment_state}
                    partner_id={payment.partner_id}
                    handlePress={handlePress}
                    onOpen={onOpen}
                  />
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
                    Pas de paiement
                  </Text>
                </Box>
              )}
            </VStack>
          </ScrollView>
        )}

        <Actionsheet
          isOpen={isOpen}
          onClose={() => {
            // setSelectedDayEvents([]);
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
                Facture
              </Text>
            </Box>
            {paymentDetails.name !== undefined && (
              <PaymentCardPlus paymentDetails={paymentDetails} />
            )}
          </Actionsheet.Content>
        </Actionsheet>
      </BackgroundWrapper>
    </Box>
  );
};

export default PaymentScreen;
