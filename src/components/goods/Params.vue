<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 头部警告区 -->
            <el-alert
            title="注意：只允许第三级分类设置相关参数！"
            type="warning"
            show-icon
            :closable="false">
            </el-alert>

            <!-- 选择商品分类区 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的 Cascader 级联选择框 -->
                    <!-- :options指定数据源 -->
                    <!-- props用来指定配置对象 -->
                    <el-cascader
                    v-model="selectedCateKeys"
                    :options="catelist"
                    expand-trigger:="hover"
                    :props="cateProps"
                    @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- tab 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
                    <!-- 动态参数表格border边框 stripe隔行变色 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag :closable="true" v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框与Tag的切换按钮 -->
                                <!-- 输入的文本框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
                    <!-- 静态属性表格border边框 stripe隔行变色 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染Tag标签 -->
                                <el-tag :closable="true" v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入的文本框与Tag的切换按钮 -->
                                <!-- 输入的文本框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <!-- prop验证规则 -->
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 点击动态参数和静态属性按钮弹出对话框 -->
        <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <!-- 添加参数的对话框 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改参数的对话框 -->
    <el-dialog
    :title="'修改' + titleText"
    :visible.sync="editDialogVisible"
    width="50%"
    @close="editDialogClosed">
    <!-- 修改参数表单数据 -->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
    </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表
            catelist: [],
            // 级联选择框的配置对象
            cateProps: {
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 级联选择框双向绑定到的数组
            selectedCateKeys:[],
            // 被激活的页签名称
            activeName: 'many',
            // 动态参数的数据
            manyTableData: [],
            // 静态属性的数据
            onlyTableData: [],
            // 控制添加动态参数和静态属性对话框的显示与隐藏
            addDialogVisible: false,
            // 添加动态参数的表单数据对象
            addForm: {
                attr_name: ''
            },
            // 添加表单验证规则对象
            addFormRules: {
               attr_name: [
                   {
                       required: true, message:'请输入参数名称',trigger:'blur'
                   }
               ]
            },
            // 控制修改对话框的显示与隐藏
            editDialogVisible: false,
            // 修改的表单数据对象
            editForm: {},
            // 修改表单数据验证规则对象
            editFormRules: {
               attr_name: [
                   {
                       required: true, message:'请输入参数名称',trigger:'blur'
                   }
               ]
            },
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有的商品分类列表
        async getCateList() {
            const {data : res } = await this.$http.get('categories')
            if(res.meta.status !==200) {
                return this.$message.error('获取商品分类失败！')
            }

            this.catelist = res.data
            console.log(res.data)
        },
        // 级联选择框选中项变化，会触发这个函数
        handleChange() {
            // 触发获取参数列表数据
           this.getParamsData()
    },
    // 这是Tab页签点击事件的处理事件
    handleTabClick() {
        // 触发获取参数列表数据
        this.getParamsData()
        // console.log(this.activeName)
    },
    // 获取参数的列表数据
    async getParamsData() {
         // 选中的不是三级分类
            if (this.selectedCateKeys.length !==3){
            this.selectedCateKeys = []
            this.manyTableData= []
            this.onlyTableData= []
            return 
        }
        
        // 否则选中的是三级分类
        // console.log(this.selectedCateKeys)
        // 根据所选Id分类和当前所处的面板，获取对应的参数，然后发送请求
        const {data : res } = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})

        if(res.meta.status !== 200) {
            return this.message.error('获取参数列表失败！')
        }

        // 将本来返回是字符串的attr_vals转成数组,三元表达式过滤空字符串
        res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 控制文本框的显示与隐藏
            item.inputVisible = false
            // 文本框中输入的值
            item.inputValue = ''
        })

        console.log(res.data)

        if (this.activeName === 'many') {
            this.manyTableData = res.data
        }else {
            this.onlyTableData = res.data
        }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
        this.$refs.addFormRef.resetFields()
    },
            // 点击按钮，添加参数
    addParams() {
        this.$refs.addFormRef.validate(async valid => {
            // 如果不通过校验，直接返回
            if (!valid) return
            // 如果通过校验，则可以发起添加用户的网络请求
            const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                attr_name: this.addForm.attr_name,
                attr_sel: this.activeName
            })

            if(res.meta.status !== 201) {
                return this.$message.error('添加参数失败！')
            }

            this.$message.success('添加参数成功！')
            this.addDialogVisible =false
            this.getParamsData()
        })
         },
        //  点击动态参数和静态属性按钮修改按钮显示修改对话框
         async showEditDialog(attr_id) {
            //  查询当前参数的信息
             const {data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
             {
                 params: { attr_sel:this.activeName}
             })
             if(res.meta.status !==200 ) {
                 return this.$message.error('获取参数信息失败！')
             }
             this.editForm = res.data
             this.editDialogVisible = true
         },
        //  重置修改的表单
         editDialogClosed() {
             this.$refs.editFormRef.resetFields()
         },
        //  点击提交按钮，修改提交参数信息
        editParams() {
            // 表单数据预校验
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return

                const{data:res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })
                if(res.meta.status !==200) {
                    return this.$message.error('修改参数失败！')
                }
                
                this.$message.success('提交参数信成功！')
                this.getParamsData()
                this.editDialogVisible= false
                

            })
        },
        // 根据id删除对应参数项
        async removeParams(attr_id){
            // Message Box弹框
            // $confirm的返回值是promise，需要简化async和await简化这次操作
            // 此次返回的文本，不需要解构赋值用confirResult来接收
          const confirResult =await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        //   如果取消了，要用catch捕获错误，并return出去
        }).catch(err => err)

        // 用户取消了删除操作
        if(confirResult !== 'confirm') {
            return this.$message.info('已取消删除！')
        }
        // 确认删除，走删除业务的逻辑
        const {data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !== 200) {
            return this.$message.error('删除参数失败！')
        }

        this.$message.success('删除参数成功！')
        this.getParamsData()
        },
        // 文本框失去焦点或摁下Enter都会触发
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            // 如果没有return，则证明输入内容了，需要后续处理  
            row.attr_vals.push(row.inputValue.trim())  
            row.inputValue = ''
            row.inputVisible = false
            
            console.log(row)
            // 发送请求保存到数据库中
            this.saveAttrVals(row)
        },
        // 点击Tag展示文本输入框
        showInput(row) {
            row.inputVisible = true
            // 让文本框自动获得焦点
            // $nextTick方法作用，就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
                })
        },
        // 删除对应的参数可选项
        async handleClose(i, row) {
            // 删除所选序号，一个
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        },
        // 将对attr_vals的操作保存到数据库
        async saveAttrVals(row) {
            // 发送请求保存到数据库中
            const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
            {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' ')

            })

            if(res.meta.status !==200 ) {
                return this.$message.error('修改参数项失败！')
            }
            this.$message.success('修改参数项成功！')
        }
    },
    computed: {
        // 如果按钮需要被禁用，则返回true，否则返回false
        isBtnDisabled() {
            if (this.selectedCateKeys.length !== 3) {
                return true
            }
            return false
        },
        // 当前选中的三级分类Id
        cateId() {
            if (this.selectedCateKeys.length ===3) {
                return this.selectedCateKeys[2]
            }
            return null
        },
        // 动态计算 动态参数和静态属性的 区分
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            return '静态属性'
        },
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-tag {
    margin: 10px;
}
.input-new-tag {
    width: 120px;
}
</style>