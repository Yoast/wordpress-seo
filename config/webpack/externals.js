const { camelCaseDash } = require( "@wordpress/dependency-extraction-webpack-plugin/lib/util" );

const externals = {
	// This is necessary for Gutenberg to work.
	tinymce: "window.tinymce",

	// General dependencies that we have.
	jed: "window.yoast.jed",
	lodash: "window.lodash",
	"lodash-es": "window.lodash",
	react: "React",
	"react-dom": "ReactDOM",

	// Possible self-reference due to the exposing in `src/externals`.
	redux: "window.yoast.redux",
	"react-redux": "window.yoast.reactRedux",
	"styled-components": "window.yoast.styledComponents",
	"draft-js": "window.yoast.draftJs",
};

/**
 * WordPress dependencies.
 */
const wordpressPackages = [
	"@wordpress/a11y",
	"@wordpress/api-fetch",
	"@wordpress/block-editor",
	"@wordpress/blocks",
	"@wordpress/components",
	"@wordpress/compose",
	"@wordpress/data",
	"@wordpress/date",
	"@wordpress/dom",
	"@wordpress/dom-ready",
	"@wordpress/edit-post",
	"@wordpress/element",
	"@wordpress/hooks",
	"@wordpress/html-entities",
	"@wordpress/i18n",
	"@wordpress/is-shallow-equal",
	"@wordpress/keycodes",
	"@wordpress/plugins",
	"@wordpress/rich-text",
	"@wordpress/server-side-render",
	"@wordpress/url",
];

/**
 * Yoast dependencies, declared as such in the package.json.
 */
const { dependencies } = require( "../../packages/js/package" );
const legacyYoastPackages = [ "yoast-components" ];

const YOAST_PACKAGE_NAMESPACE = "@yoast/";

// Fetch all packages from the dependencies list.
const yoastPackages = Object.keys( dependencies )
	.filter(
		( packageName ) =>
			packageName.startsWith( YOAST_PACKAGE_NAMESPACE ) ||
			legacyYoastPackages.includes( packageName ),
	);

/**
 * Convert Yoast packages to externals configuration.
 */
const yoastExternals = yoastPackages.reduce( ( memo, packageName ) => {
	let usablePackageName = packageName.replace( YOAST_PACKAGE_NAMESPACE, "" );

	// Handle the difference between yoast-components and @yoast/components.
	usablePackageName = ( usablePackageName === "components" ) ? "components-new" : usablePackageName;
	usablePackageName = ( usablePackageName === "yoast-components" ) ? "components" : usablePackageName;

	// Handle yoastseo as analysis reference.
	usablePackageName = ( usablePackageName === "yoastseo" ) ? "analysis" : usablePackageName;

	memo[ packageName ] = `window.yoast.${ camelCaseDash( usablePackageName ) }`;
	return memo;
}, {} );

// WordPress packages.
const wordpressExternals = wordpressPackages.reduce( ( memo, packageName ) => {
	const name = camelCaseDash( packageName.replace( "@wordpress/", "" ) );

	memo[ packageName ] = `window.wp.${ name }`;
	return memo;
}, {} );

/**
 * Export the data.
 */
module.exports = {
	externals,
	yoastExternals,
	wordpressExternals,
	YOAST_PACKAGE_NAMESPACE,
};
