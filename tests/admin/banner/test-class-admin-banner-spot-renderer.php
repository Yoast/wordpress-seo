<?php
/**
 * @package WPSEO\Tests\Admin\Banner
 */

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Banner_Spot_Renderer_Test extends WPSEO_UnitTestCase {

	/** @var  WPSEO_Admin_Banner_Spot_Renderer */
	protected $admin_banner_spot_renderer;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->admin_banner_spot_renderer = new WPSEO_Admin_Banner_Spot_Renderer();
	}

	/**
	 * Tests rendering with only a set title.
	 *
	 * @covers WPSEO_Admin_Banner_Spot_Renderer::render
	 */
	public function test_render_with_title_only() {
		$banner_spot = new WPSEO_Admin_Banner_Spot( 'Test spot' );

		$expected_output = '<div class="yoast-sidebar__spot"><strong>Test spot</strong></div>';
		$actual_output   = $this->admin_banner_spot_renderer->render( $banner_spot );

		$this->assertEquals( $expected_output, $actual_output );
	}

	/**
	 * Tests the rendering with a title and description being set.
	 */
	public function test_rendering_with_title_description_only() {
		$banner_spot = new WPSEO_Admin_Banner_Spot( 'Test spot' );
		$banner_spot->set_description( 'This is a test spot' );

		$expected_output = '<div class="yoast-sidebar__spot"><strong>Test spot</strong><p>This is a test spot</p></div>';
		$actual_output   = $this->admin_banner_spot_renderer->render( $banner_spot );

		$this->assertEquals( $expected_output, $actual_output );

	}

	/**
	 * Tests the rendering with banners being set.
	 *
	 * @covers WPSEO_Admin_Banner_Spot_Renderer::render
	 */
	public function test_render_with_banners() {
		$banner_spot = new WPSEO_Admin_Banner_Spot( 'Test spot' );
		$banner_spot->set_description( 'This is a test spot' );
		$banner_spot->add_banner( new WPSEO_Admin_Banner( 'url', 'image', 100, 100, 'alt' ) );

		$expected_output = '<div class="yoast-sidebar__spot"><strong>Test spot</strong><p>This is a test spot</p><a class="wpseo-banner__link" target="_blank" href=';
		$actual_output   = $this->admin_banner_spot_renderer->render( $banner_spot );

		$this->assertStringStartsWith( $expected_output, $actual_output );
	}

	/**
	 * Tests the rendering with banners being set and no description.
	 *
	 * @covers WPSEO_Admin_Banner_Spot_Renderer::render
	 */
	public function test_render_with_banners_without_description() {
		$banner_spot = new WPSEO_Admin_Banner_Spot( 'Test spot' );
		$banner_spot->add_banner( new WPSEO_Admin_Banner( 'url', 'image', 100, 100, 'alt' ) );

		$expected_output = '<div class="yoast-sidebar__spot"><strong>Test spot</strong><a class="wpseo-banner__link" target="_blank" href=';
		$actual_output   = $this->admin_banner_spot_renderer->render( $banner_spot );

		$this->assertStringStartsWith( $expected_output, $actual_output );
	}
}
