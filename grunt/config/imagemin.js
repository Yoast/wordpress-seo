// See https://github.com/gruntjs/grunt-contrib-imagemin for details.

// Copied from grunt-contrib-imagemin/tasks/imagemin.js
const defaultPlugins = [
	"gifsicle",
	"jpegtran",
	"optipng",
	"svgo",
];

const svgoOptions = {
	plugins: [
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
};

/**
 * Creates an array of imagemin plugins.
 *
 * @returns {Array} Array of imagemin plugins.
 */
function getPlugins() {
	return defaultPlugins.map( ( pluginName ) => {
		const options = pluginName === "svgo" ? svgoOptions : {};
		/* eslint-disable-next-line global-require */
		return require( `imagemin-${ pluginName }` )( options );
	}, [] );
}

module.exports = {
	plugin: {
		options: {
			use: getPlugins(),
		},
		files: [
			{
				expand: true,
				// This would require the addition of a assets folder from which the images are processed and put inside the images folder.
				cwd: "<%= paths.images %>",
				src: [ "*.*" ],
				dest: "<%= paths.images %>",
				isFile: true,
			},
		],
	},
};
