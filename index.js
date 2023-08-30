const fs = require("fs");
const path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
const inquirer = require("inquirer");
const { addFile, addDoc, hasSameFile } = require("./utils/type");

const { createVueFunc } = require("./createVueFunc/index");
// 项目目录，可以改的
const targetFilePath = path.join(__dirname, "../src/views");
inquirer.prompt(addFile).then(firstAnswers => {
  const newFilerName = firstAnswers.fileName;
  const newTargetFilePath = path.join(targetFilePath, newFilerName);

  if (!fs.existsSync(newTargetFilePath)) {
    fs.mkdirSync(newTargetFilePath);
    console.log(`文件夹 "${newFilerName}" 创建成功！`);

    inquirer.prompt(addDoc).then(secondAnswers => {
      const newDocName = secondAnswers.docName;
      const newDocPath = path.join(newTargetFilePath, newDocName);
      if (!fs.existsSync(newDocPath)) {
        fs.mkdirSync(newDocPath);
        console.log(`文件夹 "${newDocName}" 创建成功！`);
        createVueFunc(newDocPath, newTargetFilePath);
      } else {
        console.log(`文件夹 "${newDocName}" 已存在。请检查路径再来吧～`);
        fs.rmdirSync(newDocPath);
        fs.rmdirSync(newTargetFilePath);
      }
    });
  } else {
    inquirer.prompt(hasSameFile).then(res => {
      if (res.sameFileToCreate) {
        inquirer.prompt(addDoc).then(re => {
          const newDocName = re.docName;
          const newDocPath = path.join(newTargetFilePath, newDocName);
          if (!fs.existsSync(newDocPath)) {
            fs.mkdirSync(newDocPath);
            console.log(`文件夹 "${newDocName}" 创建成功！`);
            createVueFunc(newDocPath, newTargetFilePath);
          } else {
            console.log("一个文件夹中的二级目录不应该相同，请仔细检查后再来创建哦");
            fs.rmdirSync(newDocPath);
            fs.rmdirSync(newTargetFilePath);
          }
        });
      }
    });
  }
});
