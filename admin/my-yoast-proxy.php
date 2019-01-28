<?php
/**
 * WPSEO plugin file.
 *
 * This file acts as a proxy. It will read external files and serves the like they are located locally.
 *
 * @package WPSEO\Admin
 */

$plugin_version = filter_input( INPUT_GET, 'plugin_version', FILTER_SANITIZE_STRING );
// Replace slashes to secure against requiring a file from another path.
$plugin_version = str_replace( array( '/', '\\' ), '_', $plugin_version );

$suffix = filter_input( INPUT_GET, 'suffix', FILTER_SANITIZE_STRING );
if ( $suffix !== '.min' ) {
	$suffix = '';
}

switch ( filter_input( INPUT_GET, 'file', FILTER_SANITIZE_STRING ) ) {
	case 'research-webworker':
		$request_content_type = 'text/javascript; charset=UTF-8';
		$my_yoast_url         = 'https://my.yoast.com/api/downloads/file/analysis-worker?plugin_version=' . $plugin_version;

		// Fallback local file.
		$local_file = dirname( dirname( __FILE__ ) ) . '/js/dist/wp-seo-analysis-worker-recalibration-' . $plugin_version . $suffix . '.js';
		break;
}

if ( empty( $my_yoast_url ) ) {
	header( 'HTTP/1.0 501 Requested file not implemented' );
	exit;
}

$target = ini_get('allow_url_fopen' ) ? $my_yoast_url : $local_file;

header( 'Content-Type: ' . $request_content_type );
header( 'Cache-Control: max-age=86400' );

if ( readfile( $target ) === false ) {
	header_remove();
	header( 'HTTP/1.0 500 External server error' );
};

exit;
