<template>
  <!-- 头部区 -->
  <el-container class="home-container">
    <el-header>
      <div>
        <img class="pic" src="../assets/basketball.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <!-- 动态绑定对应id的值 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // eslint-disable-line左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // eslint-disable-line是否折叠
      isCollapse: false,
      // eslint-disable-line 被激活的链接地址
      activePath:''
    }
  },
  // eslint-disable-line生命周期函数，调getMenuList获取所有的左侧菜单
  created() {
    this.getMenuList()
  // eslint-disable-line每次刷新页面都记住上一个激活的链接地址 
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      // eslint-disable-line解构响应中的data赋值给res
      const { data: res } = await this.$http.get('menus')
      // eslint-disable-line如果获取失败，将弹出错误消息内容框
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },

    // eslint-disable-line点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // eslint-disable-line保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath', activePath)
    // eslint-disable-line 点击行为实时激活状态
      this.activePath = activePath
      }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  //flex布局的 左右贴边对齐属性
  justify-content: space-between; 
  padding-left: 0;
  // flex布局的 居中对齐盒内各元素：
  align-items: center;
  color: #fff;
  font-size: 20px;
  //嵌套
  > div {
    display: flex;
    //纵向居中对齐
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer; //鼠标放上去变成小手
}
.pic{
  margin-left: 10px;
  width: 40px;
  border-radius: 5px;
}
</style>
