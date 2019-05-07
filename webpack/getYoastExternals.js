const packageJson = require( "../package.json" );
const camelCase = require( "lodash/camelCase" );

const exceptions = {
	"@yoast/components": "componentsNew",
};

const getYoastExternals = () => {
	const yoastDependencies = Object.keys( packageJson.dependencies ).filter( dependency => {
		return dependency.startsWith( "@yoast/" );
	} );

	const externals = {};

	yoastDependencies.map( dependency => {
		const dependencyWithoutNamespace = dependency.replace( "@yoast/", "" );

		const externalVariableName = exceptions[ dependency ] || camelCase( dependencyWithoutNamespace );

		externals[ dependency ] = `window.yoast.${ externalVariableName }`;
	} );

	return externals;
};

module.exports = getYoastExternals;
