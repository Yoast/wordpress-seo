// https://github.com/nDmitry/grunt-postcss
module.exports = {
	options: {
		processors: [
			require( "autoprefixer" )( { browsers: "last 2 versions, IE >= 9" } )
		]
	},
	build: {
		src: "dist/yoast-seo.min.css"
	}
};
