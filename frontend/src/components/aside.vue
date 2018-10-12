<template>
	<div class="app-aside" :style="show_aside ? {width : '220px'} : ''">
		<el-menu
			class="el-menu-vertical-demo"
			router
			background-color="#304156"
			text-color="#cfcbd9"
			active-text-color = "#409eff"
			:default-active="$route.path"
			:collapse="!show_aside"
			style="height: 100%">

			<el-menu-item index="/home">
				<i class="fa fa-home"></i>
				<!-- 首页 -->
				<span slot="title">{{ $t('asideModuleHomePage') }}</span>
			</el-menu-item>
			<!-- 地图 -->
			<el-menu-item index="/map">
				<i class="fa fa-map-marker"></i>
				<span slot="title">{{ $t('asideModuleMap') }}</span>
			</el-menu-item>
			<!-- 地图 -->
			<el-menu-item index="/my-article">
				<i class="fa fa-list"></i>
				<span slot="title">{{ $t('adideModuleArticles') }}</span>
			</el-menu-item>
			<!-- 语料编辑 -->
			<el-menu-item index="/editor">
				<i class="fa fa-edit"></i>
				<span slot="title">{{ $t('asideModuleCorpus') }}</span>
			</el-menu-item>
			<!-- 语料上传 -->
			<el-menu-item index="/upload">
				<i class="fa fa-edit"></i>
				<span slot="title">{{ $t('asideModuleUploadCorpus') }}</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
	export default {
		name : 'myAside',
		computed : {
            show_aside(){
                return this.$store.state.isCollapse;
            }
        },
	}
</script>

<style scoped lang="scss">
	.app-aside {
		height: 100%;
		.fa{
			font-size: 18px;
			margin-right: 5px;
		}
	}
</style>
