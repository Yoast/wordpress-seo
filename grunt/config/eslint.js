// See https://github.com/sindresorhus/grunt-eslint
module.exports = {
	target: [ "<%= files.js %>", "!js/templates.js" ],
};
