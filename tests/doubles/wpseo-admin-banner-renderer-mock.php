<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
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
