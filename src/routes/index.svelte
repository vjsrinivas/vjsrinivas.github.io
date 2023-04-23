<style global>
	.item {
		/* width: 414px; */
	}
	
	#bio {
		/* grid-column-start: 1;
		grid-row-start: 1; */
	}

	#bio-desc {
		/* grid-column-start: 2;
		grid-row-start: 1; */
		border: 1px solid #E7E7E7;
		max-width: 414px;
		/* height: 424px; */
		padding: 28px;
	}

	#recent-img {
		/* grid-column-start: 1;
		grid-row-start: 2; */
	}

	#recent-post {
		/* grid-column-start: 2;
		grid-row-start: 2; */
	}

	#name {
		font-family: Karla;
		font-style: normal;
		font-weight: bold;
		font-size: 48px;
		line-height: 56px;
		color: #000000;
		margin-top: 10px;
	}

	.heading {
		font-family: Karla;
		font-style: normal;
		font-weight: bold;
		font-size: 24px;
		line-height: 28px;
	}


	a.heading {
		text-decoration: none;
		color: #2663FF;
		margin-bottom: 0px;
	}

	a.heading > h3 {
		margin-bottom: 3px;
	}

	a.heading:hover {
		text-decoration: underline;
	}

	#bio-body {
		font-style: normal;
		font-weight: normal;
		font-size: 18px;
		line-height: 28px;
	}

	.text-highlight {
		padding-top: 3px;
		padding-bottom: 3px;
		padding-left: 5px;
		padding-right: 5px;
		background-color: #000;
		color: white;
	}

	.text-highlight.ml {
		padding-top: 2px;
	}

	#utk {
		background-color: #FF8200;
	}

	#employ {
		background-color: #2663FF;
	}

	#target-resume {
		border: none;
		font-family: Karla;
		max-width: 181px;
		height: 45px;
		font-style: normal;
		font-weight: bold;
		font-size: 18px;
		line-height: 21px;

		/* identical to box height */
		align-items: center;
		text-align: center;
		font-weight: bold;
		color: white;
		background: #A965FF;
	}

	/*
	.btnbg {
		position: absolute;
		left: -5.26%;
		right: -12.43%;
		top: 14.03%;
		bottom: -18.2%;
		border: 1px solid #A965FF;
	}
	*/

	#sociallinks {
		margin-top: 20px;
	}

	.social, .fas, .fab {
		margin-right: 20px;
		width: 30px;
		height: 25px;
		font-size: 30px;
	}

	.fas, .fab {
		opacity: 0.75;
	}

	.fas:hover, .fab:hover {
		opacity: 1;
	}

	.fab:last-child {
		width: 25px;
	}
	
	img.social {
		opacity: 0.6;
		cursor: pointer;
	}

	.social:hover {
		opacity: 0.9;
	}

	div.recent {
		margin-top: 42px;
	}

	p.recent-sub {
		font-style: normal;
		font-weight: bold;
		font-size: 12px;
		line-height: 15px;
		margin-top: 0;
	}

	p.recent {
		font-style: normal;
		font-weight: normal;
		font-size: 16px;
		line-height: 24px;
	}

	#readmore {
		width: 61px;
		margin-left: auto;
		margin-right: auto;
	}

	.preview_img {
		width: 356px;
		height: 356px;
	}

	.preview_video {
		width: 356px;
		height: 356px;
	}

	.caption {
		margin-top: 0px;
		font-style: normal;
		font-weight: normal;
		font-size: 12px;
		line-height: 28px;
		color: #777777;
	}

	.skeleton.bar.title {
		width: 100%;
		height:	50px;
	}

	.skeleton.bar.paragraph {
		margin-top: 20px;
		width: 100%;
		height: 297px;
	}

	.skeleton.bar.p {
		height: 20px;
		margin-top: 5px;
	}

	.p-16x {
		width: 100%;
	}

	.p-8x {
		width: 75%;
	}

	.p-4x {
		width: 50%;
	}

	.skeleton.image {
		width: 365px;
		height :365px;
	}

	.skeleton-bg {
    background: linear-gradient(270deg, #ffffff, #f2f2f2);
    background-size: 400% 400%;

    -webkit-animation: AnimationName 10s ease infinite;
    -moz-animation: AnimationName 10s ease infinite;
    animation: AnimationName 10s ease infinite;
	}

	@-webkit-keyframes AnimationName {
		0%{background-position:0% 50%}
		50%{background-position:100% 50%}
		100%{background-position:0% 50%}
	}
	@-moz-keyframes AnimationName {
		0%{background-position:0% 50%}
		50%{background-position:100% 50%}
		100%{background-position:0% 50%}
	}
	@keyframes AnimationName {
		0%{background-position:0% 50%}
		50%{background-position:100% 50%}
		100%{background-position:0% 50%}
	}
</style>

<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`blog.json`).then(r => r.json()).then(
			posts => {
				return { posts }; 
			}
		);
	}
</script>

<script>
	export let posts;
	let filename = ''
	if(posts.length > 0) {
		// get just filename:
		let _file = posts[0].mediaPath.split('/');
		filename = _file[_file.length-1]
	}
	export {filename};
</script>

<svelte:head>
	<title>Vijay Rajagopal</title>
</svelte:head>

<div class="content content-grid">
	<div class="item" id="bio">
		<h1 id="name">Vijay Rajagopal</h1>
		<a href="Resume_Spring_2022.pdf">
			<button id="target-resume">
				<span>View Resume</span>
				<!-- <img class="btnbg" src="targetbtn_bg.svg" alt="Kiwi standing on oval"> -->
			</button>
		</a>
		<div id="sociallinks">
			<a href="mailto:vijaythinks@gmail.com"><i class="fas fa-envelope"></i></a>
			<a href="https://github.com/vjsrinivas"><i class="fab fa-github"></i></a>
			<a href="https://www.linkedin.com/in/vjrajagopal/"><i class="fab fa-linkedin"></i></a>
			<!-- <a href="https://www.artstation.com/vijaysrinivas/"><i class="fab fa-artstation"></i></a> -->
			<a href="https://devpost.com/vjsrinivas">
				<img class="social" src="post-res/devpost.svg" id="devpost"/>
			</a>
		</div>
	</div>
	<div class="item" id="bio-desc">
		<h3 class="heading">Biography</h3>
		<p id="bio-body">
			My name is Vijay Rajagopal, and I am a computer science graduate from the <br><span class="text-highlight" id="utk">University of Tennessee.</span>
			I specialize in <span class="text-highlight" id="employ">Computer Vision</span> for industrial applications and take interest in topics such as
			<span class="text-highlight">Image Processing</span> and <br><span class="text-highlight ml">Machine Learning.</span>

			<!-- My name is Vijay Rajagopal, and I am a computer science student studying at the
			<br><span class="text-highlight" id="utk">University of Tennessee.</span>
			My interests include creating software for a diverse audience as well as working with topics such as
			<span class="text-highlight">Image Processing</span> and <br><span class="text-highlight ml">Machine Learning.</span> -->
		</p>
	</div>
	<div class="item recent" id="recent-img">
		{#if posts.length > 0}
			{#if filename.split('.')[1] == 'mp4'}
				<video class="preview_video" autoplay muted loop>
					<source src="{posts[0].mediaPath}" type="video/mp4">
					Your browser does not support the video tag.
				</video>
			{:else}
				<img class="preview_img" src="{posts[0].mediaPath}" alt="{posts[0].title}'s image"/>
			{/if}
		{:else}
			<img class="preview_img" src="https://via.placeholder.com/365x365", alt="Image shows nothing; indicates no blog posts made yet"/>
			<!-- <div class="skeleton image skeleton-bg"></div> -->
		{/if}

		{#if posts.length > 0}
		<p class="caption">Credit: {posts[0].art_credit}</p>
		{/if}
	</div>
	<div class="item recent" id="recent-post">
		{#if posts.length > 0}
			<a class="heading" rel='prefetch' href='blog/{posts[0].slug}'><h3 class="heading">{posts[0].title}</h3></a>
			<p class="recent-sub">{posts[0].created} - {posts[0].author}</p>

			<p class="recent">
				{posts[0].excerpt}
			</p>

			<a class="btn-gen" id="readmore" href='blog/{posts[0].slug}'>Read More</a>
		{:else}
			<!-- <div class="skeleton skeleton-bg bar title"></div>
			<div class="skeleton bar paragraph">
				<div class="skeleton bar p p-16x skeleton-bg"></div>
				<div class="skeleton bar p p-8x skeleton-bg"></div>
				<div class="skeleton bar p p-4x skeleton-bg"></div>
				<div class="skeleton bar p p-8x skeleton-bg"></div>
				<div class="skeleton bar p p-4x skeleton-bg"></div>
				<div class="skeleton bar p p-4x skeleton-bg"></div>
				<div class="skeleton bar p p-8x skeleton-bg"></div>
				<div class="skeleton bar p p-16x skeleton-bg"></div>
				<div class="skeleton bar p p-4x skeleton-bg"></div>
			</div> -->
		{/if}
	</div>
</div>

