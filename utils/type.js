// 交互处理

module.exports.addFile = [
  {
    type: "input",
    name: "fileName",
    message: "请输入要创建的一级文件夹名称:"
  }
];
module.exports.addDoc = [
  {
    type: "input",
    name: "docName",
    message: "请输入要创建的二级文件夹名称:"
  }
];
module.exports.addVueFile = [
  {
    type: "confirm",
    name: "createVueFile",
    message: "是否要在第二个文件夹内创建一个 Vue 文件?",
    default: true
  }
];
module.exports.setVueName = [
  {
    type: "input",
    name: "vueDocName",
    message: "请输入Vue文件名称(无需携带.vue后缀):"
  }
];
module.exports.hasSameFile = [
  {
    type: "confirm",
    name: "sameFileToCreate",
    message: "文件夹已存在，是否要在此文件夹内创建目录？",
    default: true
  }
];
module.exports.setConfig = [
  {
    type: "input",
    name: "setConfig",
    message: "请输入页面初始化的接口"
  }
];
module.exports.isEnAdd = [
  {
    type: "confirm",
    name: "isEnAdd",
    message: "是否需要（新建）按钮？"
  }
];
