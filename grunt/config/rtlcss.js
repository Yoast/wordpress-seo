// https://github.com/MohammadYounes/grunt-rtlcss
module.exports = {
	options: {
	    clean: true,
		plugins: [
			{
				name: 'swap-dashicons-left-right-arrows',
				priority: 10,
				directives: {
					control: {},
					value: []
				},
				processors: [
					{
						expr: /content/im,
						action: function( prop, value ) {
							if ( value === '"\\f141"' ) { // dashicons-arrow-left
								value = '"\\f139"';
							} else if ( value === '"\\f340"' ) { // dashicons-arrow-left-alt
								value = '"\\f344"';
							} else if ( value === '"\\f341"' ) { // dashicons-arrow-left-alt2
								value = '"\\f345"';
							} else if ( value === '"\\f139"' ) { // dashicons-arrow-right
								value = '"\\f141"';
							} else if ( value === '"\\f344"' ) { // dashicons-arrow-right-alt
								value = '"\\f340"';
							} else if ( value === '"\\f345"' ) { // dashicons-arrow-right-alt2
								value = '"\\f341"';
							}
							return { prop: prop, value: value };
						}
					}
				]
			}
		]
	},
	plugin: {
		expand: true,
		cwd: "<%= paths.css %>",
		src: [
			"**/*.css",
			"!**/*.min.css",
		],
		dest: "css/dist",
		ext: "-rtl.css",
	},
};
