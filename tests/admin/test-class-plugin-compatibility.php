<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 */
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

		self::$class_instance = new WPSEO_Plugin_Compatibility( '3.3', $plugin_availability );
	}

	/**
	 * Tests whether or not a plugin is compatible.
	 */
	public function test_if_plugin_is_compatible() {
		$this->assertTrue( self::$class_instance->is_compatible( 'test-plugin' ) );
		$this->assertFalse( self::$class_instance->is_compatible( 'test-plugin-invalid-version' ) );
		$this->assertTrue( self::$class_instance->is_compatible( 'unavailable-test-plugin' ) );

		$this->assertTrue( self::$class_instance->is_compatible( 'test-plugin-non-version-synced' ) );
	}

	/**
	 * Tests whether the plugin version detection is correct.
	 */
	public function test_plugin_version_matches() {
		$expected = array(
			'test-plugin' => array(
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '3.3',
				'installed'    => true,
				'version_sync' => true,
				'compatible'   => true,
				'slug'         => 'test-plugin/test-plugin.php',
			),
			'test-plugin-dependency' => array(
				'url'           => 'http://example.com/',
				'title'         => 'Test Plugin With Dependency',
				'description'   => '',
				'version'       => '3.3',
				'installed'     => true,
				'_dependencies' => array(
					'test-plugin' => array(
						'slug' => 'test-plugin/test-plugin.php',
					),
				),
				'compatible'    => true,
				'slug'          => 'test-plugin-with-dependency/test-plugin-with-dependency.php',
			),
			'test-plugin-invalid-version' => array(
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '1.3',
				'installed'    => true,
				'compatible'   => false,
				'slug'         => 'test-plugin-invalid-version/test-plugin-invalid-version.php',
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

		$this->assertEquals( self::$class_instance->get_installed_plugins_compatibility(), $expected );
	}

	public function test_WITHOUT_a_checker_object() {
		$class_instance = new WPSEO_Plugin_Compatibility( '3.3' );

		// If we cannot determine if the plugin should be synced; it is always marked as compatible.
		$this->assertTrue( $class_instance->is_compatible( 'test-plugin' ) );
	}

	public function test_get_installed_plugins() {
		$expected = array(
			'test-plugin' => array(
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '3.3',
				'installed'    => true,
				'slug'         => 'test-plugin/test-plugin.php',
				'version_sync' => true,
			),
			'test-plugin-dependency'         => array(
				'url'           => 'http://example.com/',
				'title'         => 'Test Plugin With Dependency',
				'description'   => '',
				'version'       => '3.3',
				'installed'     => true,
				'_dependencies' => array(
					'test-plugin' => array(
						'slug' => 'test-plugin/test-plugin.php',
					),
				),
				'slug'          => 'test-plugin-with-dependency/test-plugin-with-dependency.php',
			),
			'test-plugin-invalid-version' => array(
				'url'          => 'http://example.com/',
				'title'        => 'Test Plugin',
				'description'  => '',
				'version'      => '1.3',
				'installed'    => true,
				'slug'         => 'test-plugin-invalid-version/test-plugin-invalid-version.php',
				'version_sync' => true,
				'compatible'   => false,
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

		$this->assertEquals( $expected, self::$class_instance->get_installed_plugins() );
	}
}
