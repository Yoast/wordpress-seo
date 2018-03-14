<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Banner
 */

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Banner_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Admin_Banner
	 */
	protected $admin_banner;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->admin_banner = new WPSEO_Admin_Banner( 'url', 'image.png', 200, 300, 'alt' );
	}


	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner::__construct
	 */
	public function test_constructor() {
		$admin_banner = new WPSEO_Admin_Banner( 'target_url', 'the-image.png', 700, 900, 'the-alt' );

		$this->assertEquals( 'target_url', $admin_banner->get_url() );
		$this->assertEquals( 'the-image.png', $admin_banner->get_image() );
		$this->assertEquals( 'the-alt', $admin_banner->get_alt() );
		$this->assertEquals( 700, $admin_banner->get_width() );
		$this->assertEquals( 900, $admin_banner->get_height() );

	}

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner::get_url
	 */
	public function test_get_url() {
		$this->assertEquals( 'url', $this->admin_banner->get_url() );
	}

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner::get_image
	 */
	public function test_get_image() {
		$this->assertEquals( 'image.png', $this->admin_banner->get_image() );
	}

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner::get_alt
	 */
	public function test_get_alt() {
		$this->assertEquals( 'alt', $this->admin_banner->get_alt() );
	}

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner::get_width
	 */
	public function test_get_width() {
		$this->assertEquals( 200, $this->admin_banner->get_width() );
	}

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner::get_height
	 */
	public function test_get_height() {
		$this->assertEquals( 300, $this->admin_banner->get_height() );
	}

}
