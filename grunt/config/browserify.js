// See https://github.com/jmreidy/grunt-browserify
module.exports = {
	example: {
		files: {
			"examples/browserified/example-browserified.js": [ "examples/browserified/example.js" ],
		},
		options: {
			browserifyOptions: {
				debug: true,
			},
		},
	},
};
