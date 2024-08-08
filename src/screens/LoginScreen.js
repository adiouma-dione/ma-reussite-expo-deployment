import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { Box, StatusBar, Text, useToast, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {
  authenticate,
  jsonrpcRequest,
  storeArray,
  storeObject,
} from "../api/apiClient";
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
  const [connectedUser, setConnectedUser] = useState({
    sessionId: "",
    email: "",
    password: "",
    partnerid: "",
    groups_id: [],
    role: "",
  });
  const [selectedChild, setSelectedChild] = useState({});
  const [children, setChildren] = useState([]);

  const handleLogin = async (values) => {
    setLoading(false);
    try {
      const sidAdmin = await authenticate();
      const partner = await jsonrpcRequest(
        sidAdmin,
        config.password,
        config.model.users,
        [[["email", "=", values.email]]],
        ["self", "is_student", "is_parent", "groups_id"]
      );

      // console.log("partner...", partner);

      if (partner.length > 0) {
        const partnerid = partner[0].self;
        setError("");
        const role = partner[0].groups_id.includes(
          Number(process.env.EXPO_PUBLIC_ADMIN_ID)
        )
          ? "admin"
          : partner[0].groups_id.includes(
              Number(process.env.EXPO_PUBLIC_TEACHER_ID)
            )
          ? "teacher"
          : partner[0].is_parent
          ? "parent"
          : partner[0].is_student
          ? "student"
          : "other";

        // console.log("role...", role);

        await storeObject("connectedUser", {
          sessionId: sidAdmin,
          email: config.username,
          password: config.password,
          partnerid: partnerid,
          groups_id: partner[0].groups_id,
          role: role,
        });

        setConnectedUser({
          sessionId: sidAdmin,
          email: config.username,
          password: config.password,
          partnerid: partnerid,
          groups_id: partner[0].groups_id,
          role: role,
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

  useEffect(() => {
    if (connectedUser?.role !== "parent") return;

    const loadParentData = async () => {
      try {
        if (!connectedUser) throw new Error("Missing connectedUser data");

        const fetchedChildren = await jsonrpcRequest(
          connectedUser.sessionId,
          connectedUser.password,
          config.model.opParents,
          [[["name", "=", connectedUser.partnerid[0]]]],
          ["student_ids"]
        );

        if (!fetchedChildren.length || !fetchedChildren[0].student_ids.length)
          throw new Error("No children found");

        const studentIds = fetchedChildren[0].student_ids;
        const students = await jsonrpcRequest(
          connectedUser.sessionId,
          connectedUser.password,
          config.model.opStudent,
          [],
          ["id", "partner_id"]
        );

        const childrenList = students.filter((student) =>
          studentIds.includes(student.id)
        );

        if (!childrenList.length) throw new Error("No matching students found");

        setChildren(childrenList);
        const initialSelectedChild = childrenList[0];
        setSelectedChild(initialSelectedChild);

        await storeArray("children", childrenList);
        await storeObject("selectedChild", initialSelectedChild);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (connectedUser?.role) loadParentData();
  }, [connectedUser]);

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const currencies = await jsonrpcRequest(
          connectedUser.sessionId,
          connectedUser.password,
          config.model.resCurrency,
          [],
          ["id", "symbol"]
        );

        storeObject("currencies", currencies);

        const taxes = await jsonrpcRequest(
          connectedUser.sessionId,
          connectedUser.password,
          config.model.accountTax,
          [],
          ["id", "name"]
        );

        storeObject("taxes", taxes);
        // console.log("TAX...", taxes);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    if (connectedUser?.role) getCurrencies();
  }, [connectedUser]);

  useEffect(() => {
    switch (connectedUser?.role) {
      case "student":
        navigation.navigate("TabNavigator", connectedUser);
        break;
      case "parent":
        if (children.length > 0 && Object.keys(selectedChild).length > 0) {
          navigation.navigate("ParentTabNavigator", connectedUser);
        }
        break;
      case "teacher":
        navigation.navigate("TeacherTabNavigator", connectedUser);
        break;
      case "admin":
        navigation.navigate("AdminTabNavigator", connectedUser);
        break;
      default:
        break;
    }
  }, [children, selectedChild, connectedUser]);

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
