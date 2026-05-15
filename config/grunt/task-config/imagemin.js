const imageminSvgo = require( "imagemin-svgo" );

/**
 * Imagemin override: adds a target for packages/js/images/ with full SVGO optimization.
 *
 * The @yoast/grunt-plugin-tasks imagemin config only targets the root images/ and svn-assets/
 * folders, and uses a minimal SVGO plugin set. This override adds packages/js/images/ as a
 * separate target with SVGO's full default plugin suite plus the accessibility attributes
 * required by Yoast's SVG usage.
 */
module.exports = {
	"js-images": {
		options: {
			use: [
				imageminSvgo( {
					plugins: [
						{ name: "preset-default" },
						{
							name: "addAttributesToSVGElement",
							params: {
								attributes: [
									{ role: "img" },
									{ "aria-hidden": "true" },
									{ focusable: "false" },
								],
							},
						},
					],
				} ),
			],
		},
		files: [
			{
				expand: true,
				cwd: "packages/js/images/",
				src: [ "*.svg" ],
				dest: "packages/js/images/",
				isFile: true,
			},
		],
	},
};
