<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import '@/uni_modules/uview-ui/index.scss';
</style>

<style>
	.bgimg {
			z-index: -1;
			width: 100%;
			height: 100vh;
			position: fixed;
			left: 0;
			top: 0;
			background-position: 0 0;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center 0;
			/* 背景模糊以及毛边框特效 */
			filter: blur(10px);
			transform: scale(1.2);
		}
</style>