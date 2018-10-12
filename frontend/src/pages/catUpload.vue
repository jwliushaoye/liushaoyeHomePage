<template>
    <div class="upload">
        <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            name=""
            @on-progress="handleProcess"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: 'upload',
        data(){
            return {
                fileList: []
            }
        },
        methods: {
            handleProcess(event, file, fileList){
                console.log(event, file, fileList)
            }
        }
    }
</script>

<style scoped lang="scss">
    .upload{
        padding: 15px;
        box-sizing: border-box;
    }
</style>
