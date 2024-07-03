import { ethers, BigNumber } from "ethers";
import { logNullCalldataMsg } from "../utils/log";
import { readJSONFilesInFolder } from "./abiReader";


function processParam(input: ethers.utils.ParamType[], resultObject: any = {}) {
    input.forEach((paramType,i) => {
      resultObject[`${paramType.name || `unCheck${i}`}(${paramType.type})`] = Array.isArray(
        paramType.components
      )
        ? processParam(paramType.components)
        : null;
    });
  
    return resultObject;
  }
  
  function replaceFrag(title: string) {
    return title.replace(/\([^)]*\)/g, "");
  }
  
  function processArgs(object: any, decodeCalldata: ethers.utils.Result) {
    Object.keys(object).forEach((val,i) => {

      // @Fixed match with Result`s index
      // const arg = decodeCalldata[replaceFrag(val)];
      const arg = decodeCalldata[i];
  
      object[val] =
        object[val] !== null
          ? processArgs(object[val], arg)
          : BigNumber.isBigNumber(arg)
          ? BigNumber.from(arg).toString()
          : arg;
    });
  
    return object;
  }
  
  export const decodeCalldata = async (calldata: string,root:any[]) => {
    try {
      const abi = readJSONFilesInFolder(root);

      const i = new ethers.utils.Interface(abi);
      const selector = calldata.substring(0, 10);
  
      // CHECK INVALID SELECOTR
      const frag = i.getFunction(selector);
      const title = processParam(frag.inputs);
      const decodeCalldata = i.decodeFunctionData(selector, calldata);
      
      const params = processArgs(title, decodeCalldata);
      const result = {
        function: frag.name,
        params: { ...params },
      };
  
      return result;
    } catch (error: any) {
      if (error.code == ethers.errors.INVALID_ARGUMENT) {
        return logNullCalldataMsg(calldata);
      } else {
        console.log(error);
      }
    }
  };
  