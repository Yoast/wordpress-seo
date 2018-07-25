<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Indexable_Double extends WPSEO_Indexable {

	/**
	 * @inheritdoc
	 */
	public static function get_robots_noindex_value( $value ) {
		return parent::get_robots_noindex_value( $value );
	}

	/**
	 * @inheritdoc
	 */
	public function update( $data ) {
	}

	/**
	 * @inheritdoc
	 */
	public static function has_advanced_meta_value( $object_id, $value ) {
		return parent::has_advanced_meta_value( $object_id, $value );
	}

	/**
	 * Helper function to set data for testing.
	 *
	 * @param array $data The data to set.
	 *
	 * @return void
	 */
	public function set_data( $data ) {
		$this->data = $data;
	}
}
