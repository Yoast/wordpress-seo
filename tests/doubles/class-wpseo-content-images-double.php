<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Content_Images_Double extends WPSEO_Content_Images {

	/**
	 * @inheritdoc
	 */
	public function get_images_from_content( $content ) {
		return parent::get_images_from_content( $content );
	}
}
