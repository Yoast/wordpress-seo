/**
 * Imagemin config: adds a js-images target for packages/js/images/ with the same
 * SVGO options used by @yoast/grunt-plugin-tasks for images/ and svn-assets/.
 *
 * imagemin-svgo@7 bundles SVGO v1, so plugin options must use SVGO v1 syntax.
 * The upstream @yoast/grunt-plugin-tasks imagemin config is left unchanged;
 * this file only adds the js-images target.
 */
module.exports = {
	"js-images": {
		options: {
			svgoPlugins: [
				{ removeTitle: true },
				{ removeDesc: true },
				{ removeUnknownsAndDefaults: {
					keepRoleAttr: true,
					keepAriaAttrs: true,
				} },
				{ addAttributesToSVGElement: {
					attributes: [
						{ role: "img" },
						{ "aria-hidden": "true" },
						{ focusable: "false" },
					],
				} },
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
