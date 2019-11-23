<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      
      <!-- 数据表格 -->
      <tree-table class="tree-table" :data="cateList" :columns="cateConfig" 
        :selection-type="false" show-index border
        :show-row-hover="false" :expand-type="false"
        index-text="#">

        <!-- 自定义的是否有效模板列 -->
        <template slot="isOk" slot-scope="scope">
          <i style="color: lightgreen;" class="el-icon-success" v-if="scope.row.cat_deleted == false"></i>
          <i style="color: red;" class="el-icon-error" v-else></i>
        </template>

        <!-- 自定义的排序模板列 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.cat_level == 0">一级标签</el-tag>
          <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level == 1">二级标签</el-tag>
          <el-tag type="danger" size="mini" v-else>三级标签</el-tag>
          
        </template>

        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="">编 辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="">删 除</el-button>
          
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="queryVo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryVo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
      
    </el-card>
    
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisiable"
      width="50%" @close="clearAddForm">
      
      <el-form :rules="addFormRules" :model="addForm" 
        ref="addFormRef" label-width="80px">
        <el-form-item label="分类名" prop="cat_name">
          <el-input v-model="addForm.cat_name" placeholder="请输入分类名"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <el-cascader :show-all-levels="false" :options="parentCatList" clearable
            v-model="selectKeys" :props="cascadeConfig" @change="handleChange">
          </el-cascader>
          
        </el-form-item>
      </el-form>
            

      <span slot="footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      queryVo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //分类总数
      total: 0,
      //分类列表
      cateList: [],
      //分类配置
      cateConfig: [
        {
          label: '分类名',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      addDialogVisiable: false,
      addForm: {
        cat_name: '',
        //父类分类的id
        cat_pid: 0,
        //分类登记，默认是0--表示一级
        cat_level: 0
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCatList: [],
      cascadeConfig: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } =
        await this.$http.get('/categories', { params: this.queryVo })
      if(res.meta.status !== 200) return this.$message.error('获取分类失败')

      // console.log(res.data)
      this.cateList = res.data.result 
      this.total = res.data.total
    },
    // 分页功能所需函数
    sizeChange(newSize) {
      this.queryVo.pagesize = newSize
      this.getCateList()
    },
    currentChange(newPage) {
      this.queryVo.pagenum = newPage
      this.getCateList()
    },
    //显示添加分类的对话框
    showAddDialog() {
      this.getParentCatList()
      this.addDialogVisiable = true
    },
    //查询所有的父级分类
    async getParentCatList() {
      const { data: res }
        = await this.$http.get('/categories', { type: 2 })
      if(res.meta.status !== 200) return this.$message.error('查询父级分类失败')

      // console.log(res.data)
      this.parentCatList = res.data
    },
    //级联选择框事件
    handleChange() {
      if(this.selectKeys.length > 0) {
        this.addForm.cat_pid = this.selectKeys[this.selectKeys.length - 1] 
        this.addForm.cat_level = this.selectKeys.length
      }
      else {
        this.addForm.cat_pid = 0 
        this.addForm.cat_level = 0
      }
    },
    //添加分类
    addCat() {
      // console.log(this.addForm)
      this.$refs.addForm.validate(async isValidate => {
        if(!isValidate) return 

        const { data: res } = 
          await this.$http.post('/categories', this.addForm)
        if(res.meta.status !== 200) return this.$message.error('添加分类失败')

        this.$message.success('添加成功!')
        this.showAddDialog = false
      })

    },
    //清空表单
    clearAddForm() {
      this.$refs.addFormRef.resetFields()
      this.selectKeys = []
      this.addForm.cat_pid = this.addForm.cat_level = 0
    }
  },
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 10px;
}
.tree-table {
  margin-bottom: 5px;
}

.el-cascader {
  width: 100%;
}
</style>