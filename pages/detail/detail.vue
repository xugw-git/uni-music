<template>
	<view class="detail">
		<view class="bgimg" :style="{ backgroundImage: 'url(' + songDetail.al.picUrl + ')' }"></view>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="detail-play" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" :class="{ 'detail-play-run': isplayrotate }"></image>
					<uni-icons :type="iconType" size="60" color="#FFF"></uni-icons>
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-wrap"
						:style="{ transform: 'translateY(' + - (lyricIndex - 1) * 82 + 'rpx)' }">
						<view class="detail-lyric-item" :class="{ active: lyricIndex == index }"
							v-for="(item, index) in songLyric" :key="index">{{ item.lyric }}</view>
					</view>
				</view>
				<view class="detail-like">
					<view class="detail-like-title">喜欢这首歌的人也听</view>
					<view class="detail-like-list">
						<view class="detail-like-item" v-for="(item, index) in songSimi" :key="index"
							@tap="handleToSimi(item.id)">
							<view class="detail-like-img">
								<image :src="item.album.picUrl"></image>
							</view>
							<view class="detail-like-song">
								<view>{{ item.name }}</view>
								<view>
									<image v-if="item.privilege.maxbr == 999000" src="../../static/sq.png"></image>
									{{ item.artists[0].name }} - {{ item.name }}
								</view>
							</view>
							<uni-icons type="headphones" size="20" color="#999"></uni-icons>
						</view>
					</view>
				</view>
				<view class="detail-comment">
					<view class="detail-comment-title">精彩评论</view>
					<view class="detail-comment-item" v-for="(item, index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-head">
								<view class="detail-comment-name">
									<view>{{ item.user.nickname }}</view>
									<view>{{ item.time | formatTime }}</view>
								</view>
								<view class="detail-comment-like">
									{{ item.likedCount }}
									<uni-icons type="headphones" size="16" color="#999"></uni-icons>
								</view>
							</view>
							<view class="detail-comment-text">
								{{ item.content }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { songDetail, songUrl, songLyric, songSimi, songComment } from '../../api/api.js';
export default {
	data() {
		return {
			songDetail: {
				al: {
					picUrl: ''
				}
			},
			songSimi: [],
			songComment: [],
			songLyric: [],
			lyricIndex: 0,
			isplayrotate: true,
			iconType: "headphones"
		}
	},
	onLoad(options) {
		this.playMusic(options.songId);
	},
	onUnload() {
		this.cancelLyricIndex();
		// #ifdef H5
		this.bgAudioMannager.destroy();
		// #endif
	},
	onHide() {
		this.cancelLyricIndex();
		// #ifdef H5
		this.bgAudioMannager.destroy();
		// #endif
	},
	onReady() {
		uni.setNavigationBarTitle({
			title: '新的标题'
		});
	},
	methods: {
		playMusic(songId) {
			Promise.all([songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(
				songId)]).then((res) => {
					if (res[0][1].data.code == '200') {
						this.songDetail = res[0][1].data.songs[0];
					}
					if (res[1][1].data.code == '200') {
						this.songSimi = res[1][1].data.songs;
					}
					if (res[2][1].data.code == '200') {
						this.songComment = res[2][1].data.hotComments;
					}
					if (res[3][1].data.code == '200') {
						let lyric = res[3][1].data.lrc.lyric;
						let result = [];
						let re = /\[([^\]]+)\]([^[]+)/g;
						lyric.replace(re, ($0, $1, $2) => {
							result.push({
								time: this.formatTimeToSec($1),
								lyric: $2
							});
						});
						this.songLyric = result;
					}
					if (res[4][1].data.code == '200') {
						this.bgAudioMannager = uni.getBackgroundAudioManager();
						this.bgAudioMannager.title = this.songDetail.name;
						this.bgAudioMannager.src = res[4][1].data.data[0].url;
						this.listenLyricIndex();
						this.bgAudioMannager.onPlay(() => {
							this.iconType = 'headphones';
							this.isplayrotate = true;
							this.listenLyricIndex();
						});
						this.bgAudioMannager.onPause(() => {
							this.iconType = 'locked';
							this.isplayrotate = false;
							this.cancelLyricIndex();
						});
						this.bgAudioMannager.onEnded(() => {
						});
					}
				});
		},
		formatTimeToSec(time) {
			var arr = time.split(':');
			return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
		},
		handleToPlay() {
			if (this.bgAudioMannager.paused) {
				this.bgAudioMannager.play();
			} else {
				this.bgAudioMannager.pause();
			}
		},
		listenLyricIndex() {
			clearInterval(this.timer);
			this.timer = setInterval(() => {
				for (var i = 0; i < this.songLyric.length; i++) {
					if (this.songLyric[this.songLyric.length - 1].time < this.bgAudioMannager.currentTime) {
						this.lyricIndex = this.songLyric.length - 1;
						break;
					}
					if (this.songLyric[i].time < this.bgAudioMannager.currentTime && this.songLyric[i + 1]
						.time > this.bgAudioMannager.currentTime) {
						this.lyricIndex = i;
					}
				}
			});
		},
		cancelLyricIndex() {
			clearInterval(this.timer);
		},
		handleToSimi(songId) {
			this.playMusic(songId);
		}
	}
}
</script>

<style scoped>
.detail {
	background: rgba(0, 0, 0, 0.5);
}

.detail-play {
	width: 580rpx;
	height: 580rpx;
	background: url(~@/static/disc.png);
	background-size: cover;
	margin: 210rpx auto 44rpx auto;
	position: relative;
}

.detail-play image {
	width: 380rpx;
	height: 380rpx;
	border-radius: 50%;
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	margin: auto;
	animation: 10s linear infinite move;
	animation-play-state: paused;
}

@keyframes move {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

.detail-play .detail-play-run {
	animation-play-state: running;
}

.detail-play uni-icons {
	width: 100rpx;
	height: 100rpx;
	font-size: 100rpx;
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	margin: auto;
}

.detail-lyric {
	height: 246rpx;
	line-height: 82rpx;
	font-size: 32rpx;
	text-align: center;
	color: #949495;
	overflow: hidden;
}

.active {
	color: white;
}

.detail-lyric-wrap {
	transition: .5s;
}

.detail-lyric-item {
	height: 82rpx;
}

.detail-like {
	margin: 0 32rpx;
}

.detail-like-title {
	font-size: 36rpx;
	color: white;
	margin: 50rpx 0;
}

.detail-like-item {
	display: flex;
	margin-bottom: 38rpx;
	align-items: center;
}

.detail-like-img {
	width: 82rpx;
	height: 82rpx;
	border-radius: 15rpx;
	overflow: hidden;
	margin-right: 20rpx;
}

.detail-like-img image {
	width: 100%;
	height: 100%;
}

.detail-like-song {
	flex: 1;
}

.detail-like-song view:nth-child(1) {
	color: white;
	font-size: 30rpx;
	width: 70vw;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-bottom: 10rpx;
}

.detail-like-song view:nth-child(2) {
	font-size: 22rpx;
	color: #a2a2a2;
	width: 70vw;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.detail-like-song image {
	width: 34rpx;
	height: 22rpx;
	margin-right: 10rpx;
}

.detail-like-item text {
	font-size: 50rpx;
	color: #877764;
}

.detail-comment {
	margin: 0 32rpx;
}

.detail-comment-title {
	font-size: 36rpx;
	color: white;
	margin: 50rpx 0;
}

.detail-comment-item {
	display: flex;
	margin-bottom: 28rpx;
}

.detail-comment-img {
	width: 66rpx;
	height: 66rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 18rpx;
}

.detail-comment-img image {
	width: 100%;
	height: 100%
}

.detail-comment-content {
	flex: 1;
	color: #cac9cd;
}

.detail-comment-head {
	display: flex;
	justify-content: space-between;
}

.detail-comment-name view:nth-child(1) {
	font-size: 24rpx;
}

.detail-comment-name view:nth-child(2) {
	font-size: 20rpx;
}

.detail-comment-like {
	font-size: 24rpx;
}

.detail-comment-text {
	line-height: 40rpx;
	color: white;
	font-size: 28rpx;
	margin-top: 16rpx;
	border-bottom: 1px #595860 solid;
	padding-bottom: 40rpx;
}
</style>
