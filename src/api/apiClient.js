import axios from "axios";
import config from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = config.baseUrl;
const db = config.database;

const authenticate = async (
  username = config.username,
  password = config.password
) => {
  const authResponse = await axios.post(url, {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "common",
      method: "login",
      args: [db, username, password],
    },
    id: Math.floor(Math.random() * 1000),
  });
  return authResponse.data.result;
};

const jsonrpcRequest = async (
  sessionId,
  password,
  model,
  constraints = [],
  fields = []
) => {
  const response = await axios.post(url, {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        db,
        sessionId,
        password,
        model,
        "search_read",
        constraints,
        {
          fields: fields,
        },
      ],
    },
    id: Math.floor(Math.random() * 1000),
  });
  return response.data.result;
};

const jsonrpcRequestWrite = async (
  sessionId,
  password,
  model,
  recordId,
  fields
) => {
  const response = await axios.post(url, {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [db, sessionId, password, model, "write", [[recordId], fields]],
    },
    id: Math.floor(Math.random() * 1000),
  });
  return response.data.result;
};

// Fonctions pour AsyncStorage

const storeString = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error("Error storing string:", e);
  }
};

const getString = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.error("Error retrieving string:", e);
  }
};

const storeObject = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error storing object:", e);
  }
};

const getObject = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error retrieving object:", e);
  }
};

const storeArray = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error storing array:", e);
  }
};

const getArray = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error retrieving array:", e);
  }
};

export {
  authenticate,
  jsonrpcRequest,
  jsonrpcRequestWrite,
  storeString,
  getString,
  storeObject,
  getObject,
  storeArray,
  getArray,
};
