// https://github.com/sindresorhus/grunt-sass
'use strict';

module.exports = {
	build: {
		files: {
			'css/metabox-320.css': [ 'css/src/metabox.scss' ],
			'css/kb-search.css': [ 'css/src/kb-search.scss' ],
			'css/inside-editor-330.css': [ 'css/src/inside-editor.scss' ]
		}
	}
};
