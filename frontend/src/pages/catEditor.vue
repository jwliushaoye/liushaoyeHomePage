<template>
    <div class="myEditor">
        <p class="btn_group">
            <el-button type="primary" plain size="small" @click="concat_paragraph">合并</el-button>
            <el-button type="primary" plain size="small" @click="split_paragraph">拆分</el-button>

            <el-button type="primary" plain size="small" @click="move_up">上移</el-button>
            <el-button type="primary" plain size="small" @click="move_down">下移</el-button>
        </p>


        <table class="edit_table" cellspacing="0" cellpadding="0">
            <tbody class="edit_body">
                <tr
                    v-for="(val,index) in data_list"
                    :key="index"
                    :class="sel_table.indexOf('a+'+index) != -1 ? 'active_tr' : ''"
                >
                    <!-- 索引 -->
                    <td 
                        :class="sel_table.indexOf('l+'+index) != -1 || sel_table.indexOf('r+'+index) != -1 ? 'active_one_td column_one' : 'column_one'" 
                        @click="!$event.ctrlKey && sel_one(index,'a')"
                        @click.ctrl = "sel_more(index,'a')"
                    > 
                        {{ index + 1 }}
                    </td>
                    <!-- 原文 -->
                    <td 
                        :id = "edit_index == 'l+'+index ? 'active_td_border' : ''"
                        :class="sel_table.indexOf('l+'+index) != -1 ? 'active_td column_two' : 'column_two'"
                        @click="!$event.ctrlKey && $event.type == 'click' && sel_one(index,'l')"
                        @click.ctrl = "sel_more(index,'l')"
                        @dblclick="edit_one(index,'l')"
                    >
                        <!-- <div :contenteditable="edit_index == 'l+'+index" :ref="'ori'+index">{{ val.ori }}</div> -->
                        <div v-if="edit_index != 'l+'+index">
                            {{ val.ori }}
                        </div>
                        <textarea v-if="edit_index == 'l+'+index" autoHeight="true" :ref="'ori'+index">{{ val.ori }}</textarea>
                    </td>
                    <!-- 译文 -->
                    <td 
                        :id = "edit_index == 'r+'+index ? 'active_td_border' : ''"
                        :class="sel_table.indexOf('r+'+index) != -1 ? 'active_td column_three' : 'column_three'"
                        @click="!$event.ctrlKey && sel_one(index,'r')"
                        @click.ctrl = "sel_more(index,'r')"
                        @dblclick="edit_one(index,'r')"
                    >
                        <div v-if="edit_index != 'r+'+index">
                            {{ val.lan }}
                        </div>
                        <textarea v-if="edit_index == 'r+'+index" autoHeight="true" :ref="'lan'+index">{{ val.lan }}</textarea>
                    </td>
                </tr>
            <tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name : 'myEditor',
        data (){
            return {
                data_list : [
                    {
                        ori : '“盗贼，可是一份很有前途的职业！”',
                        lan : "“Trust me, thieving is a promising career!”"
                    },
                    {
                        ori : '菲尼克相信，任何职业都有其存在的理由和价值，所以哪怕是做盗贼，也要做到足够的专业和敬业。在这份信念的支持下，菲尼克的工作取得举世瞩目的业绩，诸如“圣光城金库大劫案”、“炼金堡秘宝失窃案”，都是他的“伟大杰作”。',
                        lan : "Fennik believed that all professions had their values and reasons for existing. Which was why he stood by the belief that, since he was a thief, he should be the best of them all. Go big or go home, right? This was how Fennik became renowned in the field—his “masterpieces” included the Great Heist of the Luxis City Treasury and the Theft of the Secret Treasures of Fort Alchemy."
                    },
                    {
                        ori : '贼不走空，是菲尼克一直奉行的工作原则。大到对金库的劫掠，小到在街头扒人口袋，菲尼克从未有过失手的记录。当然，如果遇到非常贫困的作案目标，那么菲尼克不但会在事后偷偷还回失窃的财物，同时还会加上一笔额外的财物，帮助他们度过眼前的难关。',
                        lan : 'w Fennik became renowned in the field—his “masterpieces” included the Great Heist of the Luxis City Treasury and the Theft of the Secret Treasures of Fort Alchemy.'
                    },
                    {
                        ori : '“盗亦有道？当然不是了。猪，总得养肥了再杀啊！”在菲尼克制定的职业操守中，不把作案目标逼上绝路只是第二条，给予贫困目标一定的帮助、维持盗贼职业的可持续发展，才是首要任务。菲尼克认为，只有人们的物质生活水平不断提高，才能让盗贼们获得更广阔的发展空间。一味掠夺财富，且积财不用，只会加剧同行的竞争压力：“想想看，等到咱们的钱攒得比谁都多的时候，就只能瞅着彼此下手了！”',
                        lan : 'It was one of Fennik’s principles to never leave empty-handed. He was not one to fail, whether when robbing a bank or simply picking some pockets on the street. Of course, if it turned out that his unfortunate target was dirt-poor, he would not only return what he had stolen afterwards but also add a little something to go with it, which was quite a pleasant surprise for the victim.'
                    },{
                        ori : 1,
                        lan : 1
                    },{
                        ori : 2,
                        lan : 2
                    },{
                        ori : 3,
                        lan : 3
                    },{
                        ori : 4,
                        lan : 4
                    },{
                        ori : 5,
                        lan : 5
                    },{
                        ori : 6,
                        lan : 6
                    },{
                        ori : 7,
                        lan : 7
                    },{
                        ori : 8,
                        lan : 8
                    },{
                        ori : 9,
                        lan : 9
                    }
                ],
                sel_table : [],
                edit_index : ''
            }
        },
        methods : {
            // 选择一个
            sel_one(index,type){
                this.sel_table = [type+'+'+index];
                if(this.sel_table[0] != this.edit_index){
                    this.edit_index = '';
                }
            },
            //选择多个
            sel_more(index,type){
                // 首先判断有没有其他已选中的
                let is_other = this.judge_sel(type);
                if(is_other){
                    this.sel_table = [type+'+'+index];
                }else {
                    this.sel_table.push(type+'+'+index);
                    // 范围选中
                    this.sel_range(index,type+'+')
                }
            },
            // 判断是否有选中了其他类型的行
            judge_sel(flag){
                var is_sel = false;
                this.sel_table.forEach(item => {
                    let _flag = item.split('+')[0];
                    if(_flag != flag){
                        is_sel = true;
                        return;
                    }
                });
                return is_sel;
            },
            // 范围选择 ctrl + click
            sel_range(ind,type){
                let first_ind = this.sel_table[0].split('+')[1];
                this.sel_table = [];
                // 0 ~ 4
                if(first_ind - ind > 0){
                    for(let i = ind ; i <= first_ind ; i++){
                        this.sel_table.push(type + i)
                    };
                }else {
                    for(let i = parseInt(first_ind); i <= ind ; ++i){
                        this.sel_table.push(type + i);
                    }
                }
            },

            // 双击
            edit_one(index,type){
                this.edit_index = type+'+'+index;
                if(type == 'l'){
                    setTimeout(()=> {
                        let data = this.$refs['ori'+index];
                        this.makeExpandingArea(data[0])
                    },0)
                }else {
                    setTimeout(()=> {
                        let data = this.$refs['lan'+index];
                        this.makeExpandingArea(data[0])
                    },0)
                }
            },
            //点击拆分
            split_paragraph(){
                let [type , index] = [this.edit_index.split('+')[0] , this.edit_index.split('+')[1]];
                if(type == 'l'){
                    this.deal_split('ori' , index);
                }else if(type == 'r'){
                    this.deal_split('lan' , index);
                }else {
                    this.$message.error('请再编辑状态下拆分单元格!')
                };
            },
            // 处理拆分的逻辑
            deal_split(types , index){
                let data = this.$refs[types+index];
                let split_data = data[0].value.split('\n').filter(item => {return item != ''});

                if(split_data.length == 1) {
                        split_data.push('')
                };

                let temp_arr = []
                for(let i = 0 , len = this.data_list.length + split_data.length - 1 ; i < len ; i++) {
                    if(i < index){
                        temp_arr.push(this.data_list[i])
                    }else if(i >= index && i < parseInt(index) + split_data.length){
                        let ori = types == 'ori' ? split_data[i - index] : this.data_list[i] ? this.data_list[i].ori : '';
                        let lan = types == 'ori' ? this.data_list[i] ? this.data_list[i].lan : '' : split_data[i - index]
                        temp_arr.push({ori , lan});
                    }else if(i >= parseInt(index) + split_data.length){
                        let ori = types == 'ori' 
                            ? 
                                this.data_list[i - split_data.length + 1] ? this.data_list[i - split_data.length + 1].ori : '' 
                            : 
                                this.data_list[i] ? this.data_list[i].ori : '';
                        let lan = types == 'ori' 
                            ? 
                                this.data_list[i] ? this.data_list[i].lan : ''
                            : 
                                this.data_list[i - split_data.length + 1] ? this.data_list[i - split_data.length + 1].lan : '' 
                        temp_arr.push({ori , lan});
                    }
                }
                this.data_list = temp_arr.filter(item => {return item.ori != '' || item.lan != ''});
                this.edit_index = '';
            },

            // 点击合并
            concat_paragraph(){
                if(this.sel_table.length < 2) {
                    this.$message.error('请选择需要合并的单元格或行！')
                }else {
                    let concat_type = this.sel_table[0].split('+')[0];
                    if(concat_type == 'l'){
                        // 选中原文
                       this.deal_concat('ori');
                    }else if(concat_type == 'r'){
                        // 选中译文
                       this.deal_concat('lan');

                    }else {
                        // 选中整个一条
                        let concat_obj = {ori : '' , lan : ''}
                        this.sel_table.forEach(item => {
                            let index = item.split('+')[1];
                            concat_obj.ori += this.data_list[index].ori;
                            concat_obj.lan += this.data_list[index].lan
                        });
                        this.data_list.splice(this.sel_table[0].split('+')[1] , this.sel_table.length , concat_obj);
                    };
                    this.sel_table =  [this.sel_table[0]]
                }
            },
            // 处理合并
            deal_concat(type){
                let [min, concat_str] = [this.sel_table[0].split('+')[1], ''];
                    this.sel_table.forEach(item => {
                        let index = item.split('+')[1];
                        concat_str += this.data_list[index][type];
                    });
                    this.data_list = this.data_list.map((item , index) => {
                        if(index < min){
                            return item;
                        }else if (index == min){
                            let temp_obj = {ori : '' , lan : ''};
                            temp_obj.ori = type == 'ori' ? concat_str : item.ori ;
                            temp_obj.lan = type == 'ori' ? item.lan : concat_str ;
                            return temp_obj;
                        }else {
                            let temp_obj = {ori : '' , lan : ''};
                            temp_obj.ori = type == 'ori' 
                                ? 
                                    this.data_list[index + this.sel_table.length - 1] ? this.data_list[index + this.sel_table.length - 1].ori : '' 
                                :
                                    item.ori;
                            temp_obj.lan = type == 'ori' 
                                ? 
                                    item.lan 
                                : 
                                    this.data_list[index + this.sel_table.length - 1] ? this.data_list[index + this.sel_table.length - 1].lan : '' ;
                            return temp_obj;
                        }
                    }).filter(item => { return item.ori != '' || item.lan != '' });
            },
            //高度自适应
            makeExpandingArea(el){
                var setStyle = function(el) {  
                    el.style.height = 'auto';  
                    el.style.height = el.scrollHeight + 'px';  
                } 
                var delayedResize = function(el) {  
                    window.setTimeout(function() {  
                        setStyle(el)  
                    },0);  
                }
                if (el.addEventListener) {  
                    el.addEventListener('input', function() {  
                        setStyle(el)  
                    }, false);  
                    setStyle(el)  
                } else if (el.attachEvent) {  
                    el.attachEvent('onpropertychange', function() {  
                        setStyle(el)  
                    });  
                    setStyle(el)  
                }  
                if (window.VBArray && window.addEventListener) { //IE9  
                    el.attachEvent("onkeydown", function() {  
                        var key = window.event.keyCode;  
                        if (key == 8 || key == 46) delayedResize(el);  

                    });  
                    el.attachEvent("oncut", function() {  
                        delayedResize(el);  
                    }); //处理粘贴  
                }   
            },

            //上移
            move_up(){
                if(this.sel_table.length){
                    let first_ind = parseInt(this.sel_table[0].split('+')[1]);
                    let that = this;
                    const init_data = function(){
                        that.sel_table = that.sel_table.map(item => {
                            return item.split('+')[0] + '+' + (parseInt(item.split('+')[1]) -1)
                        })
                    };
                    if(first_ind == 0){
                        this.$message.error('当前行已经是第一行!');
                    }else {
                        let move_type = this.sel_table[0].split('+')[0];
                        if(move_type == 'l'){
                            // 原文
                            let replace_data = {
                                ori : this.data_list[first_ind - 1].ori,
                                lan : this.data_list[first_ind - 1 + this.sel_table.length].lan
                            };
                            this.sel_table.forEach((item , index) => {
                                this.data_list.splice(first_ind - 1 + index , 1 , {
                                    ori : this.data_list[item.split('+')[1]].ori ,
                                    lan : this.data_list[first_ind - 1 + index].lan
                                });
                            })
                            this.data_list.splice(first_ind + this.sel_table.length - 1  , 1 , replace_data);
                            init_data();
                        }else if(move_type == 'r'){
                            // 译文
                             let replace_data = {
                                ori : this.data_list[first_ind - 1 + this.sel_table.length].ori,
                                lan : this.data_list[first_ind - 1].lan
                            };
                            this.sel_table.forEach((item , index) => {
                                this.data_list.splice(first_ind - 1 + index , 1 , {
                                    ori : this.data_list[first_ind - 1 + index].ori ,
                                    lan : this.data_list[item.split('+')[1]].lan
                                });
                            })
                            this.data_list.splice(first_ind + this.sel_table.length - 1  , 1 , replace_data);
                            init_data();
                        }else {
                            // 整行 
                            let replace_data = this.data_list[first_ind - 1];
                            this.sel_table.forEach((item , index) => {
                                this.data_list.splice(first_ind - 1 + index , 1 , this.data_list[item.split('+')[1]]);
                            })
                            this.data_list.splice(first_ind + this.sel_table.length - 1  , 1 , replace_data);
                            init_data();
                        }
                    }
                }else {
                    this.$message.error('请选择需要下移的单元格或行！');
                }
            },
            //下移
            move_down(){
                if(this.sel_table.length){
                    let last_ind = parseInt(this.sel_table[this.sel_table.length - 1].split('+')[1]);
                    let that = this;
                    const init_data = function(){
                        that.sel_table = that.sel_table.map(item => {
                            return item.split('+')[0] + '+' + (parseInt(item.split('+')[1]) + 1)
                        })
                    };
                    // 最后一行 无法上移
                    if(last_ind == this.data_list.length - 1){
                         this.$message.error('当前行已经是第一行!');
                    }else {
                        let move_type = this.sel_table[0].split('+')[0];
                        // 判断类型
                        if(move_type == 'l'){
                            // 原文
                            let replace_data = {
                                ori : this.data_list[last_ind + 1].ori,
                                lan : this.data_list[this.sel_table[0].split('+')[1]].lan
                            };
                            // 替换
                            for(let ind = this.sel_table.length - 1 ; ind >= 0 ; ind--){
                                this.data_list.splice(last_ind + ind - this.sel_table.length + 2 , 1 , {
                                    ori : this.data_list[last_ind + ind - this.sel_table.length + 1].ori,
                                    lan : this.data_list[last_ind + ind - this.sel_table.length + 2].lan
                                })
                            };
                            this.data_list.splice(last_ind - this.sel_table.length + 1  , 1 , replace_data);
                            init_data();
                        }else if(move_type == 'r'){
                            // 译文
                            let replace_data = {
                                ori : this.data_list[this.sel_table[0].split('+')[1]].ori,
                                lan : this.data_list[last_ind + 1].lan
                            };
                            // 替换
                            for(let ind = this.sel_table.length - 1 ; ind >= 0 ; ind--){
                                this.data_list.splice(last_ind + ind - this.sel_table.length + 2 , 1 , {
                                    ori : this.data_list[last_ind + ind - this.sel_table.length + 2].ori,
                                    lan : this.data_list[last_ind + ind - this.sel_table.length + 1].lan
                                })
                            };
                            this.data_list.splice(last_ind - this.sel_table.length + 1  , 1 , replace_data);
                            init_data();
                        }else {
                            // 整行 : 首先记录要换的那一行
                            let replace_data = this.data_list[last_ind + 1];
                            for(let ind = this.sel_table.length - 1 ; ind >= 0 ; ind--){
                                this.data_list.splice(last_ind + ind - this.sel_table.length + 2 , 1 , this.data_list[this.sel_table[ind].split('+')[1]])
                            }
                            this.data_list.splice(last_ind - this.sel_table.length + 1  , 1 , replace_data);
                            init_data();
                        }
                    }
                }else {
                    this.$message.error('请选择需要下移的单元格或行！')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .myEditor{
        padding: 15px;
        box-sizing: border-box;
        .btn_group{
            margin-bottom: 15px;
        }
        .edit_table{
            width: 100%;
            border: 1px solid #dcdcdc;
            .column_one , .column_two , .column_three{
                border: 1px solid #dcdcdc;
                padding: 3px;
                line-height: 20px;
                min-height: 20px;
                textarea{
                    background:#a6d9ee;
                    display: block;
                    width : 100%;
                    min-height: 30px;
                    resize: none;
                    padding : 0;
                    outline: 0;
                    line-height: 20px;
                    border: none;
                    font-family: inherit;
                    word-wrap: break-word;
                    white-space: pre-wrap;
                }
            }
            .column_one{
                width: 50px;
                text-align: center;
            }

            .column_two , .column_three{
                width: calc((100% - 50px) / 2);
                overflow: hidden;
            
            }

            #active_td_border{
                border : 1px solid royalblue;
            }

            .active_tr{
                background:#a6d9ee;
            }
            .active_one_td {
                background: #eee;
            }
            .active_td {
                background:#a6d9ee;
            }

        }
    }
</style>
