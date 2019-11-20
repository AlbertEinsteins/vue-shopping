<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-row>
      <el-col :span="4">
        <el-button type="primary" @click="showAddDialog">添加角色</el-button>
        
      </el-col>
      
    </el-row>
    
    <!-- 卡片 -->
    <el-card>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', idx1 == 0 ? 'bdtop' : '', 'vertical-center']" v-for="(item, idx1) in scope.row.children" :key="item.id">
              <!-- 第一列：一级 -->
              <el-col :span="5">
                <el-tag type="primary">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>            
              </el-col>
              <el-col :span="19">

                <!-- 二级 -->
                <el-row :class="[idx2 == 0 ? '': 'bdtop', 'vertical-center']" v-for="(item2, idx2) in item.children" :key="item2.id">
                  <el-col :span="8">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="12">
                    <el-tag closable v-for="(item3) in item2.children" 
                      :key="item3.id" type="warning" @close="removePermissionById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                    
                  </el-col>
                </el-row>
                
              </el-col>
            </el-row>
            
          </template>
        </el-table-column>
        
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="370px">
          <template slot-scope="scope">
            <el-button @click="editRoleDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button @click="deleteById(scope.row.id)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button @click="showDistributeDialog(scope.row)" type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
            
          </template>
        </el-table-column>
      </el-table>
      
    </el-card>


    <!-- 添加dialog -->
    <el-dialog id="addDialog" title="添加角色" :visible.sync="addDialog"
      width="50%" @close="clearAddForm">

      <el-form :model="addForm" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名">
          <el-input v-model="addForm.roleName" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc" placeholder="角色描述"></el-input>
          
        </el-form-item>
        
      </el-form>
    
      <span slot="footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">添 加</el-button>
      </span>
    </el-dialog>
    
    <!-- 修改dialog -->
    <el-dialog title="修改角色" :visible.sync="editDialog" 
      width="50%" @close="clearEditForm">
      <el-form :model="editForm" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
        
      </el-form>
      


      <span slot="footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    
    <!-- 分配权限 -->
    <el-dialog title="" :visible.sync="distributeDialog" width="50%"
      @close="clearTreeIds">
      
      <el-tree ref="treeRef" :data="permissionList" :props="treeProps"
        show-checkbox node-key="id" default-expand-all :default-checked-keys="defaultIds">

      </el-tree>
      

      <span slot="footer">
        <el-button @click="distributeDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRolePermissions">确 定</el-button>
      </span>
    </el-dialog>
    
  </div> 
</template>

<script>
export default {
  name: '',
  data() {
    return {
      roleList: [],
      addDialog: false,
      addForm: {},
      editDialog: false,
      editForm: {},
      //权限对话框
      distributeDialog: false,
      permissionList: [],
      //属性控件的属性绑定
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的节点id
      defaultIds: [],
      //当前被修改的角色，再点击分配权限时，赋值
      curRoleId: '',
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('/roles')
      if(res.meta.status !== 200)  return this.$message.error('请求失败')
      this.roleList = res.data 

    },
    testLayer() {
      //TODO
    },
    showAddDialog() {
      this.addDialog = true 
    },
    async addRole() {
      const { data: res } = 
        await this.$http.post('/roles', this.addForm)
      if(res.meta.status !== 201) return this.$message.error('添加失败')

      this.$message.success('添加成功!')
      this.getRoleList()
      this.addDialog = false 
    },
    clearAddForm() {
      this.clearForm(this.$addFormRef)
    },
    clearForm(formRef) {
      if(formRef)
        formRef.resetFields()
    },
    //根据id删除角色
    async deleteById(rid) {
      const confirmText = await 
        this.$confirm('确定是否删除，不可恢复?', '确认消息', {
          confirmButtonText: '是',
          cancelButtonText: '取消'
        }).catch(err => err)

      if(confirmText == 'cancel') {
        return this.$message.info('取消')
      }
      const { data: res } = await this.$http.delete(`/roles/${rid}`)
      if(res.meta.status !== 200) return this.$$message.error('删除失败!')

      this.$message.success('删除成功!')
      this.getRoleList()
    },
    //根据id查询获取的角色
    async editRoleDialog(rid) {
      const { data: res } =
        await this.$http.get('/roles/' + rid)
      if(res.meta.status !== 200) return this.$message.error('角色信息查询失败!')
      
      

      this.editForm = res.data

      // console.log(this.editForm);

      //弹出对话框
      this.editDialog = true
    },
    async editRole() {
      const { data: res } = 
        await this.$http.put('/roles/' + this.editForm.roleId, this.editForm)
      if(res.meta.status !== 200) return this.$message.error('修改失败!')

      this.getRoleList()
      this.$message.success('修改成功!')
      this.editDialog = false
    },
    clearEditForm() {
      this.clearForm(this.$editFormRef)
    },
    //根据角色id和权限id删除对应的权限
    async removePermissionById(role, pid) {
      const confirmText = 
        await this.$confirm('此操作将删除该权限,不可恢复,是否继续?', '确认消息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      
      if(confirmText == 'cancel') {
        return this.$message.info('取消')
      }

      const { data: res }
        = await this.$http.delete(`/roles/${role.id}/rights/${pid}`)
      if(res.meta.status !== 200) return this.$message.error('删除权限失败')

      role.children = res.data      
    },
    //分配权限对话框
    async showDistributeDialog(role) {
      const { data: res }
        = await this.$http.get('/rights/tree')
      if(res.meta.status !== 200) return this.$message.error('获取权限失败')

      this.permissionList = res.data
      
      //保存角色id
      this.curRoleId = role.id 
      this.getPermissionIds(role, this.defaultIds)

      this.distributeDialog = true 
    },
    //递归获取选中角色的所有权限id
    getPermissionIds(node, ar) {
      if(!node.children) {       //递归基
        return ar.push(node.id)
      }
      node.children.forEach(node => {
        this.getPermissionIds(node, ar)
      })
    },
    // 清除选中的默认id
    clearTreeIds() {
      this.defaultIds = []
    },  
    //获取树形控件的ids, 提交修改
    async editRolePermissions() {
      const ids = [
        this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const { data: res } =
        await this.$http.post(`/roles/${this.curRoleId}/rights`, { rids: ids.join(',') })
      if(res.meta.status !== 200) return this.$message.error('分配权限失败')

      this.$message.success('权限分配成功')
      this.getRoleList()
      this.distributeDialog = false
    }
  },
}
</script>

<style lang="less" scoped>

.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vertical-center {
  display: flex;
  align-items: center;
}
.el-card {
  margin-top: 5px;
}
</style>