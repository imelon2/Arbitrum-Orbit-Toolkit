import fs from "fs";
import * as path from "path";

export function readJSONFilesInFolder(
  folderPaths: any[],
  type: "function" | "error" | "event" = "function"
) {
  // Result
  let bundlingABI: any[] = [];

  folderPaths.map((folderPath) => {
    const fileNames = fs.readdirSync(folderPath);
  
    fileNames.forEach((fileName) => {
      const filePath = path.join(folderPath, fileName);
      const isDirectory = fs.statSync(filePath).isDirectory();
      const fileExtension = path.extname(fileName).toLowerCase();
  
      // 디렉토리인 경우 디렉토리 탐색
      if (isDirectory) {
        const subdirectoryABI = readJSONFilesInFolder([filePath], type);
        bundlingABI = bundlingABI.concat(subdirectoryABI);
        // JSON 파일인 경우
      } else if (fileExtension === ".json" && !fileName.includes(".dbg.json")) {
        try {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const jsonData = JSON.parse(fileContent).abi;
          const functionIndexes = jsonData.filter(
            (obj: any) => obj.type === type
          );
  
          bundlingABI = bundlingABI.concat(functionIndexes);
          // console.log(`File: ${fileName}, Content:`);
        } catch (error: any) {
          console.error(`Error reading JSON file ${fileName}:`, error.message);
        }
      }
    });
  })

  // 중복 제거
  const uniqueNames = new Array();
  return bundlingABI.filter((obj) => {
    const args = obj.inputs.reduce(
      (acc: any, curr: any) => acc + curr.type,
      ""
    );
    if (
      uniqueNames.find((item) => item.name == obj.name && item.type == args)
    ) {
      return false;
    }
    uniqueNames.push({ name: obj.name, type: args });
    return true;
  });
}

export function readJSONFilesInFolderBytescode(folderPath: any) {
  const fileNames = fs.readdirSync(folderPath);
  let bundlingABI: any[] = [];

  fileNames.forEach((fileName) => {
    const filePath = path.join(folderPath, fileName);
    const isDirectory = fs.statSync(filePath).isDirectory();
    const fileExtension = path.extname(fileName).toLowerCase();

    // 디렉토리인 경우 디렉토리 탐색
    if (isDirectory) {
      const subdirectoryABI = readJSONFilesInFolderBytescode(filePath);
      bundlingABI = bundlingABI.concat(subdirectoryABI);
      // JSON 파일인 경우
    } else if (fileExtension === ".json" && !fileName.includes(".dbg.json")) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        // const jsonData = JSON.parse(fileContent).deployedBytecode.object; // bytecode 조회;
        const jsonData = JSON.parse(fileContent).deployedBytecode; // bytecode 조호;

        bundlingABI = bundlingABI.concat({ [fileName]: jsonData });
        // console.log(`File: ${fileName}, Content:`);
      } catch (error: any) {
        console.error(`Error reading JSON file ${fileName}:`, error.message);
      }
    }
  });
return bundlingABI
}