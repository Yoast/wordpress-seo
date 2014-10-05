/* global require */
module.exports = function (grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*', 'assemble-less']
	});

	require('time-grunt')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg       : grunt.file.readJSON('package.json'),

		// Watch source files
		watch     : {
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: ['jshint:grunt', 'jsvalidate', 'jscs']
			},
			php      : {
				files: ['**/*.php', '*/*.php', '!node_modules/**'],
				tasks: ['phplint', 'phpcs']
			},
			js       : {
				files: ['js/*.js'],
				tasks: ['jshint', 'jsvalidate', 'jscs', 'uglify']
			},
			css      : {
				files: ['css/*css'],
				tasks: ['build:css']
			}
		},

		// JavaScript

		// Lint JS code practices
		jshint    : {
			grunt: {
				options: {
					jshintrc: '.gruntjshintrc'
				},
				src    : ['Gruntfile.js']
			}
		},

		// Lint JS for code standards
		jscs      : {
			options: {
				config: '.jscsrc'
			},
			all    : {
				files: {
					src: [
						'Gruntfile.js',
						'.gruntjshintrc',
						'.jshintrc',
						'package.json'
					]
				}
			}
		},

		// Lint JSON files for syntax errors
		jsonlint  : {
			all: {
				src: [
					'.gruntjshintrc',
					'.jshintrc',
					'package.json'
				]
			}
		},

		// Lint .js files for syntax errors
		jsvalidate: {
			all: {
				options: {
					verbose: true
				},
				files  : {
					src: [
						'Gruntfile.js'
					]
				}
			}
		},

		uglify      : {
			'wordpres-seo': {
				options: {
					preserveComments: 'some',
					report          : 'gzip'
				},
				files  : [
					{
						expand: true,
						cwd   : 'js',
						src   : ['*.js', '!*.min.js'],
						dest  : 'js',
						ext   : '.min.js',
						extDot: 'first',
						isFile: true
					}
				]
			}
		},

		// CSS
		autoprefixer: {
			options: {
				browsers: [
					'last 1 versions',
					'Explorer >= 8'
				]
			},
			all    : {
				src    : [
					'css/*.css', '!css/*.min.css'
				],
				options: {
					// diff: 'tmp/autoprefixer.patch'
				}
			}
		},

		csscomb: {
			css: {
				expand: true,
				src   : ['css/*.css', '!css/*.min.css']
			}
		},

		cssbeautifier: {
			files  : ['css/*.css', '!css/*.min.css'],
			options: {
				indent       : '\t',
				openbrace    : 'end-of-line',
				autosemicolon: true
			}
		},

		cssmin       : {
			minify: {
				expand: true,
				cwd   : 'css/',
				src   : ['*.css', '!*.min.css'],
				dest  : 'css/',
				ext   : '.min.css'
			}
		},

		// PHP

		// Lint .php files for syntax errors
		phplint      : {
			all: ['**/*.php', '!node_modules/**']
		},

		// Lint .php files for code standards
		phpcs        : {
			all    : {
				//adjust these to the folder you do and don't want to be treated
				dir: ['**/*.php', '!admin/license-manager/**', '!node_modules/**']
			},
			options: {
				standard      : 'codesniffer.xml',
				reportFile    : 'phpcs.txt',
				ignoreExitCode: true
			}
		},

// Optimize images to save bytes
		imagemin     : {
			images: {
				files: [{
					expand: true,
					// this would require the addition of a assets folder from which the images are
					// processed and put inside the images folder
					cwd   : 'images/',
					src   : ['*.*'],
					dest  : 'images'
				}]
			}
		},

// I18n
		addtextdomain: {
			options: {
				textdomain: 'wordpress-seo'
			},
			php    : {
				files: {
					src: [
						'*php', '**/*.php', '!admin/license-manager/**', '!node_modules/**'
					]
				}
			}
		},

		checktextdomain: {
			options: {
				text_domain: 'wordpress-seo',
				keywords   : [
					'__:1,2d',
					'_e:1,2d',
					'_x:1,2c,3d',
					'_ex:1,2c,3d',
					'_n:1,2,4d',
					'_nx:1,2,4c,5d',
					'_n_noop:1,2,3d',
					'_nx_noop:1,2,3c,4d',
					'esc_attr__:1,2d',
					'esc_html__:1,2d',
					'esc_attr_e:1,2d',
					'esc_html_e:1,2d',
					'esc_attr_x:1,2c,3d',
					'esc_html_x:1,2c,3d'
				]
			},
			files  : {
				expand: true,
				src   : [
					'**/*.php', '!node_modules/**', '!admin/license-manager/**'
				]
			}
		},

		// Generate POT files.
		makepot: {
			plugin: {
				options: {
					type: 'wp-plugin',
					domainPath: '/languages',
					potFilename: 'wordpress-seo.pot',
					potHeaders: {
						poedit: true,
						'report-msgid-bugs-to': 'https://github.com/yoast/wordpress-seo',
						'language-team': 'Yoast Translate <translations@yoast.com>',
						'last-translator': 'Yoast Translate Team <translations@yoast.com>'
					}
				}
			}
		}
	});

	grunt.registerTask('check', [
		'jshint',
		'jsonlint',
		'jsvalidate',
		'checktextdomain'
	]);

	grunt.registerTask('build', [
		'build:css',
		'build:js',
		'build:i18n',
		'imagemin'
	]);

	grunt.registerTask('build:css', [
		'autoprefixer',
		'csscomb',
		'cssbeautifier',
		'cssmin'
	]);

	grunt.registerTask('build:js', [
		'uglify'
	]);

	grunt.registerTask('build:i18n', [
		'addtextdomain',
		'makepot'
	]);

	grunt.registerTask('default', [
		'build'
	]);

};
