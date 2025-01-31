<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Wordpress_Seo
 */

namespace Yoast\WP\SEO\Tests\WP;

use RuntimeException;
use Yoast\WPTestUtils\WPIntegration;

require_once \dirname( __DIR__, 2 ) . '/vendor/yoast/wp-test-utils/src/WPIntegration/bootstrap-functions.php';


/* *****[ Ensure a couple of required files are present ]***** */

/**
 * Creates asset and block files.
 *
 * @return void
 *
 * @throws RuntimeException If the directory or file creation failed.
 */
function yoast_seo_create_asset_files_for_tests() {
	$base_dir       = \dirname( __DIR__, 2 );
	$required_files = [
		'src/generated/assets/plugin.php'                 => "<?php
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
	],
];
",
		'src/generated/assets/externals.php'              => '<?php return [];',
		'src/generated/assets/languages.php'              => '<?php return [];',
		'blocks/dynamic-blocks/breadcrumbs/block.json'    => '{}',
		'blocks/structured-data-blocks/faq/block.json'    => '{}',
		'blocks/structured-data-blocks/how-to/block.json' => '{}',
	];

	foreach ( $required_files as $file_path => $contents ) {
		$file_path = $base_dir . '/' . $file_path;
		if ( \file_exists( $file_path ) === true ) {
			continue;
		}

		// phpcs:disable WordPress.PHP.NoSilencedErrors.Discouraged -- Silencing warnings when function fails.
		$target_dir = \dirname( $file_path );
		if ( @\is_dir( $target_dir ) === false ) {
			if ( @\mkdir( $target_dir, 0777, true ) === false ) {
				throw new RuntimeException( \sprintf( 'Failed to create the %s directory.', $target_dir ) );
			}
		} // phpcs:enable WordPress

		if ( \file_put_contents( $file_path, $contents ) === false ) {
			throw new RuntimeException( \sprintf( 'Failed to write to target location: %s', $file_path ) );
		}
	}
}

namespace\yoast_seo_create_asset_files_for_tests();


/* *****[ Wire in the integration ]***** */

$_tests_dir = WPIntegration\get_path_to_wp_test_dir();

// Give access to tests_add_filter() function.
require_once $_tests_dir . 'includes/functions.php';

// Add plugin to active mu-plugins - to make sure it gets loaded.
\tests_add_filter(
	'muplugins_loaded',
	/**
	 * Manually load the plugin being tested.
	 */
	static function () {
		require \dirname( __DIR__, 2 ) . '/wp-seo.php';
	}
);

// Overwrite the plugin URL to not include the full path.
\tests_add_filter(
	'plugins_url',
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
	static function ( $url, $path, $plugin ) {
		$plugin_dir = \dirname( __DIR__, 2 );
		if ( $plugin === $plugin_dir . '/wp-seo.php' ) {
			$url = \str_replace( \dirname( $plugin_dir ), '', $url );
		}

		return $url;
	},
	10,
	3
);

// Make sure the tests never register as being in development mode.
\tests_add_filter( 'yoast_seo_development_mode', '__return_false' );

/* *****[ Yoast SEO specific configuration ]***** */

if ( ! \defined( 'YOAST_ENVIRONMENT' ) ) {
	\define( 'YOAST_ENVIRONMENT', 'test' );
}

if ( ! \defined( 'YOAST_SEO_INDEXABLES' ) ) {
	\define( 'YOAST_SEO_INDEXABLES', true );
}

if ( \defined( 'WPSEO_TESTS_PATH' ) && \WPSEO_TESTS_PATH !== __DIR__ . '/' ) {
	echo 'WPSEO_TESTS_PATH is already defined and does not match expected path.';
	exit( 1 ); // Exit with error code, to make the build fail.
}
\define( 'WPSEO_TESTS_PATH', __DIR__ . '/' );

WPIntegration\bootstrap_it();
