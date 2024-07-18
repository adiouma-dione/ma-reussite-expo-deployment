import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { Box, Link, ScrollView, Text, VStack } from "native-base";
import React, { useState } from "react";
import { authenticate, jsonrpcRequest } from "../api/apiClient";
import { CustomButton, CustomInput, LoginScreenBanner } from "../components";
import { loginValidationSchema } from "../validation/formValidation";
import config from "../api/config";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogin = async (values) => {
    setLoading(false);
    try {
      const sid = await authenticate(values.email, values.password);
      if (sid) {
        console.log("sid...", sid);
        const sidAdmin = await authenticate();
        const partner = await jsonrpcRequest(
          sidAdmin,
          config.password,
          config.model.opStudent,

          [[["email", "=", values.email]]],
          ["partner_id"]
        );
        const partnerid = partner[0].partner_id;
        console.log("partnerid...", partnerid);
        setError("");
        setLoading(true);
        navigation.navigate("TabNavigator", {
          sessionId: sidAdmin,
          email: config.username,
          password: config.password,
          studentId: partnerid,
        });
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect !");
      }
    } catch (error) {
      console.error("Odoo JSON-RPC Error:", error);
      setError("Nom d'utilisateur ou mot de passe incorrect !");
    } finally {
      setLoading(true); // Arrête le chargement une fois les paiements chargés
    }
  };

  return (
    <ScrollView height={"80%"} flex={1}>
      <VStack width={"full"}>
        <LoginScreenBanner />
        <VStack mx={"auto"} width="80%">
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
                  secureTextEntry={false}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                <CustomInput
                  label="Mot de passe"
                  name="password"
                  secureTextEntry={true}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
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
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default LoginScreen;
