import React from "react";
import { Button, HStack, Spinner, Text } from "native-base";

const CustomButton = ({ onPress, title, isDisabled, loading = true }) => {
  return (
    <Button onPress={onPress} isDisabled={isDisabled} mt={"15%"}>
      {loading ? (
        <Text>{title}</Text>
      ) : (
        <HStack>
          <Spinner size="sm" color="white" />
          <Text>{` ${title}`}</Text>
        </HStack>
      )}
    </Button>
  );
};

export default CustomButton;
