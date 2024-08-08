import { Box, HStack, Pressable, Text, VStack } from "native-base";
import React from "react";

const PaymentCard = ({
  amount,
  name,
  state,
  date,
  product_id,
  display_name,
  partner_id,
  currency_sybol,
  handlePress,
  tax_ids,
  price_subtotal,
  occupation = "student",
}) => {
  const statusPayment =
    state !== "not_paid"
      ? { color: "success.600", text: "Payé" }
      : { color: "danger.600", text: "Non Payé" };

  const paymentDetails = {
    amount: amount,
    name: name,
    state: state,
    date: date,
    product_id: product_id,
    display_name: display_name,
    partner_id: partner_id,
    currency_sybol: currency_sybol,
    tax_ids: tax_ids,
    price_subtotal: price_subtotal,
  };

  return (
    <Box borderRadius={10} overflow={"hidden"}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        p={4}
      >
        <VStack w={"100%"}>
          <HStack w={"100%"}>
            <Box w={"65%"}>
              <Text color={"black"} fontSize="lg" fontWeight="bold">
                {product_id[1]} {date.split("-")[0]}
              </Text>
              <Text fontSize={"md"} color="black">
                {occupation === "student" ? "Somme : " : "Salaire : "}
                {`${amount} ${currency_sybol}`}
              </Text>
            </Box>
            <Box
              alignItems={"flex-end"}
              w={"35%"}
              h={"100%"}
              mx={"auto"}
              mt={5}
            >
              <Box
                mt={2}
                alignSelf="flex-end"
                bg={statusPayment.color}
                px={4}
                py={0.5}
                // shadow={1}
                rounded="xl"
              >
                <Text color={"white"}>{statusPayment.text}</Text>
              </Box>
            </Box>
          </HStack>
          <HStack>
            {/* <Text color="gray.500">Détails du paiement...</Text> */}
            <Pressable
              onPress={() => {
                handlePress(paymentDetails);
              }}
            >
              <Text underline={true} fontWeight="500" color="blue.500">
                Voir plus...
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default PaymentCard;
