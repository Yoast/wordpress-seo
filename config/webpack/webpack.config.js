// External dependencies
const { existsSync, readdirSync } = require( "fs" );
const { join } = require( "path" );

// Variables
const root = join( __dirname, "../../" );

// Internal dependencies
const paths       = require( "./paths" );
const packageJson = require( root + "package.json" );
const baseConfig  = require( "./webpack.config.base" );
const {
	yoastPackages,
	yoastExternals,
} = require( "./externals" );

const languages = readdirSync( root + "node_modules/yoastseo/src/languageProcessing/languages" );
const pluginVersion = packageJson.yoast.pluginVersion;
const pluginVersionSlug = paths.flattenVersionForFile( pluginVersion );
const outputFilename = "[name].min.js";

module.exports = [
	baseConfig(
		{
			entry: paths.entry,
			output: {
				path: paths.jsDist,
				filename: outputFilename,
			},
			combinedOutputFile: root + "src/generated/assets/plugin.php",
			cssExtractFileName: root + "../../css/dist/plugin-" + pluginVersionSlug + ".css",
		}
	),
	baseConfig(
		{
			entry: yoastPackages.reduce( ( memo, packageName ) => {
				if ( existsSync( "./packages/" + packageName ) ) {
					memo[ yoastExternals[ packageName ] ] = "./packages/" + packageName;
					return memo;
				}
				memo[ yoastExternals[ packageName ] ] = "./node_modules/" + packageName;
				return memo;
			}, {} ),
			output: {
				path: paths.jsDist + "/externals",
				filename: outputFilename,
				library: [ "yoast", "[name]" ],
				libraryTarget: "window",
			},
			combinedOutputFile: root + "src/generated/assets/externals.php",
			cssExtractFileName: "../../../css/dist/monorepo-" + pluginVersionSlug + ".css",
		}
	),
	baseConfig(
		{
			entry: languages.reduce( ( memo, language ) => {
				const name = ( language === "_default" ) ? "default" : language;
				memo[ name ] = "./node_modules/yoastseo/src/languageProcessing/languages/" + language + "/Researcher";
				return memo;
			}, {} ),
			output: {
				path: paths.jsDist + "/languages",
				filename: outputFilename,
				library: [ "yoast", "Researcher" ],
				libraryTarget: "window",
			},
			combinedOutputFile: root + "src/generated/assets/languages.php",
			cssExtractFileName: "../../../css/dist/languages-" + pluginVersionSlug + ".css",
		}
	),
];
