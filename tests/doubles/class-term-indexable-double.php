<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Term_Indexable_Double extends WPSEO_Term_Indexable {

	/**
	 * @inheritdoc
	 */
	public static function get_robots_noindex_value( $value ) {
		return parent::get_robots_noindex_value( $value );
	}
}
