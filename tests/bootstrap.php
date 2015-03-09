<?php

// disable xdebug backtrace
if ( function_exists( 'xdebug_disable' ) ) {
	xdebug_disable();
}

echo 'Welcome to the WordPress SEO Test Suite' . PHP_EOL;
echo 'Version: 1.0' . PHP_EOL . PHP_EOL;

$GLOBALS['wp_tests_options'] = array(
	'active_plugins' => array( 'wordpress-seo/wp-seo.php' ),
);

/**
 * Set up info needed for checking the status of a GitHub issue
 */
$GLOBALS['github_repo'] = array(
	'name'         => 'WPSEO',
	'organisation' => 'Yoast',
	'repo_slug'    => 'wordpress-seo',
	'api_key'      => false,
	'private'      => false,
);

if ( false !== getenv( 'GITHUB_API_KEY' ) ) {
	$GLOBALS['github_repo']['api_key'] = getenv( 'GITHUB_API_KEY' );
}

if ( ! defined( 'WP_TESTS_FORCE_KNOWN_BUGS' ) ) {
	if ( '1' == getenv( 'WP_TESTS_FORCE_KNOWN_BUGS' ) ) {
		define( 'WP_TESTS_FORCE_KNOWN_BUGS', true );
	} else {
		define( 'WP_TESTS_FORCE_KNOWN_BUGS', false );
	}
}

/**
 * Include the needed files
 */
if( false !== getenv( 'WP_DEVELOP_DIR' ) ) {
	require getenv( 'WP_DEVELOP_DIR' ) . 'tests/phpunit/includes/bootstrap.php';
}
else {
	require '../../../../tests/phpunit/includes/bootstrap.php';
}

// include unit test base class
require_once dirname( __FILE__ ) . '/framework/class-wpseo-unit-test-case.php';
require_once dirname( __FILE__ ) . '/framework/class-github.php'; // Issue management