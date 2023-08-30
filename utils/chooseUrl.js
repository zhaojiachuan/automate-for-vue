// 输入接口后的处理
const axios = require("axios");
const fs = require("fs");
const path = require("path");

function toCamelCase(input) {
  const words = input.split("/").filter(word => word.length > 0);

  if (words.length <= 1) {
    return words[0];
  }

  const camelCaseWords = words.map((word, index) => {
    if (index === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return camelCaseWords.join("");
}

module.exports.chooseUrl = async url => {
  let needData;
  const newPath = url.substring(10);
  // 根据url进行方法命名
  const funcName = toCamelCase(newPath);
  const needParams = [];
  //   在api文件夹下会创建一个js文件，保存调取查询接口的方法
  const targetFolderPath = path.join(__dirname, "../../src/api");
  const filePath = path.join(targetFolderPath, "generate.js");

  if (!fs.existsSync(filePath)) {
    if (!fs.existsSync(targetFolderPath)) {
      fs.mkdirSync(targetFolderPath);
      console.log(`文件夹 "${targetFolderPath}" 创建成功！`);
    } else {
      console.log(`文件夹 "${targetFolderPath}" 已存在。`);
    }

    const content = `
    import request from "@/utils/request";

export function ${funcName}(params) {
  return request({
    url: '${newPath}',
    method: "get",
    params
  });
}
    `;

    fs.writeFileSync(filePath, content);
    console.log(`文件 generate.js 创建成功并写入内容！`);
  } else {
    const content = `

export function ${funcName}(params) {
  return request({
    url: '${newPath}',
    method: "get",
    params
  });
}
    `;

    fs.appendFileSync(filePath, content);
    console.log(`文件 generate.js 已存在。已自动将新的方法写入文件中`);
  }

  // url匹配后获取table-config
  await axios.get("http://192.168.0.12:8989/mediation/v2/api-docs").then(response => {
    const list = response.data.paths;
    const keys = Object.keys(list);
    keys.forEach(item => {
      if (item.includes(newPath)) {
        needParams.push(item);
      }
    });
    needData = list[needParams[0]];
  });
  return [needData?.get?.parameters, funcName];
};
