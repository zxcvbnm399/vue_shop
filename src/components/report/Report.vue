<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据统计</el-breadcrumb-item>
          <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 2.第二步为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// 1.第一步导入echarts
import echarts from 'echarts'
// 深拷贝的导入
import _ from 'lodash'

export default {
    data() {
        return {
            // 需要合并的数据
            options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
        }
        },
    
    created() {},
    // 此时页面上的元素已经被渲染完毕了
    async mounted() {
        // 3.第三步基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))

        const { data: res } = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200) {
            return this.$message.error('获取折线图数据失败！')
        }

        // 将返回值直接给第五步
        // 4.第四步指定图表的配置项和数据
        // var option = {
        //     title: {
        //         text: 'ECharts 入门示例'
        //     },
        //     tooltip: {},
        //     legend: {
        //         data:['销量']
        //     },
        //     xAxis: {
        //         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        //     },
        //     yAxis: {},
        //     series: [{
        //         name: '销量',
        //         type: 'bar',
        //         data: [5, 20, 36, 10, 10, 20]
        //     }]
        // }
        // lodash提供merge函数合并两个对象
        const result = _.merge(res.data,this.options)
        // 5.第五步展示数据
        myChart.setOption(result)
    },
    methods: {}
}
</script>

<style lang="less" scoped>
</style>