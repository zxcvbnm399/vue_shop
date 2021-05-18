<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 头部提示区 -->
            <el-alert
            title="消息提示的文案"
            type="info"
            center
            show-icon
            :closable="false">
            </el-alert>
<!-- 让步骤条与tag栏联动的核心：让el-steps中激活activeIndex与el-tabs中v-model共用一个数据activeIndex -->
            <!-- 步骤条区域 -->
            <el-steps align-center :space="200" :active="activeIndex - 0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 表单包裹Tabs label-position文本与输入框位置关系-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
            <!-- tag栏左侧纵向标签页区域 :before-leave阻止切换标签属性（自带两个参数）-->
            <el-tabs :before-leave="beforeTabLeave" v-model="activeIndex" :tab-position="'left'" @tab-click="tabClicked">
              <el-tab-pane label="基本信息" name="0">
                  <!-- 表单内容 prop放addFormRules规则里面对象规则-->
                  <el-form-item label="商品名称" prop="goods_name">
                      <el-input v-model="addForm.goods_name"></el-input>
                  </el-form-item>
                  <el-form-item label="商品价格" prop="goods_price">
                      <el-input v-model="addForm.goods_price" type="number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品重量" prop="goods_weight">
                      <el-input v-model="addForm.goods_weight" type="number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品数量" prop="goods_number">
                      <el-input v-model="addForm.goods_number" type="number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品分类" prop="goods_cat">
                      <!-- 级联选择器 :props级联选择器配置项 :options指定数据源-->
                      <el-cascader
                      expand-trigger="hover"
                      v-model="addForm.goods_cat"
                      :props="cateProps"
                      :options="catelist"
                      @change="handleChange">
                      </el-cascader>
                  </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                  <!-- 渲染表单的Item项 -->
                  <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                      <!-- 复选框组 -->
                      <el-checkbox-group v-model="item.attr_vals">
                          <el-checkbox border size="mini" :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                          </el-checkbox-group>
                  </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                  <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                      <el-input v-model="item.attr_vals"></el-input>
                  </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="3">
                  <!-- action表示图片要上传到的后台API地址 -->
                  <el-upload
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :headers="headerObj"
                  :action="uploadURL"
                  :on-preview="handlePreview"
                  list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                  <!-- 富文本编辑器组件 -->
                  <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                  <!-- 添加商品的按钮 -->
                  <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览的对话框显示图片 -->
        <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data() {
        return {
            // 当前Tab索引号
            activeIndex: '0',
            // 添加商品的表单数据对象
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所属的分类数组
                goods_cat: [],
                // 图片的数组
                pics: [],
                // 商品的详情描述
                goods_introduce: '',
                // 动态参数与静态属性数据
                attrs:[]
            },
            addFormRules: {
                goods_name: [
                    {
                        required: true, message:'请输入商品名称！',trigger:'blur'
                    }
                ],
                goods_price: [
                    {
                        required: true, message:'请输入商品价格！',trigger:'blur'
                    }
                ],
                goods_weight: [
                    {
                        required: true, message:'请输入商品重量！',trigger:'blur'
                    }
                ],
                goods_number: [
                    {
                        required: true, message:'请输入商品数量！',trigger:'blur'
                    }
                ],
                goods_cat: [
                    {
                        required: true, message:'请选择商品分类！',trigger:'blur'
                    }
                ]
            },
            // 商品分类列表
            catelist: [],
            // 级联选择器配置项
            cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            // 动态参数的列表数据
            manyTableData: [],
            // 静态属性的列表数据
            onlyTableData: [],
            // 上传图片的URL地址
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            // 图片上传组件的headers请求头对象
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 点击图片预览保存的绝对路径
            previewPath: '',
            // 控制图片预览对话框的显示与隐藏
            previewVisible: false
            }
 
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有商品分类数据        
        async getCateList() {
            const {data: res } = await this.$http.get('categories')

            if(res.meta.status !==200) {
                return this.$message.error('获取商品分类数据失败！')
            }

            this.catelist = res.data
            console.log(res.data)
        },
        // 级联选择器选中项变化触发该函数
        handleChange() {
            
            if(this.addForm.goods_cat.length !==3) {
                return this.addForm.goods_cat = []
            }
            console.log(this.addForm.goods_cat)
        },
        // 阻止切换标签
        beforeTabLeave(activeName,oldActiveName) {
            // console.log('即将进入标签' + activeName)
            // console.log('即将离开标签' + oldActiveName)
            if(oldActiveName === '0' && this.addForm.goods_cat.length !==3) {
                this.$message.error('请先选择商品分类！')
                return false
            }

        },
        // Tab切换事件
        async tabClicked() {
            // 如果访问的是动态参数面板
            if(this.activeIndex === '1') {
                const {data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{
                        sel: 'many'
                    }
                })
                if(res.meta.status !== 200) {
                    return this.$message.error('获取动态参数面板失败！')
                }

                // 这个是PINK老师教程版本但是数组中有空格元素没去掉，所以用下面版本
                // res.data.forEach(item => {
                //     item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                // })

                // 这个是去掉数组内空格元素的版本
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.split(" ").filter(str=>{return !!str})
                })

                console.log(res.data)
                this.manyTableData = res.data                
            } else if(this.activeIndex === '2') {
              const {data : res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{
                        sel: 'only'
                    }
                })
                if (res.meta.status !==200 ) {
                    return this.$message.error('获取静态属性失败！')
                }
                console.log(res.data)
                this.onlyTableData = res.data   
            }
        },
        // 处理图片预览效果
        handlePreview(file) {
            console.log(file)
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        // 处理移除图片的操作
        handleRemove(file) {
            console.log(file)
            // 1.获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path
            // 2.从pics数组中，找到这个图片对应的索引值
            const i = this.addForm.pics.findIndex(x => x.pic === filePath)
            // 3.调用数组的splice方法，把图片信息对象，从pics数组中移除
            this.addForm.pics.splice(i,1)

            console.log(this.addForm)
        },
        // 监听图片上传成功的事件
        handleSuccess(response) {
            console.log(response)
            // 1.拼接得到一个图片信息对象
            const picInfo = { pic: response.data.tmp_path }
            // 2.将图片信息对象，push到pics数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm)
            },
        // 添加商品
        add() {
            this.$refs.addFormRef.validate( async valid => {
                if(!valid) {
                    return this.$message.error('请填写必要的表单项！')
                }
                // 执行添加的业务逻辑
                // lodash  cloneDeep(obj) .join与级联选择器有冲突
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                // this.addForm = form
                // 处理动态参数
                this.manyTableData.forEach(item =>{
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                        }
                    this.addForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.onlyTableData.forEach(item =>{
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_vals: item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs
                console.log(form) 


                // 发起请求添加商品
                // 商品的名称，必须是惟一的
                const {data: res } = await this.$http.post('goods', form)

                if(res.meta.status !== 201) {
                    return this.$message.error('创建商品失败！')
                }

                this.$message.success('创建商品成功！')
                // 创建成功后自动跳转商品列表页面
                this.$router.push('/goods')
            })
        }
    },
    computed:{
        // 三级计算属性
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>
<style lang="less" scoped>
.el-alert {
    text-align: center;
}
.el-checkbox {
    margin: 0 5px 0 0 !important;
}
.previewImg {
    width: 100%;
}
.btnAdd {
    margin-top: 15px;
}
</style>