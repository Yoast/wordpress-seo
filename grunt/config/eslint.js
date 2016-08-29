// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	target: {
		src: [ "<%= files.js %>", "!js/templates.js" ],
		options: {
			maxWarnings: 76,
		},
	},
};
