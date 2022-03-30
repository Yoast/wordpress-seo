<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Wordpress_Seo
 */

use Yoast\WPTestUtils\WPIntegration;

require_once dirname( dirname( __DIR__ ) ) . '/vendor/yoast/wp-test-utils/src/WPIntegration/bootstrap-functions.php';


/* *****[ Ensure a couple of required files are present ]***** */

/**
 * Creates asset files.
 *
 * @throws RuntimeException If the directory or file creation failed.
 */
function create_required_asset_files() {
	$target_dir = dirname( dirname( __DIR__ ) ) . '/src/generated/assets';

	// phpcs:disable WordPress.PHP.NoSilencedErrors.Discouraged -- Silencing warnings when function fails.
	if ( @is_dir( $target_dir ) === false ) {
		if ( @mkdir( $target_dir, 0777, true ) === false ) {
			throw new RuntimeException( sprintf( 'Failed to create the %s directory.', $target_dir ) );
		}
	} // phpcs:enable WordPress

	$required_files = [
		'plugin.php'    => "<?php
return [
	'post-edit.js' => [
		'dependencies' => [],
		'version'      => 'test',
	],
	'installation-success.js' => [
		'dependencies' => [],
		'version'      => 'test',
	],
	'workouts.js' => [
		'dependencies' => [],
		'version'      => 'test',
	]
];
",
		'externals.php' => '<?php return [];',
		'languages.php' => '<?php return [];',
	];

	foreach ( $required_files as $file_name => $contents ) {
		$target_file = $target_dir . '/' . $file_name;
		if ( file_exists( $target_file ) === false ) {
			if ( file_put_contents( $target_file, $contents ) === false ) {
				throw new RuntimeException( sprintf( 'Failed to write to target location: %s', $target_file ) );
			}
		}
	}
}

create_required_asset_files();


/* *****[ Wire in the integration ]***** */

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
