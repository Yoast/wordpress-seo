// See https://github.com/jmreidy/grunt-browserify
module.exports = {
	example: {
		files: {
			"examples/browserified/example-browserified.js": [ "examples/browserified/example.js" ],
			"examples/relevant-words-example/relevant-words-example-browserified.js": [ "examples/relevant-words-example/relevant-words-example.js" ],
		},
		options: {
			browserifyOptions: {
				debug: true,
			},
		},
	},
};
