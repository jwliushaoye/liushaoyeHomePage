<template>
    <div class="myArticle">
        <el-button @click="ops_article" type="primary" plain>添加文章</el-button>

        <!-- 天加或编辑文章列表 -->
        <el-dialog :title="article_title" :visible.sync="dialogFormVisible" width="600px">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="标题" :rules="{required : true , message : '标题不得为空' , trigger: 'blur'}">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="链接" :rules="{required : true , message : '标题不得为空' , trigger: 'blur'}">
                    <el-input v-model="form.link"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.comment" type="textarea"></el-input>
                </el-form-item>
            </el-form>


            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add_article">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 文章列表 -->
        <el-table
            :data="articleList"
            border
            style="width: 100%">
            <el-table-column
                prop="title"
                label="标题"
                >
            </el-table-column>
            <el-table-column
                prop="link"
                label="文章链接"
                >
            </el-table-column>
            <el-table-column
                prop="comment"
                label="备注"
                >
            </el-table-column>
             <el-table-column
                prop="create_time"
                width="160"
                label="创建时间"
                >
            </el-table-column>
            <el-table-column
                prop="creater"
                width="120"
                label="创建者"
                >
            </el-table-column>
            <el-table-column
                prop="address"
                width="150"
                label="操作">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                        <el-button @click="editArticles(scope.row)" icon="el-icon-edit" size="small" circle type="primary"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
                         <el-button @click="previewArticles(scope.row.link)" icon="el-icon-view" size="small" circle type="primary"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                        <el-button @click="deleteArticles(scope.row._id)" icon="el-icon-delete" size="small" circle type="primary"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 文章网站预览 -->
        <el-dialog title="预览" :visible.sync="dialogFormVisible2" :fullscreen="true">
            <iframe height="800" :src="previewWebContent" scrolling="auto" class="iframe"></iframe>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="dialogFormVisible2 = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name : 'myArticle',
        data () {
            return {
                articleList : [] ,
                dialogFormVisible : false,

                article_title : '',

                form : {
                    title : '',
                    link : '',
                    comment : ''
                },

                dialogFormVisible2: false,
                previewWebContent: '',

                updataId: ''
            }
        },
        created(){
            this.get_all_articles()
        },
        methods : {
            ops_article(){
                this.dialogFormVisible = true;
                this.article_title = '创建';
                this.form = {
                    title : '',
                    link : '',
                    comment : ''
                }
            },
            async get_all_articles(){
                let rsp = await this.$http(this.apiRoot + '/article/show-articles' , {} , 'post');
                if(rsp.ret == 0){
                    this.articleList = rsp.data;
                }else {
                    this.$message.error(rsp.error_msg);
                }
            },
            async add_article(){
                let [rsp , obj] = [
                    '' ,
                    {
                        title : this.form.title,
                        link : this.form.link,
                        comment : this.form.comment,
                        id: this.updataId
                    }
                ];
                if(this.article_title == '创建'){
                    rsp = await this.$http(this.apiRoot + '/article/add-articles' , obj , 'post');
                }else {
                    rsp = await this.$http(this.apiRoot + '/article/update-articles' , obj , 'post');
                }
                if(rsp.ret == 0){
                    //操作成功
                    this.$message.success('操作成功!');
                    this.get_all_articles();
                    this.dialogFormVisible = false;
                }else {
                    this.$message.error(rsp.error_msg);
                }
            },
            // 编辑
            editArticles(rowData){
                this.dialogFormVisible = true;
                this.form = {
                    title : rowData.title,
                    link : rowData.link,
                    comment : rowData.comment
                };
                this.updataId = rowData._id;
                this.article_title = '编辑';
            },
            // 删除
            async deleteArticles(id){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let rsp = await this.$http(this.apiRoot + '/article/delete-article' , {
                        id
                    } , 'post');
                    if(rsp.ret == 0){
                        this.get_all_articles();
                        this.$message.success(rsp.data)
                    }else {
                        this.$message.err(rsp.error_msg);
                    }
                }).catch(() => {
                         
                })
            },
            // 预览
            previewArticles(link){
                this.previewWebContent = link;
                this.dialogFormVisible2 = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .myArticle{
        box-sizing: border-box;
        padding: 15px;
        >.el-button{
            margin-bottom: 10px;
        }


        .iframe{
            width: 100%;
        }
    }
</style>
