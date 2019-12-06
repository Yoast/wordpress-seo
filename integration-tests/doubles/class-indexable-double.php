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
	 * The updateable fields.
	 *
	 * @var array
	 */
	protected $updateable_fields = [
		'title',
		'description',
	];

	/**
	 * Converts the meta value to a boolean value.
	 *
	 * @param string $value The value to convert.
	 *
	 * @return bool|null The converted value.
	 */
	public static function get_robots_noindex_value( $value ) {
		return parent::get_robots_noindex_value( $value );
	}

	/**
	 * Updates the data and returns a new instance.
	 *
	 * @param array $data The data to update into a new instance.
	 */
	public function update( $data ) {
		// Is intentionally empty to make the abstract update function available.
	}

	/**
	 * Determines whether the advanced robot metas value contains the passed value.
	 *
	 * @param int    $object_id The ID of the object to check.
	 * @param string $value     The name of the advanced robots meta value to look for.
	 *
	 * @return bool Whether or not the advanced robots meta values contains the passed string.
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
