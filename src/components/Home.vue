<template>
  <el-container class="home-container">
    <el-header>
      <div class="left">
        <img src="../assets/girl.jpg" alt="">
        <span>管理系统</span>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px': '200px'">
        <div class="menu-close-open" @click="collapseMenu">||||</div>
        <el-menu :default-active="activePath" router :collapse-transition="false" :collapse="isCollapse" unique-opened 
          background-color="#373d41" text-color="#fff" active-text-color="#409eff">
          
          <el-submenu v-for="(item) in menuList" :key="item.id" :index="item.id + ''">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="savePath('/' + subItem.path)" 
              v-for="(subItem) in item.children" :key="subItem.id" :index="'/' + subItem.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>


          </el-submenu>

        </el-menu>

      </el-aside>
      <!-- 内容显示区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        menuList: [],
        isCollapse: false,
        activePath: '',
      }
    },
    name: '',
    created() {
      this.getMenuList() 
      this.activePath = window.sessionStorage.getItem('itemPath')
    },
    methods: {
      savePath(path) {
        window.sessionStorage.setItem('itemPath', path)
        this.activePath = path
      },
      //获取侧边栏菜单
      async getMenuList() {
        const { data: res } = await this.$http.get('menus')
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        
        this.menuList = res.data 

      },
      collapseMenu() {
        this.isCollapse = ! this.isCollapse 
      }
    },
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    .left {
      display: flex;
      align-items: center;

      img {
        width: 150px;
      }

      span {
        margin-left: 15px;
      }
    }
  }
  .menu-close-open {
    background-color: #373d41;
    color: #fff;
    font-size: 14px;
    letter-spacing: 0.3em;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: 0;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
</style>