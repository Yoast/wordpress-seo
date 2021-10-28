<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test importing meta data from SEOPressor.
 *
 * @group imports
 */
class WPSEO_Import_Settings_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the class instance.
	 *
	 * @var WPSEO_Import_Settings_Double
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = new WPSEO_Import_Settings_Double();
	}

	/**
	 * Tests the plugin name function.
	 *
	 * @covers WPSEO_Import_Settings::parse_options
	 */
	public function test_parse_options_empty() {
		if ( version_compare( PHP_VERSION, '5.3', '<' ) ) {
			$this->markTestSkipped( 'Not possible in PHP 5.2' );
		}

		$this->class_instance->parse_options( '' );

		$this->assertEquals( false, $this->class_instance->status->status );
	}

	/**
	 * Tests the import functionality.
	 *
	 * @covers WPSEO_Import_Settings::parse_options
	 */
	public function test_parse_options() {
		if ( version_compare( PHP_VERSION, '5.3', '<' ) ) {
			$this->markTestSkipped( 'Not possible in PHP 5.2' );
		}

		$this->assertEquals( true, WPSEO_Options::get( 'enable_admin_bar_menu' ) );

		$settings = <<<'EO_DATA'
; These are settings for the Yoast SEO plugin by Yoast.com

[wpseo]
enable_admin_bar_menu = 0

EO_DATA;

		$this->class_instance->parse_options( $settings );

		$this->assertEquals( true, $this->class_instance->status->status );
		$this->assertEquals( false, WPSEO_Options::get( 'enable_admin_bar_menu' ) );
	}

	/**
	 * Tests the import functionality.
	 *
	 * @covers WPSEO_Import_Settings::parse_options
	 */
	public function test_parse_options_invalid() {
		if ( version_compare( PHP_VERSION, '5.3', '<' ) ) {
			$this->markTestSkipped( 'Not possible in PHP 5.2' );
		}

		$settings = <<<'EO_DATA'
Not a valid INI file format...
EO_DATA;

		$this->class_instance->parse_options( $settings );

		$this->assertEquals( false, $this->class_instance->status->status );
	}
}
