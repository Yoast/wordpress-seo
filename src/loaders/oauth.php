<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\YoastSEO\Loaders
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( file_exists( dirname( WPSEO_FILE ) . '/vendor_prefixed/guzzlehttp/guzzle/src/functions.php' ) ) {
	require_once dirname( WPSEO_FILE ) . '/vendor_prefixed/guzzlehttp/guzzle/src/functions.php';
}
