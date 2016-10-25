<?php

class WPSEO_Admin_Banner_Renderer_Test extends WPSEO_UnitTestCase {


	/**
	 * Tests if the banner is rendered correctly.
	 *
	 * @covers WPSEO_Admin_Banner_Renderer::render
	 */
	public function test_render() {

		$admin_banner_renderer = new WPSEO_Admin_Banner_Renderer;

		$expected_output = '<a target="_blank" href="url"><img width="200" height="300" src="' . plugins_url( 'images/image.png', WPSEO_FILE ) . '" alt="alt"/></a><br/><br/>';
		$actual_output   = $admin_banner_renderer->render( new WPSEO_Admin_Banner( 'url', 'image.png', 'alt', 200, 300  ) );

		$this->assertEquals( $expected_output, $actual_output );

	}


}