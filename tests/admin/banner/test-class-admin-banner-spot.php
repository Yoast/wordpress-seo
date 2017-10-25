<?php
/**
 * @package WPSEO\Tests\Admin\Banner
 */

/**
 * Test Helper Class.
 */
class WPSEO_Admin_Banner_Renderer_Mock extends WPSEO_Admin_Banner_Renderer {

	/**
	 * Overrides the render method to get a render method for the test.
	 *
	 * @param WPSEO_Admin_Banner $banner The mock banner to render.
	 *
	 * @return string
	 */
	public function render( WPSEO_Admin_Banner $banner ) {

		return sprintf(
			'url:%s|image:%s|width:%i|height:%i|alt:%s',
			$banner->get_url(),
			$banner->get_image(),
			$banner->get_width(),
			$banner->get_height(),
			$banner->get_alt()
		);
	}

}

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Banner_Spot_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::__construct
	 */
	public function test_constructor() {
		$admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title' );

		$this->assertEquals( 'title', $admin_banner_spot->get_title() );
	}

	/**
	 * Tests the url getter.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::get_title
	 */
	public function test_get_title() {
		$admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title' );

		$this->assertEquals( 'title', $admin_banner_spot->get_title() );
	}

	/**
	 * Tests the setter for the description
	 *
	 * @covers WPSEO_Admin_Banner_Spot::set_description
	 */
	public function test_set_description() {
		$admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title' );

		$admin_banner_spot->set_description( 'description' );

		$this->assertEquals( 'description', $admin_banner_spot->get_description() );
	}

	/**
	 * Tests the getter for the description.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::get_description
	 */
	public function test_get_description() {

		$admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title' );

		$admin_banner_spot->set_description( 'description' );

		$this->assertEquals( 'description', $admin_banner_spot->get_description() );
	}

	/**
	 * Tests the adding of a banner.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::add_banner
	 */
	public function test_add_banner() {
		$admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title' );
		$admin_banner      = new WPSEO_Admin_Banner( 'url', 'image', 100, 100, 'alt' );

		$admin_banner_spot->add_banner( $admin_banner );

		$this->assertTrue( $admin_banner_spot->has_banners() );
	}

	/**
	 * Tests if the spot has banners
	 *
	 * @covers WPSEO_Admin_Banner_Spot::has_banners
	 */
	public function test_has_banners() {
		$admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title' );

		$this->assertFalse( $admin_banner_spot->has_banners() );
	}

	/**
	 * Tests the render function without any banner being added.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::render_banner
	 */
	public function test_render_banner_without_banners_added() {
		$admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title' );

		$this->assertEquals( '', $admin_banner_spot->render_banner() );
	}

	/**
	 * Tests the render function with a banned added.
	 *
	 * Indirectly it covers also the protected get_random_banner method.
	 *
	 * @covers WPSEO_Admin_Banner_Spot::render_banner
	 * @covers WPSEO_Admin_Banner_Spot::get_random_banner
	 */
	public function test_render_banner_with_banners_added() {

		$admin_banner_spot = new WPSEO_Admin_Banner_Spot( 'title', new WPSEO_Admin_Banner_Renderer_Mock() );
		$admin_banner_spot->add_banner( new WPSEO_Admin_Banner( 'url', 'image', 100, 100, 'alt' ) );

		$this->assertNotEquals( 'url:url|image:image|width:100|height:100|alt:alt', $admin_banner_spot->render_banner() );
	}


}
