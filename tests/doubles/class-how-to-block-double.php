<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_How_To_Block_Double extends WPSEO_How_To_Block {
	/**
	 * @inheritdoc
	 */
	public function get_json_ld( array $attributes ) {
		return parent::get_json_ld( $attributes );
	}
}
