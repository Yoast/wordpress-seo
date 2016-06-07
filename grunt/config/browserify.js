module.exports = {
	build: {
		files: {
			'js/dist/wp-seo-admin-global-320.js': ['js/src/wp-seo-admin-global.js'],
			'js/dist/wp-seo-admin-gsc-320.js': ['js/src/wp-seo-admin-gsc.js'],
			'js/dist/wp-seo-admin-media-320.js': ['js/src/wp-seo-admin-media.js'],
			'js/dist/wp-seo-bulk-editor-320.js': ['js/src/wp-seo-bulk-editor.js'],
			'js/dist/wp-seo-dismissible-320.js': ['js/src/wp-seo-dismissible.js'],
			'js/dist/wp-seo-export-320.js': ['js/src/wp-seo-export.js'],
			'js/dist/wp-seo-featured-image-320.js': ['js/src/wp-seo-featured-image.js'],
			'js/dist/wp-seo-metabox-320.js': ['js/src/wp-seo-metabox.js'],
			'js/dist/wp-seo-metabox-category-320.js': ['js/src/wp-seo-metabox-category.js'],
			'js/dist/wp-seo-post-scraper-324.js': ['js/src/wp-seo-post-scraper.js'],
			'js/dist/wp-seo-recalculate-324.js': ['js/src/wp-seo-recalculate.js'],
			'js/dist/wp-seo-replacevar-plugin-320.js': ['js/src/wp-seo-replacevar-plugin.js'],
			'js/dist/wp-seo-shortcode-plugin-320.js': ['js/src/wp-seo-shortcode-plugin.js'],
			'js/dist/wp-seo-term-scraper-324.js': ['js/src/wp-seo-term-scraper.js']
		}
	},
	buildes6: {
		options: {
			transform: [
				['babelify', { presets: ['es2015'] } ]
			]
		},
		files: {
			'js/dist/wp-seo-admin-320.js': ['js/src/wp-seo-admin.js']
		}
	}
};
