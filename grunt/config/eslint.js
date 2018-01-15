// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	target: {
		src: [ "<%= files.js %>", "!src/templates.js" ],
		options: {
			maxWarnings: 140,
		},
	},
};
