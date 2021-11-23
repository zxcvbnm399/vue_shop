<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索框和搜索按钮，添加商品按钮 -->
            <!-- gutter指定分栏间隔 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- table表格区域 :data数据源绑定 border边框 stripe隔行变色-->
            <el-table :data="goodslist" border stripe>
                <!-- type="index"索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" width="140px">
                    <!-- 调用时间过滤器dateFormat -->
                    <template slot-scope="scope">{{scope.row.upd_time | dateFormat}}</template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.goods_id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 background给页码加背景 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background>
            </el-pagination>
        </el-card>

        <!-- 编辑商品对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="showEditDialogVisiable"
        width="50%"
        @close="editFormClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="商品ID" prop="id">
                  <el-input v-model="editForm.id"></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="editForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="goods_price">
                  <el-input v-model="editForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="goods_number">
                  <el-input v-model="editForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="重量" prop="goods_weight">
                  <el-input v-model="editForm.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="介绍">
                  <el-input v-model="editForm.goods_introduce"></el-input>
                </el-form-item>
                <el-form-item label="上传的图片临时路径">
                  <el-input v-model="editForm.pics.pics_big"></el-input>
                </el-form-item>
                <el-form-item label="商品的参数">
                  <el-input v-model="editForm.attrs.attr_value"></el-input>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="showEditDialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return{
            // 查询参数对象
            queryInfo: {
                // 查询关键字
                query: '',
                // 第几页，当前页码
                pagenum: 1,
                // 每页显示条数
                pagesize: 10
            },
            // 商品列表
            goodslist: [],
            // 总数据条数
            total: 0,
            // 控制编辑商品信息对话框的显示与隐藏
            showEditDialogVisiable: false,
            // 编辑提交商品数据表单
            editForm: {
                id: 0,
                goods_name:'',
                goods_price: 0,
                goods_number:0,
                goods_weight:0,
                goods_introduce:'',
                pics:{
                    pics_id: 0,
                    goods_id: 0,
                    pics_big: '',
                    pics_mid: '',
                    pics_sma: ''
                },
                attrs:[]
            },
            // 编辑提交商品数据表单校验规则
            editFormRules: {
        id: [
            {
                required: true,
                message: '请输入商品id',
                trigger: 'blur'
                }
                ],
        goods_name: [
            {
                required: true,
                message: '请输入商品名称',
                trigger: 'blur'
                }
                ],
        goods_price: [
            {
                required: true,
                message: '请输入商品价格',
                trigger: 'blur'
                }
                ],
        goods_number: [
            {
                required: true,
                message: '请输入商品数量',
                trigger: 'blur'
                }
                ],
        goods_weight: [
            {
                required: true,
                message: '请输入商品介绍',
                trigger: 'blur'
                }
                ]
      }
        }
    },
    created(){
        this.getGoodsList()
    },
    methods: {
        // 根据分页获取对应的商品列表
        async getGoodsList(){
            const {data: res } = await this.$http.get('goods', {params:this.queryInfo})

            if(res.meta.status !==200) {
                return this.$message.error('获取商品列表失败！')
            }

            this.$message.success('获取商品列表成功！')
            console.log(res.data)
            this.goodslist = res.data.goods
            this.total = res.data.total
        },
        // 改变每页显示多少条消息
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 当前页码数改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 删除商品按钮
        async removeById(id) {
            // await简化操作返回一个字符串，用confirmResult接收
            const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
        }).catch(err => err)

        if(confirmResult !== 'confirm') {
            return this.$message.info('已取消删除！')
        }

        const {data: res } = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !== 200) {
            return this.$message.error('删除失败！')
        }
        this.$message.success('删除成功！')
        this.getGoodsList()
        },
        goAddpage() {
            this.$router.push('/goods/add')
        },
        // 激活编辑商品对话框
        async showEditDialog(id) {
            const {data: res } = await this.$http.get('goods/' + id)

                this.editForm.id=res.data.goods_id
                this.editForm.goods_name=res.data.goods_name
                this.editForm.goods_price=res.data.goods_price
                this.editForm.goods_number=res.data.goods_number
                this.editForm.goods_weight=res.data.goods_weight
                this.editForm.goods_introduce=res.data.goods_introduce

                this.editForm.pics.pics_id=res.data.pics[0].pics_id
                this.editForm.pics.goods_id=res.data.pics[0].goods_id
                this.editForm.pics.pics_big=res.data.pics[0].pics_big
                this.editForm.pics.pics_mid=res.data.pics[0].pics_mid
                this.editForm.pics.pics_sma=res.data.pics[0].pics_sma   

                this.editForm.attrs=res.data.attrs[0]

                
            this.showEditDialogVisiable = true
            console.log(res.data)
            console.log(this.editForm)
        },
        // 提交编辑商品表单数据
        async editGoodsInfo() {
            // 验证表单数据
        this.$refs.editFormRef.validate(async valid => {
          // 如果不通过校验，直接返回
          if (!valid) return

          // 如果通过校验，则可以发起添加用户的网络请求
          const {data: res } = await this.$http.put('goods/' + this.editForm.id,this.editForm)

          console.log(res)
          if (res.meta.status !==201) {
            this.$message.error('修改商品信息失败！')
            return
          }

          this.$message.success('修改商品信息成功！')
          // 隐藏添加用户的对话框
          this.showEditDialogVisiable = false
          // 重新获取用户列表
          this.getGoodsList()
        })
        },
        // 监听修改商品信息对话框的关闭
        editFormClosed() {
            this.$refs.editFormRef.resetFields()
            this.editForm.goods_introduce = ''
        }

    }
}
</script>

<style lang="less" scoped>
</style>