<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Class WPSEO_Plugin_Availability_Double
 */
class WPSEO_Plugin_Availability_Double extends WPSEO_Plugin_Availability {

	/**
	 * @var array Array containing fake dependency slugs.
	 */
	private $available_dependencies = array( 'test-plugin/test-plugin.php' );

	/**
	 * Registers a variety of fake plugins to test against.
	 *
	 * @return void
	 */
	public function register_yoast_plugins() {
		$this->plugins = array(
			'test-plugin' => array(
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '3.3',
				'installed'    => true,
				'slug'         => 'test-plugin/test-plugin.php',
				'version_sync' => true,
			),

			'test-plugin-dependency' => array(
				'url'           => 'http://example.com/',
				'title'         => 'Test Plugin With Dependency',
				'description'   => '',
				'version'       => '3.3',
				'installed'     => false,
				'_dependencies' => array(
					'test-plugin' => array(
						'slug' => 'test-plugin/test-plugin.php',
					),
				),
				'slug'          => 'test-plugin-with-dependency/test-plugin-with-dependency.php',
			),

			'test-plugin-dependency-2' => array(
				'url'           => 'http://example.com/',
				'title'         => 'Test Plugin With Dependency Part 2',
				'description'   => '',
				'version'       => '3.3',
				'installed'     => false,
				'_dependencies' => array(
					'test-plugin' => array(
						'slug' => 'test-plugin/test-plugin.php',
					),
				),
				'slug'          => 'test-plugin-with-dependency-2/test-plugin-with-dependency-2.php',
			),

			'unavailable-test-plugin' => array(
				'url'         => 'http://example.com/',
				'title'       => 'Unavailable Test Plugin',
				'description' => '',
				'version'     => '3.3',
				'installed'   => false,
				'slug'        => 'unavailable-test-plugin/unavailable-test-plugin.php',
			),

			'unavailable-test-plugin-dependency' => array(
				'url'         => 'http://example.com/',
				'title'       => 'Test Plugin Without Dependency',
				'description' => '',
				'version'     => '3.3',
				'installed'   => false,
				'slug'        => 'test-plugin-without-dependency/test-plugin-without-dependency.php',
			),

			'test-plugin-no-version' => array(
				'url'         => 'http://example.com/',
				'title'       => 'Test Plugin With No Version',
				'description' => '',
				'installed'   => false,
				'slug'        => 'test-plugin-with-no-version/test-plugin-with-no-version.php',
			),

			'test-plugin-invalid-version' => array(
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '1.3',
				'installed'    => false,
				'slug'         => 'test-plugin-invalid-version/test-plugin-invalid-version.php',
				'compatible'   => false,
				'version_sync' => true,
			),

			'test-plugin-non-version-synced' => array(
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '1.3',
				'installed'    => true,
				'version_sync' => false,
				'compatible'   => true,
			),
			'test-premium-plugin' => array(
				'url'          => 'https://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '1.3',
				'installed'    => true,
				'version_sync' => false,
				'compatible'   => true,
				'premium'      => true,
			),
		);
	}

	/**
	 * Registers the fake installation status of a few of the test plugins.
	 */
	protected function register_yoast_plugins_status() {
		$this->plugins['test-plugin']['installed']                 = true;
		$this->plugins['test-plugin-dependency']['installed']      = true;
		$this->plugins['test-plugin-invalid-version']['installed'] = true;
	}

	/**
	 * Checks whether a dependency is available.
	 *
	 * @param {string} $dependency The dependency to look for.
	 *
	 * @return bool Whether or not the dependency is available.
	 */
	public function is_dependency_available( $dependency ) {
		return in_array( $dependency['slug'], $this->available_dependencies, true );
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
}
