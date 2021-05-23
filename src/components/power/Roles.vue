<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区 -->
        <el-row>
            <el-col>
              <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>  
            </el-col>
        </el-row>

        <!-- 角色列表区域 -->
        <el-table :data="rolelist" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom','vcenter',i1 === 0 ? 'bdtop': '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级和三级权限 -->
                        <el-col :span="19">
                            <!-- 通过for循环嵌套渲染二级权限 -->
                            <el-row :class="['vcenter',i2 === 0 ? '' : 'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="13">
                                    <el-tag type="warning" v-for='(item3,i3) in item2.children' :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                                        {{item3.authName}}
                                        </el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                            </el-row>
                        </el-col>
                        </el-row>
                        <!-- pre规范显示响应数据 -->
                    <!-- <pre>
                        {{scope.row}}
                    </pre> -->
                </template>
            </el-table-column>
            <!-- type="index"索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
  @close="setRightDialogClosed">
  <!-- 树形控件 -->
  <el-tree
  :data="rightslist"
  :props="treeProps"
  show-checkbox
  node-key="id"
  default-expand-all
  :default-checked-keys="defKeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>


    <!-- 添加角色对话框 -->
    <el-dialog
    title="添加角色"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClosed">
    <!-- 添加角色表单数据 -->
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="addRoleForm.roleDesc"></el-input>
            </el-form-item>
            </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
    </span>
</el-dialog>

<!-- 编辑角色对话框 -->
<el-dialog
  title="编辑角色"
  :visible.sync="editDialogVisible"
  width="50%">
  <!-- 编辑角色表单数据 -->
  <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色ID">
          <el-input v-model="editRoleForm.roleId" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 编辑角色对话框的显示与隐藏
            editDialogVisible: false,
            // 所有角色列表数据
            rolelist: [],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,
            // 所有权限的数据
            rightslist: [],
            // 树形控件的属性绑定对象
            treeProps: {
                // 显示的名称
                label: 'authName',
                // 父子嵌套
                children: 'children'
            },
            // 默认选中的Id值数组
            defKeys: [],
            // 当前即将分配权限的角色Id
            roleId: '',
            // 控制添加角色对话框的显示与隐藏
            addDialogVisible: false,
            // 添加角色表单数据
            addRoleForm: {
                roleName:'',
                roleDesc:''
            },
            // 添加角色表单数据的验证规则对象
      addRoleFormRules: {
        roleName: [
            {
                required: true,
                message: '请输入角色名称',
                trigger: 'blur'
                }
        ]
      },
    //   编辑角色表单数据
      editRoleForm: {
          roleId: 0,
          roleName:'',
          roleDesc:''
      },
      // 编辑角色表单数据的验证规则对象
      editRoleFormRules: {
        roleName: [
            {
                required: true,
                message: '请输入角色名称',
                trigger: 'blur'
                }
        ]
      },
      copyId: 0
        }
    },
    created() {
        this.getRolesList()
    },
    methods:{
        // 获取所有角色的列表
        async getRolesList(){
            const {data: res } =await this.$http.get('roles')

            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！');
            }

            this.rolelist = res.data
            // 获取所有角色的列表
            // console.log(this.rolelist)
        },
        
        // 根据Id删除对应的权限
        async removeRightById(role,rightId) {
            // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        // 用catch捕获错误err并返回出来，否则程序返回错误会报错
        }).catch(err => err)
        // 如果用户确认删除，则返回字符串confirm
        // 如果用户取消删除，则返回值为字符串cancel
        // console.log(confirmResult)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }

        // console.log('确认了删除')
        const {data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

        if(res.meta.status !==200) {
        this.$message.error('删除权限失败！')
        }
        
        this.$message.success('删除权限成功！')
        // 用以下代码只会关闭expand重新渲染页面
        // this.getRolesList()
        // 把服务器返回最新的权限直接赋给当前children属性，防止页面刷新
        role.children = res.data
        },


        // 展示分配角色权限的对话框
        async showSetRightDialog(role) {
            this.roleId = role.id
        // 获取所有权限数据
        const {data: res } = await this.$http.get('rights/tree')
        
        if(res.meta.status !==200) {
        return this.$message.error('获取权限失败！')
        }
        
        // 把获取到的权限数据保存到data中
        this.rightslist= res.data
        console.log(res.data)

        // 递归获取三级节点的Id
        this.getLeafKeys(role,this.defKeys)


        this.setRightDialogVisible= true  
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node,arr) {
        // 如果当前 node 节点不包含 children 属性，则是三级节点保存id
        if(!node.children) {
            return arr.push(node.id)
        }

        // 不是三级节点则继续递归
        node.children.forEach(item =>
        this.getLeafKeys(item,arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
        this.defKeys = []
    },
    // 点击确定为角色分配权限
    async allotRights() {
        const keys = [
            // 两个展开运算符 合成一个新数组
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]

        // 所有元素放入一个字符串并用逗号隔开
        const idStr = keys.join(',')

        const  {data : res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids:idStr})

        if (res.meta.status !==200) {
            return this.$message.error('分配权限失败！')
        }

        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
    },
    // 删除角色事件
    async deleteRole(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        // 用catch捕获错误err并返回出来，否则程序返回错误会报错
        }).catch(err => err)
        // 如果用户确认删除，则返回字符串confirm
        // 如果用户取消删除，则返回值为字符串cancel

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }


        const {data: res } =await this.$http.delete('roles/' + id )

        if(res.meta.status !==200){
            return this.$message.error('删除用户失败！')
        }

        this.$message.success('删除用户成功！')
        this.getRolesList()
    },
    // 保存添加角色数据
    async saveRoleInfo() {
        this.$refs.addRoleFormRef.validate(async valid => {
          // 如果不通过校验，直接返回
          if (!valid) return

          // 如果通过校验，则可以发起添加用户的网络请求
          const {data: res } = await this.$http.post('roles',this.addRoleForm)

          if (res.meta.status !==201) {
            this.$message.error('添加用户失败！')
          }
          this.$message.success('添加用户成功！')
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户列表
          this.getRolesList()
        })
    },
    // 监听添加角色对话框的关闭
    addDialogClosed() {
        this.$refs.addRoleFormRef.resetFields()
        this.addRoleForm.roleDesc = ''
    },
    // 打开修改角色对话框
    async showEditDialog(id) {
        const{data: res } = await this.$http.get('roles/' + id)

        if(res.meta.status !==200) {
            return this.$message.error('获取角色信息失败！')
        }

        this.editRoleForm = res.data
        console.log(this.editRoleForm)
        this.editDialogVisible = true
        
        // 为提交修改前的id做备份
        this.copyId = res.data.roleId
    },
    // 提交修改后的角色表单数据
    async editUserInfo() {
        // 验证表单数据
        this.$refs.editRoleFormRef.validate(async valid => {
          // 如果不通过校验，直接返回
          if (!valid) return

          // 如果通过校验，则可以发起添加用户的网络请求
          const {data: res } = await this.$http.put('roles/' + this.copyId,this.editRoleForm)

          if (res.meta.status !==200) {
            this.$message.error('修改角色失败！')
          }
          this.$message.success('修改角色成功！')
          // 隐藏添加用户的对话框
          this.editDialogVisible = false
          // 重新获取用户列表
          this.getRolesList()
        })
    }
    }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin:7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}


.vcenter{
    display: flex;
    // 纵向居中对齐
    align-items: center;
}
</style>