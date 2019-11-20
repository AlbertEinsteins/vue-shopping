<template>
  <div class="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>

    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryVo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" type="primary" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisiable = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table style="margin-top: 14px;" :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>

          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditDialog(scope.row.id)" 
              type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" 
              circle size="mini" @click="deleteUser(scope.row.id)"></el-button>

            <el-tooltip :enterable="false" content="分配角色" placement="top" effect="dark">
              <!-- content to trigger tooltip here -->
              <el-button type="danger" icon="el-icon-setting" 
                circle size="mini" @click="distributeRole(scope.row.id)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination style="margin-top: 15px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryVo.pagenum" :page-sizes="[1,2,5,10,15]" :page-size="queryVo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisiable" width="50%" @close="clearForm">
      <!-- 添加表单 -->
      <el-form :model="addForm" :rules="addFormRules" 
        ref="formRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog title="修改" 
      :visible.sync="editDialogVisiable"
      width="50%">
      
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder=""></el-input>
        </el-form-item>

      </el-form>
      

      <span slot="footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editUser">修 改</el-button>
      </span>
    </el-dialog>
    
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="changeRoleDialogVisiable" 
      width="50%" @close="clearChangeRoleId">

      <el-row>
        <el-col :span="4">
          <el-tag type="primary">{{ curUser.username }}</el-tag>
          
        </el-col>
        <el-col :span="20">
          <el-select v-model="changeRoleId" placeholder="请选择">
            <el-option v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
          
        </el-col>
      </el-row>
            

      <span slot="footer">
        <el-button @click="changeRoleDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="changeRoleById">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      //邮箱验证规则
      var emailValidator = (rule, v, cb) => {
        const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if(regEmail.test(v)) {
          return cb()
        }
        else {
          cb(new Error('请输入合法的邮箱'))
        }
      }
      var mobileValidator = (rule, v, cb) => {
        const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        if(regMobile.test(v)) {
          return cb()
        }
        else {
          return cb(new Error('请输入合法的电话号码'))
        }
      }
      return {
        queryVo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        userList: [],
        total: 0,
        addDialogVisiable: false,
        editDialogVisiable: false,
        addForm: {},
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名长度在3-10之间', trigger: 'blur' }
          ],  
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码长度在6-15之间', trigger: 'blur' } 
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: emailValidator, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入电话', trigger: 'blur' },
            { validator: mobileValidator, trigger:'blur' }
          ]
        },
        editForm: {},
        changeRoleDialogVisiable: false,
        //角色列表
        roleList: { },
        curUser: { },
        changeRoleId: ''
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('/users', {
          params: this.queryVo
        })
        if (res.meta.status !== 200) return this.$message.error('数据获取失败')

        this.userList = res.data.users
        this.total = res.data.total
      },
      handleSizeChange(newSize) {
        this.queryVo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPagenum) {
        this.queryVo.pagenum = newPagenum
        this.getUserList()
      },
      async userStateChange(user) {
        const {
          data: res
        } = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        if (res.meta.status !== 200) {
          user.mg_state = !user.mg_state
          return this.$message.error('用户状态更新失败!')
        }
        this.$message.success('用户状态更新成功!')
      },
      //关闭谈话框，清空表单
      clearForm() {
        this.$refs.formRef.resetFields() 
      },
      addUser() {
        this.$refs.formRef.validate(async isValid => {
          if(!isValid) return 
          const { data: res } = await this.$http.post('/users', this.addForm)
          if(res.meta.status !== 201) {
            return this.$message.error('添加失败!')
          }
          
          this.$message.success('添加成功!')
          this.addDialogVisiable = false
          this.getUserList()
        }) 
      },
      //显示编辑用户对话框
      async showEditDialog(id) {
        const { data: res}
          = await this.$http.get('/users/' + id)
        if(res.meta.status !== 200) return this.$message.error('查询用户失败')

        this.editForm = res.data
        this.editDialogVisiable = true 
      },
      //修改用户信息
      editUser() {
        this.$refs.editFormRef.validate(async isValid => {
          if(!isValid) return 

          const { data: res } = await this.$http.put('/users/' + this.editForm.id, 
            { email: this.editForm.email, mobile: this.editForm.mobile })
          if(res.meta.status !== 200) return this.$message.error('更新失败')

          this.editDialogVisiable = false 
          this.getUserList()
          this.$message.success('更新成功!')
        })
      },
      //删除用户
      async deleteUser(id) {
        const rsText = await this.$confirm('此操作将永久删除用户，是否继续?', 
          '提示', { 
          confirmButtonText: '确定', 
          cancelButtonText: '取消', 
          type: 'warning' 
        }).catch(err => err)

        if(rsText != 'confirm') {
          return this.$message.info('取消')
        }

        const { data: res } = await this.$http.delete('/users/' + id)
        if(res.meta.status !== 200) return this.$message.error('删除失败')

        this.$message.success('删除成功!')
        this.getUserList()
      },
      //分配角色对话框的显示
      async distributeRole(userId) {
        const { data: res } = await this.$http.get('/users/' + userId) 
        if(res.meta.status !== 200) return this.$message.info('加载用户信息失败')

        this.curUser = res.data 
        if(res.data.rid > 0) {
          this.changeRoleId = res.data.rid
        }
        

        //查询所有的角色列表
        const { data: res2 } = await this.$http.get('/roles')
        if(res2.meta.status !== 200)  return this.$message.info('加载角色信息失败')

        this.roleList = res2.data


        this.changeRoleDialogVisiable = true
      },
      //修改用户的角色
      async changeRoleById() {
        
        if(this.changeRoleId) {
          const { data: res } = await 
            this.$http.put('/users/' + this.curUser.id + '/role', { rid: this.changeRoleId })
          if(res.meta.status !== 200) return this.$message.error('角色修改失败, 管理员不能被修改')

          this.$message.success('角色修改成功')
          this.getUserList()
          this.changeRoleDialogVisiable = false
          return 
        } 
        this.$message.info('请重新选择有效角色')
      },
      clearChangeRoleId() {
        this.changeRoleId = ''
      }  
    },


  }
</script>

<style lang="less" scoped>

</style>