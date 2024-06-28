import axios from "axios";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const postData = {
  id: 1,
  jsonrpc: "2.0",
};

export const arb_getBlockByHash = async (url: string, params: string[]) => {
  try {
    const {data} = await axios.post(
      url,
      { method: "eth_getBlockByHash", params,...postData },
      { headers }
    );
    return data.result;
  } catch (error) {
    console.error(error);
  }
};
