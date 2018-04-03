<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Banner
 */

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Banner_Renderer_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests if the banner is rendered correctly.
	 *
	 * @covers WPSEO_Admin_Banner_Renderer::render
	 */
	public function test_render() {

		$admin_banner_renderer = new WPSEO_Admin_Banner_Renderer();

		$expected_output = '<a class="wpseo-banner__link" target="_blank" href="http://url"><img class="wpseo-banner__image" width="200" height="300" src="/image.png" alt="alt"/></a>';
		$actual_output   = $admin_banner_renderer->render( new WPSEO_Admin_Banner( 'url', 'image.png', 200, 300, 'alt' ) );

		$this->assertEquals( $expected_output, $actual_output );

	}

	/**
	 * Tests the setting of the base path
	 *
	 * @covers WPSEO_Admin_Banner_Renderer::set_base_path()
	 * @covers WPSEO_Admin_Banner_Renderer::get_image_path()
	 * @
	 */
	public function test_set_base_path() {

		$admin_banner_renderer = new WPSEO_Admin_Banner_Renderer();
		$admin_banner_renderer->set_base_path( 'test_path' );

		$expected_output = '<a class="wpseo-banner__link" target="_blank" href="http://url"><img class="wpseo-banner__image" width="200" height="300" src="test_path/image.png" alt="alt"/></a>';
		$actual_output   = $admin_banner_renderer->render( new WPSEO_Admin_Banner( 'url', 'image.png', 200, 300, 'alt' ) );

		$this->assertEquals( $expected_output, $actual_output );
	}

}
