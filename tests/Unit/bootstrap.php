<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Yoast\WP\SEO
 */

namespace Yoast\WP\SEO\Tests\Unit;

use Yoast\WPTestUtils\BrainMonkey;

\define( 'WPSEO_INDEXABLES', true );
\define( 'EP_DATE', 1 );

require_once __DIR__ . '/../../vendor/yoast/wp-test-utils/src/BrainMonkey/bootstrap.php';
require_once __DIR__ . '/../../vendor/autoload.php';

$GLOBALS['wp_version'] = '1.0';

\define( 'WPSEO_VERSION', '1.0' );

if ( ! \defined( 'WPSEO_PATH' ) ) {
	\define( 'WPSEO_PATH', \dirname( __DIR__, 2 ) . '/' );
}

if ( ! \defined( 'WPSEO_FILE' ) ) {
	\define( 'WPSEO_FILE', \WPSEO_PATH . 'wp-seo.php' );
}

if ( ! \defined( 'WPSEO_BASENAME' ) ) {
	\define( 'WPSEO_BASENAME', 'wpseo_basename' );
}

/*
 * {@internal The prefix constants are used to build prefixed versions of dependencies.
 *            These should not be changed on run-time, thus missing the ! defined() check.}}
 */
\define( 'YOAST_VENDOR_NS_PREFIX', 'YoastSEO_Vendor' );
\define( 'YOAST_VENDOR_DEFINE_PREFIX', 'YOASTSEO_VENDOR__' );
\define( 'YOAST_VENDOR_PREFIX_DIRECTORY', 'vendor_prefixed' );

\define( 'YOAST_SEO_PHP_REQUIRED', '7.2.5' );
\define( 'YOAST_SEO_WP_TESTED', '6.7.1' );
\define( 'YOAST_SEO_WP_REQUIRED', '6.5' );

if ( ! \defined( 'WPSEO_NAMESPACES' ) ) {
	\define( 'WPSEO_NAMESPACES', true );
}

if ( \is_dir( \WPSEO_PATH . \YOAST_VENDOR_PREFIX_DIRECTORY ) ) {
	require_once \WPSEO_PATH . \YOAST_VENDOR_PREFIX_DIRECTORY . '/guzzlehttp/guzzle/src/functions.php';
}

/* ********************* LOAD TEST DOUBLES FOR WP NATIVE CLASSES ********************* */

// Create the necessary test doubles for WP native classes on which properties are being set (PHP 8.2 compat).
BrainMonkey\makeDoublesForUnavailableClasses(
	[
		'WP',
		'WP_Post',
		'WP_Query',
		'WP_Rewrite',
		'WP_Roles',
		'WP_Term',
		'WP_User',
		'wpdb',
	]
);

/* ********************* DEFINES DEPENDING ON AUTOLOADED CODE ********************* */

/**
 * Defaults to production, for safety.
 */
if ( ! \defined( 'YOAST_ENVIRONMENT' ) ) {
	\define( 'YOAST_ENVIRONMENT', 'development' );
}

/**
 * Only use minified assets when we are in a production environment.
 */
if ( ! \defined( 'WPSEO_CSSJS_SUFFIX' ) ) {
	\define( 'WPSEO_CSSJS_SUFFIX', ( \YOAST_ENVIRONMENT !== 'development' ) ? '.min' : '' );
}
