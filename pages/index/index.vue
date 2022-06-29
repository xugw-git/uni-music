<template>
	<view class="index">
		<scroll-view scroll-y="true">
			<uni-search-bar placeholder="搜索歌曲" :radius="100" @confirm="search"></uni-search-bar>
			<view class="index-list">
				<view class="index-list-item" v-for="(item,index) in topList" :key="index">
					<view class="index-list-img">
						<image :src="item.coverImgUrl"></image>
						<text>{{item.updateFrequency}}</text>
					</view>
					<view class="index-list-text">
						<view v-for="(item,index) in item.tracks" :key="index">
							{{index+1}}.{{item.first}} - {{item.second}}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		topList
	} from '../../api/api.js'
	export default {
		data() {
			return {
				topList: []
			}
		},
		onLoad() {
			topList().then(res => {
				if (res.length) {
					setTimeout(() => {
						this.topList = res;
					}, 1000)
				}
			})
		},
		methods: {

		}
	}
</script>

<style>
	.index-list {
		margin: 0 30rpx;
	}

	.index-list-item {
		display: flex;
		margin-bottom: 34rpx;
	}

	.index-list-img {
		width: 212rpx;
		height: 212rpx;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: 22rpx;
	}

	.index-list-img image {
		width: 100%;
		height: 100%;
	}

	.index-list-img text {
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: white;
		font-size: 20rpx;

	}

	.index-list-text {
		font-size: 24rpx;
		line-height: 66rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
