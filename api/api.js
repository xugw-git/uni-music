// const baseUrl="http://localhost:3000/"
const baseUrl = "https://www.codeman.ink/api/"

/**
 * 歌曲榜单
 */

export async function topList() {
	// 只需要前四个榜单
	const listIds = ['3', '0', '2', '1'];
	try {
		let res = await wx.cloud.callContainer({
			"config": {
				"env": "prod-9glkq86u6ab52840"
			},
			"path": "/toplist/detail",
			"header": {
				"X-WX-SERVICE": "music-api"
			},
			"method": "GET"
		})
		let result = res.data.list;
		result.length = 4;
		for (let i = 0; i < result.length; i++) {
			result[i].listId = listIds[i];
		}
		return result
	}
	catch (err) {
		console.log(err);
	}
}

// export function topList() {
// 	// 只需要前四个榜单
// 	var listIds = ['3', '0', '2', '1'];
// 	return new Promise(function(resolve, reject) {
// 		uni.request({
// 			url: `${baseUrl}toplist/detail`,
// 			method: 'GET',
// 			data: {},
// 			success: res => {
// 				let result = res.data.list;
// 				result.length = 4;
// 				for (let i = 0; i < result.length; i++) {
// 					result[i].listId = listIds[i];
// 				}
// 				resolve(result);
// 			},
// 			fail: (err) => {
// 				console.log(err);
// 			},
// 			complete: () => {}
// 		});
// 	});
// }

/**
 * 根据首页歌曲模块获取具体歌单
 * @param {列表id} listId
 */
export async function list(listId) {
	try {
		let res = await wx.cloud.callContainer({
			"config": {
				"env": "prod-9glkq86u6ab52840"
			},
			"path": `/playlist/detail?id=${listId}`,
			"header": {
				"X-WX-SERVICE": "music-api"
			},
			"method": "GET"
		})
		return res
	}
	catch (err) {
		console.log(err);
	}
}

// export function list(listId) {
// 	return uni.request({
// 		url: `${baseUrl}playlist/detail?id=${listId}`,
// 		method: 'GET'
// 	});
// }

/**
 * 歌曲详情接口
 * @param {歌曲id} id
 */
export async function songDetail(id) {
	try {
		let res = await wx.cloud.callContainer({
			"config": {
				"env": "prod-9glkq86u6ab52840"
			},
			"path": `/song/detail?ids=${id}`,
			"header": {
				"X-WX-SERVICE": "music-api"
			},
			"method": "GET"
		})
		return res
	}
	catch (err) {
		console.log(err);
	}
}

// export function songDetail(id) {
// 	return uni.request({
// 		url: `${baseUrl}song/detail?ids=${id}`,
// 		method: 'GET'
// 	})
// }

/**
 * 播放歌曲接口
 * @param {Object} id
 */
export async function songUrl(id) {
	try {
		let res = await wx.cloud.callContainer({
			"config": {
				"env": "prod-9glkq86u6ab52840"
			},
			"path": `/song/url?id=${id}`,
			"header": {
				"X-WX-SERVICE": "music-api"
			},
			"method": "GET"
		})
		return res
	}
	catch (err) {
		console.log(err);
	}
}

// export function songUrl(id) {
// 	return uni.request({
// 		url: `${baseUrl}song/url?id=${id}`,
// 		method: 'GET'
// 	})
// }

/**
 * 歌词接口
 * @param {Object} id
 */
export async function songLyric(id) {
	try {
		let res = await wx.cloud.callContainer({
			"config": {
				"env": "prod-9glkq86u6ab52840"
			},
			"path": `/lyric?id=${id}`,
			"header": {
				"X-WX-SERVICE": "music-api"
			},
			"method": "GET"
		})
		return res
	}
	catch (err) {
		console.log(err);
	}
}

// export function songLyric(id) {
// 	return uni.request({
// 		url: `${baseUrl}lyric?id=${id}`,
// 		method: 'GET'
// 	})
// }

/**
 * 和当前歌曲类似歌曲接口
 * @param {Object} id
 */
export async function songSimi(id) {
	try {
		let res = await wx.cloud.callContainer({
			"config": {
				"env": "prod-9glkq86u6ab52840"
			},
			"path": `/simi/song?id=${id}`,
			"header": {
				"X-WX-SERVICE": "music-api"
			},
			"method": "GET"
		})
		return res
	}
	catch (err) {
		console.log(err);
	}
}

// export function songSimi(id) {
// 	return uni.request({
// 		url: `${baseUrl}simi/song?id=${id}`,
// 		method: 'GET'
// 	})
// }

/**
 * 评论接口
 * @param {Object} id
 */
export async function songComment(id) {
	try {
		let res = await wx.cloud.callContainer({
			"config": {
				"env": "prod-9glkq86u6ab52840"
			},
			"path": `/comment/music?id=${id}`,
			"header": {
				"X-WX-SERVICE": "music-api"
			},
			"method": "GET"
		})
		return res
	}
	catch (err) {
		console.log(err);
	}
}

// export function songComment(id) {
// 	return uni.request({
// 		url: `${baseUrl}comment/music?id=${id}`,
// 		method: 'GET'
// 	})
// }

// 热搜接口
// export async function searchHot() {
// 	try{
// 		let res =await wx.cloud.callContainer({
// 				  "config": {
// 				    "env": "prod-9glkq86u6ab52840"
// 				  },
// 				  "path": "/search/hot/detail",
// 				  "header": {
// 				    "X-WX-SERVICE": "music-api"
// 				  },
// 				  "method": "GET"
// 				})
// 			return res
// 	}
// 	catch(err){
// 		console.log(err);
// 	}
// }

export function searchHot() {
	return uni.request({
		url: `${baseUrl}search/hot/detail`,
		method: 'GET'
	})
}

// 搜索接口
// export async function searchWord(word) {
// 	console.log(word)
// 	try{
// 		let res =await wx.cloud.callContainer({
// 				  "config": {
// 				    "env": "prod-9glkq86u6ab52840"
// 				  },
// 				  "path": `/search?keywords=${word}`,
// 				  "header": {
// 				    "X-WX-SERVICE": "music-api"
// 				  },
// 				  "method": "GET"
// 				})
// 			return res
// 	}
// 	catch(err){
// 		console.log(err);
// 	}
// }

export function searchWord(word) {
	return uni.request({
		url: `${baseUrl}search?keywords=${word}`,
		method: 'GET'
	})
}

// export async function searchSuggest(word) {
// 	try{
// 		let res =await wx.cloud.callContainer({
// 				  "config": {
// 				    "env": "prod-9glkq86u6ab52840"
// 				  },
// 				  "path": `/search/suggest?keywords=${word}&type=mobile`,
// 				  "header": {
// 				    "X-WX-SERVICE": "music-api"
// 				  },
// 				  "method": "GET"
// 				})
// 			return res
// 	}
// 	catch(err){
// 		console.log(err);
// 	}
// }

export function searchSuggest(word) {
	return uni.request({
		url: `${baseUrl}search/suggest?keywords=${word}&type=mobile`,
		method: 'GET'
	})
}