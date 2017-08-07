const pluginVersion = "5.0.2";

const versionParts = pluginVersion.split( "." );

if ( versionParts.length === 2 ) {
	versionParts.push( 0 );
}

const pluginVersionSlug = versionParts.join( "" );

module.exports = { pluginVersionSlug, pluginVersion };
