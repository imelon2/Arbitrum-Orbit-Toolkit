import readline from "readline";
import { ansi } from "./logStyle";
import { ethers } from "ethers";


export const logConfirm = async (
  message: string,
  script: () => Promise<any>
) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answerCallback = async (answer: string, script: () => Promise<any>) => {
    if (answer === "y") {
      await script();
      rl.close();
    } else if (answer === "n") {
      console.log("Cancel Transaction");
      rl.close();
    } else {
      console.log("Cancel Transaction");
      rl.close();
    }
  };

  rl.question("\n" + message + " (y/n)" + "\n", (answer) =>
    answerCallback(answer, script)
  );
};

export const successLog = (funcName: string) => {
  console.log(`Success Run ${funcName} ... 🎉`);
};

export const logNullCalldataMsg = (calldata: string) => {
  const msg = `
${ansi.BrightRed} ABI에 존재하지 않은 Calldata입니다. ${calldata}${ansi.reset}
    `;

  console.log(msg);
};

export const logErrorMsg = (
  response: string,
  message: string,
  systemMessage?: string,
  isInternal?: boolean
) => {
  const msg = `
${ansi.RedBg} ${isInternal ? "INTERNAL" : ""}REVERT ${ansi.reset} ${
    ansi.BrightRed
  }Error Message${ansi.reset}
    error : ${ansi.BrightWhite}${message}${ansi.reset} ${
    systemMessage ? "\n    system message : " + systemMessage : ""
  }
    error hash : ${response}`;

  console.log(msg);
};

export const logCustomErrorMsg = (
  response: string,
  message: string,
  param?: string,
  isInternal?: boolean
) => {
  const msg = `
${ansi.RedBg} ${isInternal ? "INTERNAL " : ""}CUSTOM REVERT ${ansi.reset} ${
    ansi.BrightRed
  }Error Message${ansi.reset}
    error : ${ansi.BrightWhite}${message}${ansi.reset}${
    param ? "\n    error params : " + param : ""
  }
    error hash : ${response}`;

  console.log(msg);
};

export const logNullTxMsg = (txHash?:string) => {
  const msg = `
${ansi.BrightRed} 존재하지 않은 Tx Hash입니다. ${txHash}${ansi.reset}
    `;

  console.log(msg);
}

export const logNullReceiptCalldataMsg = () => {
  const msg = `
${ansi.BrightRed} Receipt에 Calldata가 없습니다. ${ansi.reset}
    `;

  console.log(msg);
}

export const logSuccessMsg = () => {
  const msg = `
${ansi.RedGreen} SUCCESS ${ansi.reset}`;
  console.log(msg);
}

export const logTransactionReceipt = (
  receipt: ethers.providers.TransactionReceipt
) => {
  const msg = `
${ansi.Magenta}Transaction Receipt${ansi.reset}
    ${ansi.BrightWhite}transaction hash : ${receipt.transactionHash}${ansi.reset}
    gas used : ${receipt.gasUsed}
    effectiveGasPrice gas : ${receipt.effectiveGasPrice}
    block hash : ${receipt.blockHash}
    block number : ${receipt.blockNumber}
    form : ${receipt.from}
    to : ${receipt.to}
  `;

  console.log(msg);
};

export const logDecodedCalldata = (
  data:any
) => {
  const msg = `
${ansi.Magenta}Decoded Calldata${ansi.reset}
${JSON.stringify(data,null,4)}
  `;

  console.log(msg);
};