const { camelCaseDash } = require( "@wordpress/dependency-extraction-webpack-plugin/lib/util" );

/**
 * Yoast dependencies, declared as such in the package.json.
 */
const { dependencies }    = require( "../../package" );
const legacyYoastPackages = [ "yoast-components", "yoastseo" ];
const additionalPackages  = [
	"draft-js",
	"styled-components",
	"jed",
	"prop-types",
	"redux",
	"url",
];

const YOAST_PACKAGE_NAMESPACE = "@yoast/";

// Fetch all packages from the dependencies list.
const yoastPackages = Object.keys( dependencies )
	.filter(
		( packageName ) =>
			packageName.startsWith( YOAST_PACKAGE_NAMESPACE ) ||
			legacyYoastPackages.includes( packageName ) ||
			additionalPackages.includes( packageName ),
	);

/**
 * Convert packages to externals configuration.
 */
// Yoast Packages.
const yoastExternals = yoastPackages.reduce( ( memo, packageName ) => {
	let useablePackageName = packageName.replace( YOAST_PACKAGE_NAMESPACE, "" );

	switch ( useablePackageName ) {
		case "components":
			useablePackageName = "components-new";
			break;
		case "yoast-components":
			useablePackageName = "components";
			break;
		case "yoastseo":
			useablePackageName = "analysis";
			break;
	}

	memo[ packageName ] = camelCaseDash( useablePackageName );
	return memo;
}, {} );

module.exports = {
	YOAST_PACKAGE_NAMESPACE,
	yoastPackages,
	yoastExternals,
};
