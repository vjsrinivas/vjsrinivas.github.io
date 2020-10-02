<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`blog.json`).then(r => r.json()).then(posts => {
			return { posts };
		});
	}
</script>

<script>
	export let posts;
	export let filenames = [];
	
	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		let _file = post.mediaPath.split('/');
		filenames.push(_file[_file.length-1]);
	}

	posts = posts.filter(post => post.tags.indexOf('topic') == -1)
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}

	li {
		list-style: none;
		padding-bottom: 20px;
		border-bottom: 1px solid #e6e6e6;
		margin-top: 20px;
	}

	li:first-child {
		margin-top: 0px;
	}

	li:last-child {
		padding-bottom: 0;
		border-bottom: none;
	}

	.blog-item {
		display: grid;
		grid-template-columns: 250px auto; 
	}

	.blog-item:last-child {
		border: none;
	}

	.snapimg {
		width: 250px;
		height: 250px;
		grid-column-start: 1;
	}

	.snapdiv {
		grid-column-start: 2;
		padding-left: 45px;
	}

	h3.post {
		font-family: Karla;
		font-style: normal;
		font-weight: bold;
		font-size: 36px;
		line-height: 28px;
		color: black;
		margin-bottom: 5px;
		line-height: 1.25em;
	}

	p.post {
		
	}

	a.post {
		text-decoration: none;
	}

	.post-tag.machine.learning {
		background-color: #A965FF;
	}

	.post-tag.art {
		background-color: #c8278f;
	}

	.recent-sub {
		margin-top: 0;
	}

</style>

<svelte:head>
	<title>Vijay Rajagopal - Blog</title>
</svelte:head>
<ul class="content">
	{#each posts as post, i}
		<!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
		<li>
			<a rel='prefetch' href='blog/{post.slug}' class="post">
				<div class="blog-item">
					{#if filenames[i].split('.')[1] == 'mp4'}
						<video class="snapimg" autoplay muted loop>
							<source src="{post.mediaPath}" type="video/mp4">
							Your browser does not support the video tag.
						</video>
					{:else}
						<img src={post.mediaPath} alt="Main image for {post.title}" class="snapimg"/>
					{/if}
					<div class="snapdiv">
						<h3 class="post">{post.title}</h3>
						<p class="recent-sub">{post.created} - {post.author}</p>
						{#each post.tags as tag}
							<span class="post-tag {tag}">{tag}</span>
						{/each}
						<p class="post">
							{post.excerpt}
						</p>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>