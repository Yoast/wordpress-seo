// https://github.com/nDmitry/grunt-postcss
module.exports = {
	build: {
		options: {
			map: "<%= developmentBuild %>",
			processors: [
				require( "postcss" )(),
				require( "postcss-import" )(),
			],
		},
		src: "<%= files.css %>",
	},
};