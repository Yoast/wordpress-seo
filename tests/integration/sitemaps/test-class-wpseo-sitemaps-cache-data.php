<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Sitemaps_Test.
 *
 * @group sitemaps
 */
class WPSEO_Sitemaps_Cache_Data_Test extends WPSEO_UnitTestCase {

	/**
	 * Subject to test against.
	 *
	 * @var WPSEO_Sitemap_Cache_Data
	 */
	private $subject;

	/**
	 * Create subject instance.
	 */
	public function set_up() {
		parent::set_up();
		$this->subject = new WPSEO_Sitemap_Cache_Data();
	}

	/**
	 * Test getting/setting sitemap.
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::set_sitemap
	 * @covers WPSEO_Sitemap_Cache_Data::get_sitemap
	 */
	public function test_get_set_sitemap() {
		$sitemap = 'this is a sitemap';

		$this->subject->set_sitemap( $sitemap );
		$this->assertSame( $sitemap, $this->subject->get_sitemap() );
	}

	/**
	 * Setting a sitemap that is not a string.
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::get_sitemap
	 * @covers WPSEO_Sitemap_Cache_Data::is_usable
	 */
	public function test_set_sitemap_not_string() {
		$sitemap         = new stdClass();
		$sitemap->doesnt = 'matter';

		$this->subject->set_sitemap( $sitemap );
		$this->assertSame( '', $this->subject->get_sitemap() );
		$this->assertFalse( $this->subject->is_usable() );
	}

	/**
	 * Test with invalid status.
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::get_status
	 */
	public function test_set_invalid_status() {
		$status = 'invalid';

		$this->subject->set_status( $status );
		$this->assertSame( WPSEO_Sitemap_Cache_Data_Interface::UNKNOWN, $this->subject->get_status() );
		$this->assertFalse( $this->subject->is_usable() );
	}

	/**
	 * Test status of sitemap without setting anything.
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::get_status
	 */
	public function test_sitemap_status_unset() {
		$this->assertSame( WPSEO_Sitemap_Cache_Data::UNKNOWN, $this->subject->get_status() );
	}

	/**
	 * Test setting empty sitemap - status.
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::set_sitemap
	 * @covers WPSEO_Sitemap_Cache_Data::get_status
	 */
	public function test_set_empty_sitemap_status() {
		$sitemap = '';

		$this->subject->set_sitemap( $sitemap );
		$this->assertSame( WPSEO_Sitemap_Cache_Data::ERROR, $this->subject->get_status() );
	}

	/**
	 * Test is_usable with status.
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::get_status
	 * @covers WPSEO_Sitemap_Cache_Data::is_usable
	 */
	public function test_set_status_is_usable() {
		$this->subject->set_status( WPSEO_Sitemap_Cache_Data::OK );
		$this->assertTrue( $this->subject->is_usable() );

		$this->subject->set_status( WPSEO_Sitemap_Cache_Data::ERROR );
		$this->assertFalse( $this->subject->is_usable() );
	}

	/**
	 * Test setting status string/constant.
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::set_status
	 * @covers WPSEO_Sitemap_Cache_Data::get_status
	 *
	 * @dataProvider data_set_status_string
	 *
	 * @param string $input    Input to pass to set_status().
	 * @param string $expected Expected get_status() function output.
	 */
	public function test_set_status_string( $input, $expected ) {
		$this->subject->set_status( $input );
		$this->assertSame( $expected, $this->subject->get_status() );
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public function data_set_status_string() {
		return [
			'Ok using interface constant' => [
				'input'    => WPSEO_Sitemap_Cache_Data::OK,
				'expected' => WPSEO_Sitemap_Cache_Data::OK,
			],
			'Ok using hard coded string' => [
				'input'    => 'ok',
				'expected' => WPSEO_Sitemap_Cache_Data::OK,
			],
			'Error using hard coded string' => [
				'input'    => 'error',
				'expected' => WPSEO_Sitemap_Cache_Data::ERROR,
			],
		];
	}

	/**
	 * Test serializing/unserializing.
	 *
	 * Tests if the class is serializable.
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::__serialize
	 * @covers WPSEO_Sitemap_Cache_Data::__unserialize
	 * @covers WPSEO_Sitemap_Cache_Data::serialize
	 * @covers WPSEO_Sitemap_Cache_Data::unserialize
	 */
	public function test_serialize_unserialize() {
		$sitemap = 'this is a sitemap';

		$this->subject->set_sitemap( $sitemap );

		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize -- Reason: There's no way for user input to get in between serialize and unserialize.
		$tmp = serialize( $this->subject );
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_unserialize -- Reason: There's no way for user input to get in between serialize and unserialize.
		$test = unserialize( $tmp );

		$this->assertEquals( $this->subject, $test );
	}
}
