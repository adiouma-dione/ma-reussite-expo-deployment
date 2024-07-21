import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { Box, StatusBar, Text, VStack } from "native-base";
import React, { useRef, useState } from "react";
import { authenticate, jsonrpcRequest } from "../api/apiClient";
import config from "../api/config";
import { CustomButton, CustomInput, LoginScreenBanner } from "../components";
import { loginValidationSchema } from "../validation/formValidation";

const LoginScreen = () => {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogin = async (values) => {
    setLoading(false);
    try {
      const sidAdmin = await authenticate();
      const partners = await jsonrpcRequest(
        sidAdmin,
        config.password,
        config.model.partner,
        [[["email", "=", values.email]]],
        ["self"]
      );
      if (partners.length > 0) {
        const partnerid = partners[0].self;
        setError("");
        setLoading(true);
        navigation.navigate("TabNavigator", {
          sessionId: sidAdmin,
          email: config.username,
          password: config.password,
          partnerid: partnerid,
        });
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect !");
      }
    } catch (error) {
      console.error("Odoo JSON-RPC Error:", error);
      setError("Nom d'utilisateur ou mot de passe incorrect !");
    } finally {
      setLoading(true);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <LoginScreenBanner />
      <Box height={"100%"}>
        <VStack
          width={"full"}
          minH={"80%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box mx={"auto"} width="80%" display={"flex"}>
            <Box alignItems="center">
              <Text color={"black"} fontSize="2xl" bold>
                S'identifier
              </Text>
            </Box>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={handleLogin}
            >
              {({ handleSubmit, isValid }) => (
                <>
                  <CustomInput
                    label="Email"
                    name="email"
                    keyboardType="email-address"
                    inputRef={input1Ref}
                    onSubmitEditing={() => input2Ref.current.focus()}
                  />
                  <CustomInput
                    label="Mot de passe"
                    name="password"
                    secureTextEntry
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    inputRef={input2Ref}
                    onSubmitEditing={handleSubmit}
                  />
                  {error ? (
                    <Text color={"danger.500"} textAlign={"center"} mt={3}>
                      {error}
                    </Text>
                  ) : null}
                  <CustomButton
                    onPress={handleSubmit}
                    title="Se connecter"
                    isDisabled={!isValid}
                    loading={loading}
                  />
                </>
              )}
            </Formik>
          </Box>
        </VStack>
      </Box>
    </>
  );
};

export default LoginScreen;
