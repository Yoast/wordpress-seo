<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

// Disable xdebug backtrace.
if ( function_exists( 'xdebug_disable' ) ) {
	xdebug_disable();
}

echo 'Welcome to the Yoast SEO Test Suite' . PHP_EOL;
echo 'Version: 1.0' . PHP_EOL . PHP_EOL;

if ( false !== getenv( 'WP_PLUGIN_DIR' ) ) {
	define( 'WP_PLUGIN_DIR', getenv( 'WP_PLUGIN_DIR' ) );
}

if ( ! defined( 'YOAST_SEO_INDEXABLES' ) ) {
	define( 'YOAST_SEO_INDEXABLES', true );
}


$GLOBALS['wp_tests_options'] = array(
	'active_plugins' => array( 'wordpress-seo/wp-seo.php' ),
);

if ( false !== getenv( 'WP_DEVELOP_DIR' ) ) {
	require_once getenv( 'WP_DEVELOP_DIR' ) . 'tests/phpunit/includes/bootstrap.php';
}
else {
	require_once '../../../../tests/phpunit/includes/bootstrap.php';
}

if ( defined( 'WPSEO_TESTS_PATH' ) && WPSEO_TESTS_PATH !== dirname( __FILE__ ) . '/' ) {
	echo 'WPSEO_TESTS_PATH is already defined and does not match expected path.';
	exit( 1 ); // Exit with error code, to make the build fail.
}
define( 'WPSEO_TESTS_PATH', dirname( __FILE__ ) . '/' );

// Load autoloader.
if ( PHP_VERSION_ID <= 53000 ) {
	require_once dirname( WPSEO_TESTS_PATH ) . '/vendor/autoload_52.php';
}
else {
	require_once dirname( WPSEO_TESTS_PATH ) . '/vendor/autoload.php';
}
