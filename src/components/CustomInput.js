import React from "react";
import { Input, FormControl, Icon, Pressable, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useField } from "formik";

const CustomInput = ({
  label,
  name,
  secureTextEntry,
  showPassword,
  setShowPassword,
  keyboardType = "default",
  inputRef,
  onSubmitEditing,
}) => {
  const [field, meta] = useField(name);
  const { value, onChange, onBlur } = field;
  const { error, touched } = meta;

  return (
    <FormControl mt={"10%"} isInvalid={touched && !!error}>
      <FormControl.Label>{label}</FormControl.Label>
      <Input
        ref={inputRef}
        keyboardType={keyboardType}
        autoCapitalize="none"
        returnKeyType="next"
        color={"black"}
        value={value}
        onChangeText={onChange(name)}
        onBlur={onBlur(name)}
        onSubmitEditing={onSubmitEditing}
        type={secureTextEntry && !showPassword ? "password" : "text"}
        InputRightElement={
          secureTextEntry ? (
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Icon
                as={
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                  />
                }
                size={5}
                mr={2}
              />
            </Pressable>
          ) : null
        }
      />
      {touched && error && (
        <Text color="red.500" mt={2}>
          {error}
        </Text>
      )}
    </FormControl>
  );
};

export default CustomInput;
