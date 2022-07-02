<template>
	<view class="search">
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="search-search">
					<u-search placeholder="搜索歌曲" :showAction="false" v-model="searchWord" @search="handleToSearch"
						@change="handleToSuggest"></u-search>
				</view>
				<block v-if="searchType == 1">
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<u-icon name="trash" size="20" @tap="handleToClear"></u-icon>
						</view>
						<view class="search-history-list">
							<view v-for="(item, index) in historyList" :key="index" @tap="handleToWord(item)">{{ item }}
							</view>
						</view>
					</view>
					<view class="search-hot">
						<view class="search-hot-title">热搜榜</view>
						<view class="search-hot-item" v-for="(item, index) in searchHot" :key="index"
							@tap="handleToWord(item.searchWord)">
							<view class="search-hot-top">{{ index + 1 }}</view>
							<view class="search-hot-word">
								<view>
									{{ item.searchWord }} <image :src="item.iconType ? item.iconUrl : ''"
										mode="aspectFit"></image>
								</view>
								<view>{{ item.content }}</view>
							</view>
							<text class="search-hot-count">{{ item.score }}</text>
						</view>
					</view>
				</block>
				<block v-else-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item, index) in searchList" :key="index"
							@tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{ item.name }}</view>
								<view>{{ item.artists[0].name }} - {{ item.album.name }}</view>
							</view>
							<u-icon name="play-circle" size="30" color="#ccc"></u-icon>
						</view>
					</view>
				</block>
				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-title">搜索“{{ searchWord }}”</view>
						<view class="search-suggest-item" v-for="(item, index) in suggestList" :key="index"
							@tap="handleToWord(item.keyword)">
							<u-icon name="search" size="20"></u-icon>
							{{ item.keyword }}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { searchHot, searchWord, searchSuggest } from '../../api/api.js'
export default {
	data() {
		return {
			searchHot: [],
			searchWord: '',
			historyList: [],
			searchType: 1,
			searchList: [],
			suggestList: []
		}
	},
	onLoad() {
		searchHot().then((res) => {
			if (res[1].data.code == '200') {
				this.searchHot = res[1].data.data;
			}
		});
		uni.getStorage({
			key: 'searchHistory',
			success: (res) => {
				this.historyList = res.data;
			}
		});
	},
	methods: {
		handleToSearch() {
			if (this.searchWord) {
				this.historyList.unshift(this.searchWord);
				this.historyList = [...new Set(this.historyList)];
				if (this.historyList.length > 10) {
					this.historyList.length = 10;
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.historyList
				});
				this.getSearchList(this.searchWord);
			}
		},
		handleToClear() {
			uni.removeStorage({
				key: 'searchHistory',
				success: () => {
					this.historyList = [];
				}
			});
		},
		getSearchList(word) {
			searchWord(word).then((res) => {
				if (res[1].data.code == '200') {
					this.searchList = res[1].data.result.songs;
					this.searchType = 2;
				}
			});
		},
		handleToSuggest() {
			let value = this.searchWord;
			if (!value) {
				this.searchType = 1;
				return;
			}
			searchSuggest(value).then((res) => {
				if (res[1].data.code == '200') {
					this.suggestList = res[1].data.result.allMatch;
					this.searchType = 3;
				}
			});
		},
		handleToWord(word) {
			this.searchWord = word;
			this.handleToSearch();
		},
		handleToDetail(songId) {
			uni.navigateTo({
				url: '/pages/detail/detail?songId=' + songId
			});
		}
	}
}
</script>

<style scoped>
.search-search {
	margin: 30rpx;
}

.search-history {
	margin: 0 30rpx;
}

.search-history-head {
	font-size: 28rpx;
	display: flex;
	justify-content: space-between;
}

.search-history-list {
	font-size: 24rpx;
	display: flex;
	margin-top: 30rpx;
	flex-wrap: wrap;
}

.search-history-list view {
	padding: 15rpx 30rpx;
	background: #f7f7f7;
	border-radius: 50rpx;
	margin-right: 30rpx;
	margin-bottom: 20rpx;
}

.search-hot {
	margin: 30rpx 30rpx;
	font-size: 28rpx;
	color: #bebebe;
}

.search-hot-title {
	color: #000;
}

.search-hot-item {
	display: flex;
	align-items: center;
	margin-top: 40rpx;
}

.search-hot-top {
	width: 60rpx;
	color: #666;
	font-size: 32rpx;
}

.search-hot-word {
	flex: 1;
}

.search-hot-word view:nth-child(1) {
	font-size: 32rpx;
	color: #000;
}

.search-hot-word view:nth-child(2) {
	font-size: 24rpx;
	color: #999;
}

.search-hot-word image {
	width: 48rpx;
	height: 22rpx;
}

.search-hot-count {
	font-size: 24rpx;
}

.search-result {
	border-top: 2rpx #e5e5e5 solid;
	padding: 30rpx;
}

.search-result-item {
	display: flex;
	align-items: center;
	border-bottom: 2rpx #e5e5e5 solid;
	padding-bottom: 30rpx;
	margin-bottom: 30rpx;
}

.search-result-word {
	flex: 1;
}

.search-result-word view:nth-child(1) {
	font-size: 28rpx;
	color: #3e6694;
}

.search-result-word view:nth-child(2) {
	font-size: 24rpx;
	color: #999;
}

.search-suggest {
	border-top: 2rpx #e5e5e5 solid;
	padding: 30rpx;
	font-size: 28rpx;
}

.search-suggest-title {
	color: #537caa;
	margin-bottom: 40rpx;
}

.search-suggest-item {
	color: #666666;
	margin-bottom: 70rpx;
	display: flex
}
</style>