import {
  Box,
  HStack,
  Link,
  Pressable,
  Text,
  useDisclose,
  VStack,
} from "native-base";
import React from "react";

const PaymentCardPlus = ({ paymentDetails }) => {
  const statusPayment =
    paymentDetails.state !== "not_paid"
      ? { color: "success.600", text: "Payé" }
      : { color: "danger.600", text: "Non Payé" };

  return (
    <Box borderRadius={10} overflow={"hidden"}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        p={4}
      >
        <VStack w={"100%"}>
          <VStack w={"100%"}>
            <Text color={"black"} mb={2} fontSize="lg" fontWeight="bold">
              {paymentDetails.display_name}
            </Text>
            <Text color={"black"} mb={2} fontSize="lg">
              {`Référence : ${paymentDetails.name}`}
            </Text>
            <Text color={"black"} mb={2} fontSize="lg">
              {`Etudiant(e) : ${paymentDetails.partner_id[1]}`}
            </Text>
            <Text fontSize={"md"} mb={2} color="black">
              Somme : {paymentDetails.amount} €
            </Text>
            {paymentDetails.state === "not_paid" && (
              <Text color={"black"} mb={2} fontSize="lg">
                {`Date d'échéance : ${paymentDetails.date.split("-")[2]} ${paymentDetails.product_id[1]} ${paymentDetails.date.split("-")[0]}`}
              </Text>
            )}
            <Box
              bg={statusPayment.color}
              px={4}
              mr={"auto"}
              py={0.5}
              mb={2}
              rounded="xl"
            >
              <Text color={"white"}>{statusPayment.text}</Text>
            </Box>
          </VStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default PaymentCardPlus;
