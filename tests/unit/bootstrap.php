<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Yoast\WP\SEO
 */

define( 'WPSEO_INDEXABLES', true );
define( 'EP_DATE', 1 );

require_once __DIR__ . '/../../vendor/yoast/wp-test-utils/src/BrainMonkey/bootstrap.php';
require_once __DIR__ . '/../../vendor/autoload.php';

$GLOBALS['wp_version'] = '1.0';

define( 'WPSEO_VERSION', '1.0' );

if ( ! defined( 'WPSEO_PATH' ) ) {
	define( 'WPSEO_PATH', dirname( dirname( __DIR__ ) ) . '/' );
}

if ( ! defined( 'WPSEO_FILE' ) ) {
	define( 'WPSEO_FILE', WPSEO_PATH . 'wp-seo.php' );
}

if ( ! defined( 'WPSEO_BASENAME' ) ) {
	define( 'WPSEO_BASENAME', 'wpseo_basename' );
}

/*
 * {@internal The prefix constants are used to build prefixed versions of dependencies.
 *            These should not be changed on run-time, thus missing the ! defined() check.}}
 */
define( 'YOAST_VENDOR_NS_PREFIX', 'YoastSEO_Vendor' );
define( 'YOAST_VENDOR_DEFINE_PREFIX', 'YOASTSEO_VENDOR__' );
define( 'YOAST_VENDOR_PREFIX_DIRECTORY', 'vendor_prefixed' );

define( 'YOAST_SEO_PHP_REQUIRED', '5.6' );
define( 'YOAST_SEO_WP_TESTED', '5.9.2' );
define( 'YOAST_SEO_WP_REQUIRED', '5.8' );

if ( ! defined( 'WPSEO_NAMESPACES' ) ) {
	define( 'WPSEO_NAMESPACES', true );
}

if ( is_dir( WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY ) ) {
	require_once WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/guzzlehttp/guzzle/src/functions.php';
	require_once WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/guzzlehttp/psr7/src/functions_include.php';
	require_once WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/guzzlehttp/promises/src/functions_include.php';
}

/* ********************* DEFINES DEPENDING ON AUTOLOADED CODE ********************* */

/**
 * Defaults to production, for safety.
 */
if ( ! defined( 'YOAST_ENVIRONMENT' ) ) {
	define( 'YOAST_ENVIRONMENT', 'production' );
}

/**
 * Only use minified assets when we are in a production environment.
 */
if ( ! defined( 'WPSEO_CSSJS_SUFFIX' ) ) {
	define( 'WPSEO_CSSJS_SUFFIX', ( YOAST_ENVIRONMENT !== 'development' ) ? '.min' : '' );
}
