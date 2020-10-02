import posts from './_posts.js';

const contents = JSON.stringify(posts.map(post => {
	return {
		title: post.title,
		slug: post.slug,
		created: post.created,
		excerpt: post.excerpt,
		readingTime: post.readingTime,
		mediaPath: post.mediaFilePath,
		author: post.author,
		tags: post.tags,
		art_credit: post.art_credit
	};
}));

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(contents);
}