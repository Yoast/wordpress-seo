const mainConfig = require( "./main.webpack.config" );
const bootstrapConfig = require( "./bootstrapAnalysis.webpack.config" );
const languageConfig = require( "./languages.webpack.config" );

module.exports = [ mainConfig, bootstrapConfig, languageConfig ];
