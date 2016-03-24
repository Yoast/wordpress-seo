// https://github.com/ariya/grunt-jsvalidate
module.exports = {
	templates: {
		dest: "js/templates.js",
		options: {
			exports: [ "node" ],
			template: "<%= files.templates %>",
			flags: [ "--development" ],
			"moduleId": "none"
		}
	}
};
