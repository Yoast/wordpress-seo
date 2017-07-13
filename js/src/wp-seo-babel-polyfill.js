// The babel polyfill sets the _babelPolyfill to true. So only load it ourselves if the variable is undefined or false.
if ( typeof window._babelPolyfill === "undefined" || ! window._babelPolyfill ) {
	// eslint-disable-next-line global-require
	require( "babel-polyfill" );
}
