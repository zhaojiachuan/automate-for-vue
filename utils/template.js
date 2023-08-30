// 自动生成的页面模板

const fs = require("fs");

function returnSearchItem(searchItem) {
  return searchItem
    .map(item => {
      return `
<el-form-item label=${item.label}>
    <el-input v-model="formSearch.${item.value}" placeholder=${item.label}></el-input>
</el-form-item>`;
    })
    .join("");
}

module.exports.templete = (vueFilePath, tableConfig, apiName, isEnAddParams) => {
  const searchItem = JSON.parse(JSON.stringify(tableConfig));

  const searchResult = searchItem.reduce((acc, item) => {
    acc[item.value] = null;
    return acc;
  }, {});

  const add = type => {
    if (isEnAddParams && type === "button") {
      return `    
<el-button type="primary" style="margin-bottom: 10px" @click="createData"> 创建 </el-button>
      `;
    }
    if (isEnAddParams && type === "drawer") {
      return `
<el-drawer
    title="新增"
    :visible.sync="drawerVisible"
    direction="rtl"
    :before-close="beforeClose"
    size="800px"
    @closed="closeDialog"
>
    <el-form ref="createFormRef" class="mediateForm" status-icon :model="createForm" :rules="rules">
        ${searchItem
          .map(item => {
            return `        
        <el-form-item label=${item.label} prop=${item.value}>
          <el-input v-model="createForm.${item.value}" placeholder=${item.label}></el-input>
        </el-form-item>`;
          })
          .join("")}
    </el-form>
    <div class="drawer-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="validateForm">确 定</el-button>
    </div>
</el-drawer>

      `;
    }
    if (isEnAddParams && type === "create") {
      return `
createData(){
    this.drawerVisible = true
},
beforeClose(done) {
    this.$confirm("确认关闭？").then(() => {
    done();
  });
},
closeDialog() {
    this.drawerVisible = false;
    this.$refs.createFormRef.resetFields();
},
validateForm(){

},
    `;
    }
    if (isEnAddParams && type === "form") {
      return `
            createForm:${JSON.stringify(searchResult)},
        `;
    }
    return ``;
  };

  const tableConfigString = JSON.stringify(tableConfig);
  fs.writeFileSync(
    vueFilePath,
    `
<template>
  <div>
    <el-form :inline="true" :model="formSearch" class="demo-form-inline">
    ${returnSearchItem(searchItem)}
    <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
         <el-button @click="reset">重置</el-button>
    </el-form-item>
    </el-form>
    ${add("button")}
    <VTable :data="tableData" :table-config="tableConfig"></VTable>
    <Pagination @load="queryList" ref="pagination" :total="total" />
    ${add("drawer")}
  </div>
</template>

<script>
import VTable from "@/components/Table";
import Pagination from "@/components/PaginationPlus";
import {
${apiName}
} from "@/api/generate";
export default {
  components: { VTable ,Pagination},
  data() {
    return {
    ${add("form")}
      drawerVisible: false,
      formSearch: ${JSON.stringify(searchResult)},
      tableData: [],
      tableConfig:${tableConfigString},
      loading: false,
      total: 0,
    };
  },
  methods:{
    ${add("create")}
    reset() {
      this.formSearch = ${JSON.stringify(searchResult)}
      this.queryList();
    },

    onSubmit() {
      this.$refs.pagination.pageInfo.pageNo = 1;
      this.queryList();
    },
 
    queryList() {
      const { pageInfo } = this.$refs.pagination;
      this.loading = true;
      const payload = {
        ...this.formSearch,
        current: pageInfo.pageNo,
        size: pageInfo.pageSize,
      };
      ${apiName}(payload).then(({ data }) => {
        this.loading = false;
        this.tableData = data?.records || [];
        this.total = +(data?.total || 0);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  border-top: 1px solid #eee;
  background: #fff;
}

.form {
  padding: 0 40px;
  margin-bottom: 90px;
}
.mediateForm {
  padding: 0 40px 60px 40px;
}
</style>
`
  );
};
