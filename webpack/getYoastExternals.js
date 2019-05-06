const packageJson = require( "../package.json" );
const camelCase = require( "lodash/camelCase" );

const exceptions = {
	components: "componentsNew",
};

const getYoastExternals = () => {
	const yoastDependencies = Object.keys( packageJson.dependencies ).filter( dependency => {
		return dependency.startsWith( "@yoast/" );
	} );

	const externals = {};

	yoastDependencies.map( dependency => {
		dependency = dependency.replace( "@yoast/", "" );

		const externalVariableName = exceptions[ dependency ] || camelCase( dependency );

		externals[ dependency ] = `window.yoast.${ externalVariableName }`;
	} );

	return externals;
};

module.exports = getYoastExternals;
