<?php

/**
 * Class WPSEO_Plugin_Availability_Double
 */
class WPSEO_Plugin_Availability_Double extends WPSEO_Plugin_Availability {

	private $available_dependencies = array( 'test-plugin', 'test-plugin-dependency' );

	public function register_yoast_plugins() {
		$this->plugins = array(
			'test-plugin' => array(
				'url' => 'https://yoast.com/',
				'title' => 'Test Plugin',
				'description' => '',
				'version' => '3.3',
				'installed' => false,
			),

			'test-plugin-dependency' => array(
				'url' => 'https://yoast.com/',
				'title' => 'Test Plugin With Dependency',
				'description' => '',
				'version' => '3.3',
				'installed' => false,
				'_dependencies' => array( 'test-plugin' )
			),

			'unavailable-test-plugin' => array(
				'url' => 'https://yoast.com/',
				'title' => 'Unavailable Test Plugin',
				'description' => '',
				'version' => '3.3',
				'installed' => false,
			),

			'unavailable-test-plugin-dependency' => array(
				'url' => 'https://yoast.com/',
				'title' => 'Test Plugin With Dependency',
				'description' => '',
				'version' => '3.3',
				'installed' => false,
			),

			'test-plugin-no-version' => array(
				'url' => 'https://yoast.com/',
				'title' => 'Test Plugin With No Version',
				'description' => '',
				'installed' => false,
			),

			'test-plugin-invalid-version' => array(
				'url' => 'https://yoast.com/',
				'title' => 'Test Plugin',
				'description' => '',
				'version' => '1.3',
				'installed' => false,
			),
		);
	}

	protected function register_yoast_plugins_status() {
		$this->plugins[ 'test-plugin' ]['installed'] = true;
		$this->plugins[ 'test-plugin-dependency' ]['installed'] = true;
		$this->plugins[ 'test-plugin-invalid-version' ]['installed'] = true;
	}

	public function is_dependency_available( $dependency ) {
		return in_array( $dependency, $this->available_dependencies );
	}
}
