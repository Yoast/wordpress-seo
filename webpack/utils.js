const pkg = require( "../package.json" );
const paths = require( "./paths" );

function getOutputFilename( mode ) {
	const pluginVersionSlug = paths.flattenVersionForFile( pkg.yoast.pluginVersion );

	const outputFilenamePostfix = mode === "development" ? ".js" : ".min.js";

	return "[name]-" + pluginVersionSlug + outputFilenamePostfix;
}

module.exports = {
	getOutputFilename,
};
