<script context="module">
	export async function preload({ params, query }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		const res = await this.fetch(`blog/${params.slug}.json`);
		const data = await res.json();

		if (res.status === 200) {
			return { post: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	import { beforeUpdate, afterUpdate } from 'svelte';
	afterUpdate(() => {
		// ...the DOM is now in sync with the data
		if(window) {
			try {
				if(window.MathJax) {
					window.MathJax.typeset();
				}	
			} catch (error) {
				console.log(error);
			}
		}
	});
	
	export let post;
</script>

<style>
	/*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/
	.content :global(h2) {
		font-size: 1.4em;
		font-weight: 700;
	}

	.content :global(pre) {
		background-color: #f9f9f9;
		box-shadow: inset 1px 1px 5px rgba(0,0,0,0.05);
		padding: 0.5em;
		border-radius: 2px;
		overflow-x: auto;
	}

	.content :global(pre) :global(code) {
		background-color: transparent;
		padding: 0;
	}

	.content :global(ul) {
		line-height: 1.5;
	}

	.content :global(li) {
		margin: 0 0 0.5em 0;
		/* font-size: 1.0em; */
		font-size: 18px;
	}

	.content :global(img) {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}

	.content :global(figcaption) {
		margin-top: 20px;
	}

	.content :global(h1) {
		font-weight: 900;
	}

	.content :global(hr) {
		color: white;
	}

	.content :global(p) {
		font-size: 1.1em;
		line-height: 1.75em;
	}

	.content :global(figcaption) {
		text-align: center;
	}

	.content :global(img) {
		width: 100%;
		height: auto;
	}

	.content :global(video) {
		width: 100%;
		height: auto;
	}

</style>

<svelte:head>
	<title>{post.title}</title>
</svelte:head>
<div class='content'>
	<h1>{post.title}</h1>
	<hr>
	{@html post.html}
</div>
