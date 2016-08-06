// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	plugin: [ "<%= files.js %>" ],
	grunt: [ "<%= files.grunt %>", "<%= files.config %>" ]
};
