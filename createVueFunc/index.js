const fs = require("fs");
const path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
const inquirer = require("inquirer");
const { templete } = require("../utils/template");
const { chooseUrl } = require("../utils/chooseUrl");
const { setTableConfig } = require("../utils/setTableConfig");
const { addVueFile, setVueName, setConfig, isEnAdd } = require("../utils/type");

module.exports.createVueFunc = (newDocPath, newTargetFilePath) => {
  const setName = (tableConfig, rs, isEnAddParams) => {
    inquirer.prompt(setVueName).then(params => {
      const vueFileName = `${params.vueDocName}.vue`;
      const vueFilePath = path.join(newDocPath, vueFileName);
      templete(vueFilePath, tableConfig, rs[1], isEnAddParams);
      console.log(`Vue 文件 "${vueFileName}" 创建成功！`);
      console.log(`如果项目无法运行，请仔细检查生成代码中是否有写法错误并改正（大部分都是一眼能看出的小问题）。`);
    });
  };
  inquirer.prompt(addVueFile).then(response => {
    if (response.createVueFile) {
      inquirer.prompt(setConfig).then(res => {
        const url = res.setConfig;
        chooseUrl(url).then(rs => {
          if (rs[0] === undefined) {
            console.log("传入接口有误，请仔细检查接口格式与拼写,请前往/api/generate.js中删除错误接口生成的方法");
            fs.rmdirSync(newDocPath);
            fs.rmdirSync(newTargetFilePath);
          } else {
            const r = rs[0];
            const tableConfig = setTableConfig(r);
            inquirer.prompt(isEnAdd).then(data => {
              if (data.isEnAdd) {
                setName(tableConfig, rs, data.isEnAdd);
              } else {
                setName(tableConfig, rs, data.isEnAdd);
              }
            });
          }
        });
      });
    } else {
      console.log(`已退出本次创建`);
      fs.rmdirSync(newDocPath);
      fs.rmdirSync(newTargetFilePath);
    }
  });
};
