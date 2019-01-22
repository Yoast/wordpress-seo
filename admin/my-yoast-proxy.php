<?php
/**
 * WPSEO plugin file.
 *
 * This file acts as a proxy. It will read external files and serves the like they are located locally.
 *
 * @package WPSEO\Admin
 */

switch ( filter_input( INPUT_GET, 'file', FILTER_SANITIZE_STRING ) ) {
	case 'research-webworker':
		$my_yoast_url = 'https://my.yoast.com/api/downloads/file/analysis-worker';
		$my_yoast_url_content_type = 'text/javascript; charset=UTF-8';
		break;
}

if ( empty( $my_yoast_url ) ) {
	header( 'HTTP/1.0 501 Requested file not implemented' );
	exit;
}

if ( ini_get('allow_url_fopen' ) ) {
	header( 'Content-Type: ' . $my_yoast_url_content_type );
	header( 'Cache-Control: max-age=86400' );
	readfile( $my_yoast_url );
	exit;
}

// Try to load WordPress, to be able to use `wp_remote_get`.
if ( ! is_file( $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php' ) ) {
	header( 'HTTP/1.0 500 Server configuration not compatible' );
	exit;
}

require $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php';

$content = wp_remote_get( $my_yoast_url );
if ( $content instanceof WP_Error ) {
	header( 'HTTP/1.0 500 Unable to retrieve file from MyYoast' );
	exit;
}

$status_code = $content['http_response']->get_status();
if ( $status_code === 200 ) {
	header( 'Content-Type: ' . $my_yoast_url_content_type );
	header( 'Cache-Control: max-age=86400' );
	echo $content['body'];
}

header( 'HTTP/1.0 500 Recieved unexpected response from MyYoast' );

exit;
