<template>
	<view class="detail">
		<view class="bgimg" :style="{ backgroundImage: 'url(' + songDetail.al.picUrl + ')' }"></view>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="detail-play" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" :class="{ 'detail-play-run': isplayrotate }"></image>
					<view class="play-icon">
						<u-icon :name="iconType" size="60" color="#FFF"></u-icon>
					</view>
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
							<u-icon name="play-circle" size="20" color="#999"></u-icon>
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
									<u-icon name="thumb-up" size="16" color="#999"></u-icon>
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
			currentId: '',
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
			iconType: "pause-circle"
		}
	},
	onLoad(options) {
		this.currentId = options.songId
		this.playMusic(options.songId);
	},
	onUnload() {
		this.cancelLyricIndex()
	},
	onShow() {
		this.listenLyricIndex()
	},
	onHide() {
		this.cancelLyricIndex()
	},
	methods: {
		playMusic(songId) {
			Promise.all([songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(
				songId)]).then((res) => {
					if (res[0].data.code == '200') {
						this.songDetail = res[0].data.songs[0];
						uni.setNavigationBarTitle({
							title: this.songDetail.name
						});
					}
					if (res[1].data.code == '200') {
						this.songSimi = res[1].data.songs;
					}
					if (res[2].data.code == '200') {
						this.songComment = res[2].data.hotComments;
					}
					if (res[3].data.code == '200') {
						let lyric = res[3].data.lrc.lyric;
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
					if (res[4].data.code == '200') {
						this.listenLyricIndex();
						this.bgAudioMannager = uni.getBackgroundAudioManager();
						this.bgAudioMannager.title = this.songDetail.name;
						this.bgAudioMannager.src = res[4].data.data[0].url;
						this.bgAudioMannager.onPlay(() => {
							this.listenLyricIndex();
							this.iconType = 'pause-circle';
							this.isplayrotate = true;
						});
						this.bgAudioMannager.onPause(() => {
							this.cancelLyricIndex();
							this.iconType = 'play-circle';
							this.isplayrotate = false;
						});
						this.bgAudioMannager.onEnded(() => {
							this.playMusic(this.currentId)
						});
						this.bgAudioMannager.onStop(() => {
							this.cancelLyricIndex();
							this.iconType = 'play-circle';
							this.isplayrotate = false;
						})
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
			this.currentId = songId
			this.playMusic(songId);
		}
	},
	onShareAppMessage() {
		return {
			title: `分享音乐：${this.songDetail.name}`,
			path: '/pages/detail/detail',
		}
	},
}
</script>

<style scoped>
.detail {
	background: rgba(0, 0, 0, 0.7);
}

.detail-play {
	width: 580rpx;
	height: 580rpx;
	background: url(~@/static/disc.png);
	background-size: cover;
	margin: 100rpx auto;
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

.play-icon {
	display: flex;
	justify-content: center;
	padding-top: 230rpx;
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
	margin: 100rpx 32rpx 0 32rpx;
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
	font-size: 16rpx;
}

.detail-comment-like {
	display: flex;
	align-items: center;
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
