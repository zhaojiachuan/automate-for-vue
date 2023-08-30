// 设置表头
module.exports.setTableConfig = data => {
  const tableConfig = data.map(item => {
    return {
      value: item.name,
      label: item.description
    };
  });
  return tableConfig;
};
