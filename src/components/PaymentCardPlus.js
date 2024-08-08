import { Box, HStack, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { getObject } from "../api/apiClient";

const PaymentCardPlus = ({ paymentDetails, occupation = "student" }) => {
  const statusPayment =
    paymentDetails.state !== "not_paid"
      ? { color: "success.600", text: "Payé" }
      : { color: "danger.600", text: "Non Payé" };

  const [taxName, setTaxName] = useState();

  useEffect(() => {
    const getTaxes = async () => {
      try {
        const taxes = await getObject("taxes");
        taxes.forEach((tax) => {
          if (tax.id === paymentDetails.tax_ids[0]) {
            console.log("tax name = ", tax.name);
            setTaxName(tax.name);
          }
        });
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    if (paymentDetails) getTaxes();
  }, [paymentDetails]);

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
            <Text color={"black"} mb={2}>
              {`Référence : ${paymentDetails.name}`}
            </Text>
            <Text color={"black"} mb={2}>
              {occupation === "student" ? "Etudiant(e) : " : "Professeur(e) : "}
              {paymentDetails.partner_id[1]}
            </Text>
            {/* {taxName && (
              <>
                <Text color={"black"} mb={2}>
                  {`HT : ${paymentDetails.price_subtotal} ${paymentDetails.currency_sybol}`}
                </Text>
                <Text color={"black"} mb={2}>
                  {`Taxe : ${taxName}`}
                </Text>
              </>
            )} */}
            <Text fontSize={"lg"} mb={2} color="black">
              {occupation === "student" ? "Somme TTC : " : "Salaire : "}
              {`${paymentDetails.amount} ${paymentDetails.currency_sybol}`}
            </Text>
            {paymentDetails.state === "not_paid" && (
              <Text color={"black"} mb={2}>
                {`Date d'échéance : ${paymentDetails.date.split("-")[2]} ${
                  paymentDetails.product_id[1]
                } ${paymentDetails.date.split("-")[0]}`}
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
