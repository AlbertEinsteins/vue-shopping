<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    

    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>

      <el-row class="cat-opt">
        <el-col :span="3" style="font-size: 15px; margin-top: 10px;">选择商品分类:</el-col>
        <el-col :span="6">
          <el-cascader placeholder="请选择三级分类" :options="catList" :props="cascaderConfig" 
            v-model="selectKeys" @change="handleChange">
          </el-cascader>
          
        </el-col>
      </el-row>
      
      <!-- tabs标签页 -->

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisable" @click="">添加参数</el-button>

          <el-table :data="dynamicData" border stripe v-if="!isBtnDisable">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div>
                  
                </div>
              </template>
            </el-table-column>
            
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="">删除</el-button>
                
              </template>
            </el-table-column>
            
          </el-table>
          
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
         <el-button type="primary" :disabled="isBtnDisable" @click="">添加属性</el-button>

          <el-table :data="staticData" border stripe v-if="!isBtnDisable">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div>
                  
                </div>
              </template>
            </el-table-column>
            
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="">删除</el-button>
                
              </template>
            </el-table-column>
            
          </el-table>
           
        </el-tab-pane>
        
      </el-tabs>
      
    </el-card>
    
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      catList: [],
      //级联选择框绑定的数据
      selectKeys: [],
      //级联配置
      cascaderConfig: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
      },
      activeName: 'many',
      //动态参数数据
      dynamicData: [],
      //静态参数数据
      staticData: []
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    async getCatList() {
      const { data: res } = 
        await this.$http.get('/categories') 
      if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')

      this.catList = res.data
    },
    //监听选项卡的切换事件
    handleChange() {
      // console.log(this.selectKeys)
      this.getParams()
    },
    //tab页签的点击事件
    handleTabClick() {
      console.log(this.activeName)
      this.getParams()
    },
    // 获取第三级的分类数据
    async getParams() {
      const { data: res } = 
        await this.$http.get(`/categories/${this.getThirdId}/attributes`, {
          params: { sel: this.activeName }
        })
      if(res.meta.status !== 200) return this.$message.error('获取参数列表失败')

      if(this.activeName == 'many') {
        this.dynamicData = res.data
      }
      else {
        this.staticData = res.data
      }
      console.log(res.data)
    }
  },
  computed: {
    //保证选中的是三级分类
    isBtnDisable() {
      return this.selectKeys.length !== 3
    },
    getThirdId() {
      if(this.isBtnDisable) {
        return null
      }
      return this.selectKeys[2]
    }
  }
}
</script>

<style lang="less" scoped>
.cat-opt {
  margin: 15px 0;
}

</style>