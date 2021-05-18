<template>
    <div>
        <!-- 面包屑导航区域 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片视图区域 -->
<el-card>
    <el-row>
        <el-col>
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
    </el-row>

    <!-- 表格 -->
    <!-- :selection-type和:expand-type中false是布尔值，要加冒号 -->
    <!-- 具体使用方法https://github.com/MisterTaki/vue-table-with-tree-grid -->
    <tree-table
    class="treeTable"
    :data="catelist"
    :columns="columns"
    :selection-type="false"
    :expand-type='false'
    :show-index='true'
    index-text='#'
    :border='true'
    :show-row-hover='false'>
    <!-- 是否有效模板 -->
    <!-- 定义作用域插槽，名字为isok，slot-scope="scope"接收该行的数据 -->
    <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
        <i class="el-icon-error" style="color: red;" v-else></i> 
    </template>
    <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
        <el-tag size="mini" type="warning" v-else>三级</el-tag>
    </template>
    <template slot="opt" slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
    </template>
    </tree-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<!-- 添加分类对话框 -->
<el-dialog
  title="添加分类"
  :visible.sync="addCateDialogVisible"
  width="50%"
  @close="addCateDialogClosed">
  <!-- 添加分类的表单 -->
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
      <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
          <!-- 选择添加分类的 Cascader 级联选择框 -->
          <!-- :options指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
          v-model="selectedKeys"
          :options="parentCateList"
          :props="cascaderProps"
          expand-trigger="hover"
          @change="parentCateChanged"
          clearable
          change-on-select>
          </el-cascader>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            // 查询条件
            querInfo: {
                type: 3,
                // 当前页码
                pagenum: 1,
                // 一页显示条数
                pagesize: 5
            },
            // 商品分类的数据列表，默认为空
            catelist: [],
            // 总商品数据条数
            total: 0,
            // 为table指定 列的定义
            columns:[
                {
                    // lable属性指定标题，prop指定对应列内容的值
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    // 表示当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    // 表示当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'order'
                },
                {
                    label: '操作',
                    // 表示当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'opt'
                }
            ],
            // 控制添加分分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                // 将要添加的分类的名称
                cat_name: '',
                // 父级分类的Id
                cat_pid: 0,
                // 分类的等级，默认要添加的是一级分类
                cat_level: 0
            },
            // 添加分类表单的验证规则对象
            addCateFormRules:{
                cat_name:[
                    {
                        required: true, message:'请输入分类名称',trigger:'blur'
                    }
                ]
            },
            // 父级分类的列表
            parentCateList: [],
            // 指定级联选择器配置对象
            cascaderProps: {
                // 指定选中的那个值
                value: 'cat_id',
                // 看到的值
                label: 'cat_name',
                // 父子嵌套的那个属性
                children: 'children'
            },
            selectedKeys: []
        }
    },    
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const {data: res} = await this.$http.get('categories',{ params: this.querInfo })

            if(res.meta.status !==200 ) {
                return this.$message.error('获取商品分类失败！');
            }

            console.log(res.data.result)
            // 把数据列表，赋值给 catelist
            this.catelist = res.data.result
            // 为总数据条数赋值
            this.total = res.data.total
        },
        // 监听pagesize改变
        handleSizeChange(newSize) {
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum改变
        handleCurrentChange(newpage) {
            this.querInfo.pagenum = newpage
            this.getCateList()
        },
        // 点击按钮，显示添加分类的对话框
        showAddCateDialog() {
            // 先获取父级分类的数据列表
            this.getParentCateList()
            // 再显示对话框
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const {data: res } = await this.$http.get('categories',{ params: { type: 2 } })

            if(res.meta.status !==200 ) {
                return this.$message.error('获取父级分类数据失败！');
            }

            console.log(res.data)
            this.parentCateList = res.data
        },
        // 选择项发生变化触发这个函数
        parentCateChanged() {
            console.log(this.selectedKeys)
            // 如果selectedKeys数组中的length大于0，证明有选中父级分类
            // 反之，没选中任一父级分类
            if(this.selectedKeys.length > 0) {
                // 父级分类的Id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                // 父级分类的Id
                this.addCateForm.cat_pid = 0
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = 0
            }
        },
        // 点击添加分类确定按钮，添加新的分类
        addCate() {
            this.$refs.addCateFormRef.validate(async valid => {
          // 如果不通过校验，直接返回
          if (!valid) return
          // 如果通过校验，则可以发起添加用户的网络请求
          const { data: res } = await this.$http.post('categories', this.addCateForm)

          if(res.meta.status !== 201) {
              return this.$message.error('添加分类失败！')
          }
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible=false
        }
            )},
        // 监听对话框的关闭事件，重置表单数据
        addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
        this.selectedKeys = []
      }
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>