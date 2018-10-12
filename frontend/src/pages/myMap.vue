<template>
    <div class="map_froMe">
        <div id="myMap">
        
        </div>
        <div class="search_result">
            <div class="header">
                <el-input v-model="input" placeholder="请输入内容" size="small" v-model="searchValue"></el-input>
                <el-button type="primary" size="small" @click="mapToSearch">搜索</el-button>
            </div>
            <div id="result" v-if="shosearchResult">

            </div>
        </div>
    </div>
</template>

<script>
    import BMap from 'BMap'
    export default {
        name : 'myMap',
        data () {
            return {
                searchValue: '',
                localSearch: null,

                shosearchResult: false
            }
        },
        mounted () {
            this.pageReady()
        },
        watch: {
            searchValue (val) {
                if (val == '') {
                    this.shosearchResult = false
                } else {
                    this.shosearchResult = true
                }
            }
        },
        methods: {
            pageReady () {
                let myMap = new BMap.Map('myMap')
                // 创建点坐标
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        let x = position.coords.longitude.toFixed(3)
                        let y = position.coords.latitude.toFixed(3)
                        let point = new BMap.Point(x, y); // 创建点坐标
                        myMap.centerAndZoom(point, 15)
                        // 添加点
                        this.addFlag(point, myMap)
                    })
                } else {
                    myMap.centerAndZoom('上海', 15)
                    this.$message.warning('请打开获取位置的权限！')
                }
                //启用滚轮放大缩小            
                myMap.enableScrollWheelZoom()
                // 添加工具条比例尺控件
                myMap.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}))
                myMap.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT}))

                // 搜索
                this.localSearch = new BMap.LocalSearch(myMap, {
                    renderOptions: {map: myMap, panel: "result"}
                })
            },
            addFlag (point, map) {
                let marker = new BMap.Marker(point)
                map.addOverlay(marker)
                marker.setAnimation(BMAP_ANIMATION_BOUNCE)
            },
            // 搜索
            mapToSearch () {
                this.localSearch.search(this.searchValue);
            }
        }
    }
</script>

<style scoped lang="scss">
    .map_froMe{
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: calc(100% - 94px);
        #myMap{
            width: 100%;
            height: 100%;
        }
        .search_result{
            position: absolute;
            top: 30px;
            left: 20px;
            .header{
                display: flex;
                margin-bottom: 10px;
                .el-input{
                    margin-right: 10px;
                }
            }
        }
    }
</style>
