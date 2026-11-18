<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Admin;

use WPSEO_Plugin_Availability;
use Yoast\WP\SEO\Tests\WP\Doubles\Conditionals\True_Conditional_Double;

/**
 * Class Plugin_Availability_Double.
 */
final class Plugin_Availability_Double extends WPSEO_Plugin_Availability {

	/**
	 * Registers a variety of fake plugins to test against.
	 *
	 * @return void
	 */
	public function register_yoast_plugins() {
		$this->plugins = [
			'test-plugin' => [
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '3.3',
				'installed'    => true,
				'slug'         => 'test-plugin/test-plugin.php',
				'version_sync' => true,
			],

			'test-plugin-dependency' => [
				'url'           => 'http://example.com/',
				'title'         => 'Test Plugin With Dependency',
				'description'   => '',
				'version'       => '3.3',
				'installed'     => false,
				'_dependencies' => [
					'test-plugin' => [
						'conditional' => new True_Conditional_Double(),
					],
				],
				'slug'          => 'test-plugin-with-dependency/test-plugin-with-dependency.php',
			],

			'test-plugin-dependency-2' => [
				'url'           => 'http://example.com/',
				'title'         => 'Test Plugin With Dependency Part 2',
				'description'   => '',
				'version'       => '3.3',
				'installed'     => false,
				'_dependencies' => [
					'test-plugin' => [
						'conditional' => new True_Conditional_Double(),
					],
				],
				'slug'          => 'test-plugin-with-dependency-2/test-plugin-with-dependency-2.php',
			],

			'unavailable-test-plugin' => [
				'url'         => 'http://example.com/',
				'title'       => 'Unavailable Test Plugin',
				'description' => '',
				'version'     => '3.3',
				'installed'   => false,
				'slug'        => 'unavailable-test-plugin/unavailable-test-plugin.php',
			],

			'unavailable-test-plugin-dependency' => [
				'url'         => 'http://example.com/',
				'title'       => 'Test Plugin Without Dependency',
				'description' => '',
				'version'     => '3.3',
				'installed'   => false,
				'slug'        => 'test-plugin-without-dependency/test-plugin-without-dependency.php',
			],

			'test-plugin-no-version' => [
				'url'         => 'http://example.com/',
				'title'       => 'Test Plugin With No Version',
				'description' => '',
				'installed'   => false,
				'slug'        => 'test-plugin-with-no-version/test-plugin-with-no-version.php',
			],

			'test-plugin-invalid-version' => [
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '1.3',
				'installed'    => false,
				'slug'         => 'test-plugin-invalid-version/test-plugin-invalid-version.php',
				'compatible'   => false,
				'version_sync' => true,
			],

			'test-plugin-non-version-synced' => [
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '1.3',
				'installed'    => true,
				'version_sync' => false,
				'compatible'   => true,
			],
			'test-premium-plugin' => [
				'url'          => 'https://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '1.3',
				'installed'    => true,
				'version_sync' => false,
				'compatible'   => true,
				'premium'      => true,
			],
		];
	}

	/**
	 * Registers the fake installation status of a few of the test plugins.
	 *
	 * @return void
	 */
	protected function register_yoast_plugins_status() {
		$this->plugins['test-plugin']['installed']                 = true;
		$this->plugins['test-plugin-dependency']['installed']      = true;
		$this->plugins['test-plugin-invalid-version']['installed'] = true;
	}

	/**
	 * Determines whether or not a plugin is active.
	 *
	 * @param string $plugin The plugin slug to check.
	 *
	 * @return bool Whether or not the plugin is active.
	 */
	public function is_active( $plugin ) {
		return $plugin === 'test-plugin-with-dependency/test-plugin-with-dependency.php';
	}

	/**
	 * Helper function for integration tests.
	 *
	 * @param string $plugin The plugin to search for.
	 *
	 * @return array<string> The plugin properties.
	 */
	public function get_plugin( $plugin ) {
		if ( ! isset( $this->plugins[ $plugin ] ) ) {
			return [];
		}

		return $this->plugins[ $plugin ];
	}
}
