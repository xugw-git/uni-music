<template>
	<view class="list">
		<view class="bgimg" :style="{ 'background-image': 'url(' + playlist.coverImgUrl + ')' }"></view>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playlist.coverImgUrl"></image>
						<text>{{ Math.floor(playlist.playCount / 10000000) / 10 }}亿</text>
					</view>
					<view class="list-head-text">
						<view>{{ playlist.name }}</view>
						<view>
							<image :src="playlist.creator.avatarUrl"></image>
							<text>{{ playlist.creator.nickname }}</text>
						</view>
						<view>{{ playlist.description }}</view>
					</view>
				</view>
				<button class="list-share" open-type="share">
					<uni-icons type="redo" size="20" color="white"> </uni-icons>
					分享给微信好友
				</button>
				<view class="list-music">
					<view class="list-music-title">
						<uni-icons type="list" size="20" color="#999"></uni-icons>
						<text>播放全部</text>
						<text>(共{{ playlist.trackCount }}首)</text>
					</view>
					<view class="list-music-item" v-for="(item, index) in playlist.tracks" :key="item.id"
						@tap="tapToDetail(item.id)">
						<view class="list-music-top">{{ index + 1 }}</view>
						<view class="list-music-song">
							<view>{{ item.name }}</view>
							<view>
								<image v-if="privileges[index].maxbr == 999000" src="../../static/sq.png" mode="">
								</image>
								{{ item.ar[0].name }} - {{ item.name }}
							</view>
						</view>
						<uni-icons type="headphones" size="20" color="#999"></uni-icons>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { list } from '../../api/api.js'
export default {
	data() {
		return {
			playlist: {
				coverImgUrl: '',
				trackCount: '',
				creator: '',
			},
			privileges: []
		}
	},
	onLoad(options) {
		uni.showLoading({
			title: '加载中...'
		})
		let listId = options.listId;
		list(listId).then((res) => {
			if (res[1].data.code == '200') {
				this.playlist = res[1].data.playlist;
				this.privileges = res[1].data.privileges;
				uni.hideLoading();
			}
		});
	},
	methods: {
		tapToDetail(id) {
			uni.navigateTo({
				url: '/pages/detail/detail?songId=' + id
			});
		}
	}
}
</script>

<style scoped>
.list-head {
	display: flex;
	margin: 30rpx;
}

.list-head-img {
	width: 265rpx;
	height: 265rpx;
	border-radius: 15rpx;
	margin-right: 40rpx;
	overflow: hidden;
	position: relative;
}

.list-head-img image {
	width: 100%;
	height: 100%;
}

.list-head-img text {
	position: absolute;
	font-size: 26rpx;
	color: white;
	right: 8rpx;
	top: 8rpx;
}

.list-head-text {
	flex: 1;
	font-size: 24rpx;
	color: #e1e2e3;
}

.list-head-text image {
	width: 52rpx;
	height: 52rpx;
	border-radius: 50%;
}

.list-head-text view:nth-child(1) {
	font-size: 34rpx;
	color: #ffffff;
}

.list-head-text view:nth-child(2) {
	display: flex;
	align-items: center;
	margin: 30rpx 0;
}

.list-head-text view:nth-child(2) text {
	margin-left: 15rpx;
}

.list-head-text view:nth-child(3) {
	line-height: 38rpx;
}

.list-share {
	display: flex;
	width: 330rpx;
	height: 72rpx;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	background: rgba(0, 0, 0, 0.2);
	font-size: 26rpx;
	color: white;
	border-radius: 36rpx;
}

.list-share text {
	margin-right: 15rpx;
}

.list-music {
	background: white;
	border-radius: 50rpx;
	overflow: hidden;
	margin-top: 45rpx;
}

.list-music-title {
	height: 58rpx;
	line-height: 58rpx;
	margin: 30rpx 30rpx 70rpx 30rpx;
}

.list-music-title text:nth-child(1) {
	font-size: 58rpx;
}

.list-music-title text:nth-child(2) {
	font-size: 34rpx;
	margin: 0 10rpx 0 25rpx;
}

.list-music-title text:nth-child(3) {
	font-size: 28rpx;
	color: #b2b2b2;
}

.list-music-item {
	display: flex;
	margin: 0 30rpx 70rpx 44rpx;
	align-items: center;
}

.list-music-top {
	width: 56rpx;
	font-size: 28rpx;
	color: #979797;
}

.list-music-song {
	flex: 1;
	line-height: 40rpx;
}

.list-music-song view:nth-child(1) {
	font-size: 30rpx;
	width: 70vw;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.list-music-song view:nth-child(2) {
	font-size: 22rpx;
	color: #a2a2a2;
	width: 70vw;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.list-music-song image {
	width: 34rpx;
	height: 22rpx;
	margin-right: 10rpx;
}

.list-music-item text {
	font-size: 50rpx;
	color: #c8c8c8;
}
</style>
