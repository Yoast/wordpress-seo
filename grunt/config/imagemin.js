// https://github.com/gruntjs/grunt-contrib-imagemin
module.exports = {
	images: {
		files: [{
			expand: true,
			// this would require the addition of a assets folder from which the images are
			// processed and put inside the images folder
			cwd: 'images/',
			src: ['*.*'],
			dest: 'images'
		}]
	}
};
