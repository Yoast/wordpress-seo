<?php
/**
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Plugin_Availability_Double
 */
class WPSEO_Plugin_Availability_Double extends WPSEO_Plugin_Availability {

	/** @var array Mock dependencies. */
	private $available_dependencies = array( 'test-plugin', 'test-plugin-dependency' );

	/**
	 * Mock register all the available Yoast SEO plugins.
	 */
	public function register_yoast_plugins() {
		$this->plugins = array(
			'test-plugin' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Test Plugin',
				'description' => '',
				'version'     => '3.3',
				'installed'   => false,
				'version_sync' => true,
			),

			'test-plugin-dependency' => array(
				'url'           => 'https://yoast.com/',
				'title'         => 'Test Plugin With Dependency',
				'description'   => '',
				'version'       => '3.3',
				'installed'     => false,
				'_dependencies' => array( 'test-plugin' ),
				'version_sync' => true,
			),

			'unavailable-test-plugin' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Unavailable Test Plugin',
				'description' => '',
				'version'     => '3.3',
				'installed'   => false,
				'version_sync' => true,
			),

			'unavailable-test-plugin-dependency' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Test Plugin With Dependency',
				'description' => '',
				'version'     => '3.3',
				'installed'   => false,
				'version_sync' => true,
			),

			'test-plugin-no-version' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Test Plugin With No Version',
				'description' => '',
				'installed'   => false,
				'version_sync' => true,
			),

			'test-plugin-invalid-version' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Test Plugin',
				'description' => '',
				'version'     => '1.3',
				'installed'   => false,
				'version_sync' => true,
			),

			'test-plugin-non-version-synced' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Test Plugin',
				'description' => '',
				'version'     => '1.3',
				'installed'   => true,
				'version_sync' => false,
			),
		);
	}

	/**
	 * Sets certain plugin properties based on WordPress' status.
	 */
	protected function register_yoast_plugins_status() {
		$this->plugins['test-plugin']['installed'] = true;
		$this->plugins['test-plugin-dependency']['installed'] = true;
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
		return in_array( $dependency, $this->available_dependencies, true );
	}
}
