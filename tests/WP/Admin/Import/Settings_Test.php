<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Import;

use WPSEO_Options;
use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Import_Settings_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Test importing meta data from SEOPressor.
 *
 * @group imports
 */
final class Settings_Test extends TestCase {

	/**
	 * Holds the class instance.
	 *
	 * @var Import_Settings_Double
	 */
	private $class_instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->class_instance = new Import_Settings_Double();
	}

	/**
	 * Tests the plugin name function.
	 *
	 * @covers WPSEO_Import_Settings::parse_options
	 *
	 * @return void
	 */
	public function test_parse_options_empty() {
		$this->class_instance->parse_options( '' );

		$this->assertEquals( false, $this->class_instance->status->status );
	}

	/**
	 * Tests the import functionality.
	 *
	 * @covers WPSEO_Import_Settings::parse_options
	 *
	 * @return void
	 */
	public function test_parse_options() {
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
	 *
	 * @return void
	 */
	public function test_parse_options_invalid() {
		$settings = <<<'EO_DATA'
Not a valid INI file format...
EO_DATA;

		$this->class_instance->parse_options( $settings );

		$this->assertEquals( false, $this->class_instance->status->status );
	}
}
