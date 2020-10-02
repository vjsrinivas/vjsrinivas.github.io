<script>
	export let segment;
</script>

<style>
	nav {
		/* border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em; */
		position: absolute;
		width: 100%;
		height: 105px;
		left: 0px;
		top: 0px;
		border-bottom: 1px solid #DFDFDF;
	}

	ul {
		margin-left: auto;
		margin-right: auto;
		margin-top: 37px;
		margin-bottom: 25px;
		/* max-width: 829px; */
		padding: 0 2em;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: right;
	}

	li:nth-child(1) {
		margin-left: 10px;
	}

	[aria-current] {
		/* position: relative;
		display: inline-block; */
		border: 1px #000;
	}

	[aria-current]::after {
		/* position: absolute;
		content: '';
		width: calc(200%);
		height: 59px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
		margin-left: -38px; */
	}

</style>

<nav>
	<ul>
		<li><a class="btn-gen" rel=prefetch aria-current='{segment === "blog" ? "page" : undefined}' href='blog'>Blog</a></li>
		<li><a class="btn-gen" aria-current='{segment === undefined ? "page" : undefined}' href='.'>Home</a></li>
		<!-- <li><a aria-current='{segment === "about" ? "page" : undefined}' href='about'>about</a></li> -->

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
	</ul>
</nav>
