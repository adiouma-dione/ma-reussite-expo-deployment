import axios from "axios";
import config from "./config";

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

export { authenticate, jsonrpcRequest, jsonrpcRequestWrite };
