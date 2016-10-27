<?php

class WPSEO_Admin_Banner_Spot_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Admin_Banner_Spot
	 */
	protected $admin_banner_spot;

	public function setUp() {
		parent::setUp();

		$this->admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title', 'description' );
	}

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::__construct
	 */
	public function test_constructor() {
		$admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title', 'description' );

		$this->assertEquals( 'title', $admin_banner_spot->get_title() );
		$this->assertEquals( 'description', $admin_banner_spot->get_description() );
	}

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::get_title
	 */
	public function test_get_title() {
		$this->assertEquals( 'title', $this->admin_banner_spot->get_title() );
	}

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::get_description
	 */
	public function test_get_description() {
		$this->assertEquals( 'description', $this->admin_banner_spot->get_description() );
	}

	/**
	 * Tests the adding of a banner.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::add_banner
	 */
	public function test_add_banner() {

		$banner = new WPSEO_Admin_Banner( 'url', 'image', 'alt', 100, 100 );

		$this->admin_banner_spot->add_banner( $banner );

		$this->assertTrue( in_array( $banner, $this->admin_banner_spot->get_banners() ) );
	}

	/**
	 * Testa the getting of the admin banners.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::get_banners
	 */
	public function test_get_banners() {
		$this->assertTrue( is_array( $this->admin_banner_spot->get_banners() ) );
	}



}