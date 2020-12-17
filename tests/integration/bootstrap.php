<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Wordpress_Seo
 */

use Yoast\WPTestUtils\WPIntegration;

require_once dirname( dirname( __DIR__ ) ) . '/vendor/yoast/wp-test-utils/src/WPIntegration/bootstrap-functions.php';

$_tests_dir = WPIntegration\get_path_to_wp_test_dir();

// Give access to tests_add_filter() function.
require_once $_tests_dir . 'includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	require dirname( dirname( __DIR__ ) ) . '/wp-seo.php';
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
	$plugin_dir = dirname( dirname( __DIR__ ) );
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

WPIntegration\bootstrap_it();
