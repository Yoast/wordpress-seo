<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\YoastSEO\Loaders
 */

use Yoast\WP\Free\Config\Dependency_Management;
use Yoast\WP\Free\Oauth\Client;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessTokenInterface;

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( file_exists( dirname( WPSEO_FILE ) . '/vendor_prefixed/guzzlehttp/guzzle/src/functions.php' ) ) {
	require_once dirname( WPSEO_FILE ) . '/vendor_prefixed/guzzlehttp/guzzle/src/functions.php';
}

if ( file_exists( dirname( WPSEO_FILE ) . '/vendor_prefixed/guzzlehttp/psr7/src/functions.php' ) ) {
	require_once dirname( WPSEO_FILE ) . '/vendor_prefixed/guzzlehttp/psr7/src/functions.php';
}

if ( file_exists( dirname( WPSEO_FILE ) . '/vendor_prefixed/guzzlehttp/promises/src/functions.php' ) ) {
	require_once dirname( WPSEO_FILE ) . '/vendor_prefixed/guzzlehttp/promises/src/functions.php';
}

$yoast_seo_dependecy_management = new Dependency_Management();
$yoast_seo_dependecy_management->initialize();

class_alias( Client::class, 'WPSEO_MyYoast_Client' );
class_alias( AccessTokenInterface::class, 'WPSEO_MyYoast_AccessToken_Interface' );
