<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Wordpress_Seo
 */

// Determine the WP_TEST_DIR.
if ( getenv( 'WP_TESTS_DIR' ) !== false ) {
	$_tests_dir = getenv( 'WP_TESTS_DIR' );
}

// Fall back on the WP_DEVELOP_DIR environment variable.
if ( empty( $_tests_dir ) && getenv( 'WP_DEVELOP_DIR' ) !== false ) {
	$_tests_dir = rtrim( getenv( 'WP_DEVELOP_DIR' ), '/' ) . '/tests/phpunit';
}

// Give access to tests_add_filter() function.
require_once rtrim( $_tests_dir, '/' ) . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	require dirname( __DIR__ ) . '/wp-seo.php';
}

/**
 * Filter the plugins URL to pretend the plugin is installed in the test environment.
 *
 * @param string $url    The complete URL to the plugins directory including scheme and path.
 * @param string $path   Path relative to the URL to the plugins directory. Blank string
 *                       if no path is specified.
 * @param string $plugin The plugin file path to be relative to. Blank string if no plugin
 *                       is specified.
 *
 * @return string
 */
function _plugins_url( $url, $path, $plugin ) {
	$plugin_dir = dirname( __DIR__ );
	if ( $plugin === $plugin_dir . '/wp-seo.php' ) {
		$url = str_replace( dirname( $plugin_dir ), '', $url );
	}

	return $url;
}

// Add plugin to active mu-plugins - to make sure it gets loaded.
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Overwrite the plugin URL to not include the full path.
tests_add_filter( 'plugins_url', '_plugins_url', 10, 3 );

// Make sure the tests never register as being in development mode.
tests_add_filter( 'yoast_seo_development_mode', '__return_false' );

/* *****[ Yoast SEO specific configuration ]***** */

if ( ! defined( 'YOAST_ENVIRONMENT' ) ) {
	define( 'YOAST_ENVIRONMENT', 'test' );
}

if ( ! defined( 'YOAST_SEO_INDEXABLES' ) ) {
	define( 'YOAST_SEO_INDEXABLES', true );
}

if ( defined( 'WPSEO_TESTS_PATH' ) && WPSEO_TESTS_PATH !== __DIR__ . '/' ) {
	echo 'WPSEO_TESTS_PATH is already defined and does not match expected path.';
	exit( 1 ); // Exit with error code, to make the build fail.
}
define( 'WPSEO_TESTS_PATH', __DIR__ . '/' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';
