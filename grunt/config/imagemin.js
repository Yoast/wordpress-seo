// See https://github.com/gruntjs/grunt-contrib-imagemin for details.

// Copied from grunt-contrib-imagemin/tasks/imagemin.js
const defaultPlugins = [
	"gifsicle",
	"jpegtran",
	"optipng",
//	"svgo",
];

/**
 * Creates an array of imagemin plugins.
 *
 * @returns {Array} Array of imagemin plugins.
 */
function getPlugins() {
	return defaultPlugins.map( ( pluginName ) => {
		/* eslint-disable-next-line global-require */
		return require( `imagemin-${ pluginName }` )();
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
