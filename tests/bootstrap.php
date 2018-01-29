<?php
/**
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

define( 'YOAST_ENVIRONMENT', 'production' );


$GLOBALS['wp_tests_options'] = array(
	'active_plugins' => array( 'wordpress-seo-premium/wp-seo-premium.php' ),
);

if ( false !== getenv( 'WP_DEVELOP_DIR' ) ) {
	require_once getenv( 'WP_DEVELOP_DIR' ) . 'tests/phpunit/includes/bootstrap.php';
}
else {
	require_once '../../../../tests/phpunit/includes/bootstrap.php';
}

define( 'WPSEO_TESTS_PATH', dirname( __FILE__ ) . '/' );

// Load autoloader.
if ( PHP_VERSION_ID <= 53000 ) {
	require_once dirname( WPSEO_TESTS_PATH ) . '/vendor/autoload_52.php';
} else {
	require_once dirname( WPSEO_TESTS_PATH ) . '/vendor/autoload.php';
}
