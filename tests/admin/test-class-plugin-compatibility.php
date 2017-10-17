<?php

class WPSEO_Plugin_Compatibility_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Plugin_Compatibility
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		parent::setUp();

		$plugin_availability = new WPSEO_Plugin_Availability_Double();
		$plugin_availability->register();

		self::$class_instance = new WPSEO_Plugin_Compatibility( '3.3', $plugin_availability);
	}

	/**
	 * Tests whether or not a plugin is compatible.
	 */
	public function test_if_plugin_is_compatible() {
		$this->assertTrue( self::$class_instance->is_compatible( 'test-plugin' ) );
		$this->assertFalse( self::$class_instance->is_compatible( 'test-plugin-invalid-version' ) );
		$this->assertTrue( self::$class_instance->is_compatible( 'unavailable-test-plugin' ) );
	}

	/**
	 * Tests whether the plugin version detection is correct.
	 */
	public function test_plugin_version_matches() {
		$expected = array(
			'test-plugin' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Test Plugin',
				'description' => '',
				'version'     => '3.3',
				'installed'   => true,
				'compatible'  => true,
			),
			'test-plugin-dependency' => array(
				'url'           => 'https://yoast.com/',
				'title'         => 'Test Plugin With Dependency',
				'description'   => '',
				'version'       => '3.3',
				'installed'     => true,
				'_dependencies' => array( 'test-plugin' ),
				'compatible'    => true,
			),
			'test-plugin-invalid-version' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Test Plugin',
				'description' => '',
				'version'     => '1.3',
				'installed'   => true,
				'compatible'  => false,
			),
		);

		$this->assertEquals( self::$class_instance->get_installed_plugins_compatibility(), $expected );
	}

	public function test_WITHOUT_a_checker_object() {
		$class_instance = new WPSEO_Plugin_Compatibility( '3.3' );

		$this->assertFalse( $class_instance->is_compatible( 'test-plugin' ) );
	}

	public function test_get_installed_plugins() {
		$expected = array(
			'test-plugin' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Test Plugin',
				'description' => '',
				'version'     => '3.3',
				'installed'   => true,
			),
			'test-plugin-dependency' => array(
				'url'           => 'https://yoast.com/',
				'title'         => 'Test Plugin With Dependency',
				'description'   => '',
				'version'       => '3.3',
				'installed'     => true,
				'_dependencies' => array( 'test-plugin' ),
			),
			'test-plugin-invalid-version' => array(
				'url'         => 'https://yoast.com/',
				'title'       => 'Test Plugin',
				'description' => '',
				'version'     => '1.3',
				'installed'   => true,
			),
		);

		$this->assertEquals( $expected, self::$class_instance->get_installed_plugins() );
	}


}
