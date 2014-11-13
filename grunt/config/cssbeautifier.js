// https://github.com/sexnothing/grunt-cssbeautifier
module.exports = {
	options: {
		indent: '\t',
		openbrace: 'end-of-line',
		autosemicolon: true
	},
	files: [
		'css/*.css',
		'!css/*.min.css'
	]
};
