<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Indexable
 */
abstract class WPSEO_Indexable {

	/**
	 * @var array The updateable fields.
	 */
	protected $updateable_fields = array();

	/**
	 * @var array The indexable's data.
	 */
	protected $data;

	/**
	 * @var array The available validators to run.
	 */
	protected $validators = array(
		'WPSEO_Object_Type_Validator',
		'WPSEO_Link_Validator',
		'WPSEO_Keyword_Validator',
		'WPSEO_Meta_Values_Validator',
		'WPSEO_OpenGraph_Validator',
		'WPSEO_Robots_Validator',
		'WPSEO_Twitter_Validator',
	);

	/**
	 * Indexable constructor.
	 *
	 * @param array $data The data to use to construct the indexable.
	 */
	public function __construct( $data ) {
		$this->validate_data( $data );

		$this->data = $data;
	}

	/**
	 * Converts the meta value to a boolean value.
	 *
	 * @param string $value The value to convert.
	 *
	 * @return bool|null The converted value.
	 */
	protected static function get_robots_noindex_value( $value ) {
		if ( $value === '1' ) {
			return true;
		}

		if ( $value === '2' ) {
			return false;
		}

		return null;
	}

	/**
	 * Determines whether the advanced robot metas value contains the passed value.
	 *
	 * @param int    $object_id The ID of the object to check.
	 * @param string $value     The name of the advanced robots meta value to look for.
	 *
	 * @return bool Whether or not the advanced robots meta values contains the passed string.
	 */
	protected static function has_advanced_meta_value( $object_id, $value ) {
		return strpos( WPSEO_Meta::get_value( 'meta-robots-adv', $object_id ), $value ) !== false;
	}

	/**
	 * Validates the data.
	 *
	 * @param array $data The data to validate.
	 *
	 * @return bool True if all validators have successfully validated.
	 */
	protected function validate_data( $data ) {
		foreach ( $this->validators as $validator ) {
			// This is necessary to run under PHP 5.2.
			$validator_instance = new $validator();

			$validator_instance->validate( $data );
		}

		return true;
	}

	/**
	 * Updates the data and returns a new instance.
	 *
	 * @param array $data The data to update into a new instance.
	 *
	 * @return WPSEO_Indexable A new instance with the updated data.
	 */
	abstract public function update( $data );

	/**
	 * Filters out data that isn't considered updateable and returns a valid dataset.
	 *
	 * @param array $data The dataset to filter.
	 *
	 * @return array The updateable dataset.
	 */
	public function filter_updateable_data( $data ) {
		return array_intersect_key( $data, array_flip( $this->updateable_fields ) );
	}

	/**
	 * Returns the data as an array.
	 *
	 * @return array The data as an array.
	 */
	public function to_array() {
		return $this->data;
	}
}
