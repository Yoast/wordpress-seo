// See https://github.com/gruntjs/grunt-contrib-imagemin for details.
module.exports = {
	plugin: {
		files: [
			{
				expand: true,
				// This would require the addition of a assets folder from which the images are processed and put inside the images folder.
				cwd: "<%= paths.images %>",
				src: [ "*.*" ],
				dest: "<%= paths.images %>",
				isFile: true,
			},
			{
				expand: true,
				// This would require the addition of a assets folder from which the images are processed and put inside the images folder.
				cwd: "<%= paths.svnAssets %>",
				src: [ "*.*" ],
				dest: "<%= paths.svnAssets %>",
				isFile: true,
			},
		],
	},
};
