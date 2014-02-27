<?php

echo "Welcome to the WordPress SEO Test Suite" . PHP_EOL;
echo "Version: 1.0" . PHP_EOL . PHP_EOL;

// load some helpful functions
require_once getenv( 'WP_TESTS_DIR' ) . '/includes/functions.php';

// Activates this plugin in WordPress so it can be tested.
function _manually_load_plugin() {
	require dirname( __FILE__ ) . '/../wp-seo.php';
}

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

$GLOBALS['wp_tests_options'] = array(
	'active_plugins' => array( 'wordpress-seo/wp-seo.php' ),
);

// fire up test suite
require_once getenv( 'WP_TESTS_DIR' ) . '/includes/bootstrap.php';

// include unit test base class
require_once dirname( __FILE__ ) . '/framework/class-wpseo-unit-test-case.php';