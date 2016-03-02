<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Class WPSEO_Sitemaps_Test
 */
class WPSEO_Sitemaps_Cache_Data_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Sitemap_Cache_Data subject to test against.
	 */
	private $subject;

	/**
	 * Create subject instance
	 */
	public function setUp() {
		parent::setUp();
		$this->subject = new WPSEO_Sitemap_Cache_Data();
	}

	/**
	 * Test getting/setting sitemap
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::set_sitemap()
	 * @covers WPSEO_Sitemap_Cache_Data::get_sitemap()
	 */
	public function test_get_set_sitemap() {
		$sitemap = 'this is a sitemap';

		$this->subject->set_sitemap( $sitemap );
		$this->assertEquals( $sitemap, $this->subject->get_sitemap() );
	}

	/**
	 * Setting a sitemap that is not a string
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::get_sitemap()
	 * @covers WPSEO_Sitemap_Cache_Data::is_usable()
	 */
	public function test_set_sitemap_not_string() {
		$sitemap      = new StdClass();
		$sitemap->bla = 'hoi';

		$this->subject->set_sitemap( $sitemap );
		$this->assertEquals( '', $this->subject->get_sitemap() );
		$this->assertFalse( $this->subject->is_usable() );
	}

	/**
	 * Test with invalid status
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::get_status()
	 */
	public function test_set_invalid_status() {
		$status = 'bla';

		$this->subject->set_status( $status );
		$this->assertEquals( WPSEO_Sitemap_Cache_Data_Interface::UNKNOWN, $this->subject->get_status() );
		$this->assertFalse( $this->subject->is_usable() );
	}

	/**
	 * Test status of sitemap without setting anything
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::get_status()
	 */
	public function test_sitemap_status_unset() {
		$this->assertEquals( WPSEO_Sitemap_Cache_Data::UNKNOWN, $this->subject->get_status() );
	}

	/**
	 * Test setting empty sitemap - status
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::set_sitemap()
	 * @covers WPSEO_Sitemap_Cache_Data::get_status()
	 */
	public function test_set_empty_sitemap_status() {
		$sitemap = '';

		$this->subject->set_sitemap( $sitemap );
		$this->assertEquals( WPSEO_Sitemap_Cache_Data::ERROR, $this->subject->get_status() );
	}

	/**
	 * Test setting status boolean
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::get_status()
	 * @covers WPSEO_Sitemap_Cache_Data::is_usable()
	 */
	public function test_set_usable() {
		$this->subject->is_usable( true );
		$this->assertEquals( WPSEO_Sitemap_Cache_Data::OK, $this->subject->get_status() );

		$this->subject->is_usable( false );
		$this->assertEquals( WPSEO_Sitemap_Cache_Data::ERROR, $this->subject->get_status() );
	}

	/**
	 * Test to see if is_usable returns what we expect
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::is_usable()
	 */
	public function test_is_usable() {
		$this->assertFalse( $this->subject->is_usable() );

		$this->subject->is_usable( true );
		$this->assertTrue( $this->subject->is_usable() );

		$this->subject->is_usable( false );
		$this->assertFalse( $this->subject->is_usable() );
	}

	/**
	 * Test setting status string/constant
	 *
	 * @covers WPSEO_Sitemap_Cache_Data::set_status()
	 * @covers WPSEO_Sitemap_Cache_Data::get_status()
	 */
	public function test_set_status_string() {
		$this->subject->set_status( WPSEO_Sitemap_Cache_Data::OK );
		$this->assertEquals( WPSEO_Sitemap_Cache_Data::OK, $this->subject->get_status() );

		$this->subject->set_status( 'ok' );
		$this->assertEquals( WPSEO_Sitemap_Cache_Data::OK, $this->subject->get_status() );

		$this->subject->set_status( 'error' );
		$this->assertEquals( WPSEO_Sitemap_Cache_Data::ERROR, $this->subject->get_status() );
	}

	/**
	 * Test serializing/unserializing
	 */
	public function test_serialize_unserialize() {
		$sitemap = 'this is a sitemap';

		$this->subject->set_sitemap( $sitemap );

		$tmp  = serialize( $this->subject );
		$test = unserialize( $tmp );

		$this->assertEquals( $this->subject, $test );
	}

}
