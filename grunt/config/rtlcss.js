// https://github.com/MohammadYounes/grunt-rtlcss
module.exports = {
	options: {
		clean: true,
		plugins: [
			{
				name: "swap-dashicons-left-right-arrows",
				priority: 10,
				directives: {
					control: {},
					value: [],
				},
				processors: [
					{
						expr: /content/im,
						action: function( prop, value ) {
							// For dashicons-arrow-left.
							if ( value === '"\\f141"' ) {
								value = '"\\f139"';
							// For dashicons-arrow-left-alt.
							} else if ( value === '"\\f340"' ) {
								value = '"\\f344"';
							// For dashicons-arrow-left-alt2.
							} else if ( value === '"\\f341"' ) {
								value = '"\\f345"';
							// For dashicons-arrow-right.
							} else if ( value === '"\\f139"' ) {
								value = '"\\f141"';
							// For dashicons-arrow-right-alt.
							} else if ( value === '"\\f344"' ) {
								value = '"\\f340"';
							// For dashicons-arrow-right-alt2.
							} else if ( value === '"\\f345"' ) {
								value = '"\\f341"';
							}
							return { prop: prop, value: value };
						},
					},
				],
			},
		],
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
