<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the indexable term service.
 */
class WPSEO_Indexable_Service_Term_Provider extends WPSEO_Indexable_Provider {

	/**
	 * List of fields that need to be renamed.
	 *
	 * @var array
	 */
	protected $renameable_fields = array(
		'description'                 => 'desc',
		'breadcrumb_title'            => 'bctitle',
		'og_title'                    => 'opengraph-title',
		'og_description'              => 'opengraph-description',
		'og_image'                    => 'opengraph-image',
		'twitter_title'               => 'twitter-title',
		'twitter_description'         => 'twitter-description',
		'twitter_image'               => 'twitter-image',
		'is_robots_noindex'           => 'noindex',
		'primary_focus_keyword'       => 'focuskw',
		'primary_focus_keyword_score' => 'linkdex',
		'readability_score'           => 'content_score',
	);

	/**
	 * Returns an array with data for the target object.
	 *
	 * @param integer $object_id The target object id.
	 * @param bool    $as_object Optional. Whether or not to return the indexable
	 *                           as an object. Defaults to false.
	 *
	 * @return array|WPSEO_Term_Indexable The retrieved data. Defaults to an array format.
	 */
	public function get( $object_id, $as_object = false ) {
		if ( ! $this->is_indexable( $object_id ) ) {
			return array();
		}

		$indexable = WPSEO_Term_Indexable::from_object( $object_id );

		if ( $as_object === true ) {
			return $indexable;
		}

		return $indexable->to_array();
	}

	/**
	 * Handles the patching of values for an existing indexable.
	 *
	 * @param int   $object_id   The ID of the object.
	 * @param array $requestdata The request data to store.
	 *
	 * @return array The patched indexable.
	 *
	 * @throws WPSEO_Invalid_Indexable_Exception The indexable exception.
	 * @throws WPSEO_REST_Request_Exception      Exception that is thrown if patching the object has failed.
	 */
	public function patch( $object_id, $requestdata ) {
		$indexable = $this->get( $object_id, true );

		if ( $indexable === array() ) {
			throw WPSEO_Invalid_Indexable_Exception::non_existing_indexable( $object_id );
		}

		$new_indexable    = $indexable->update( $requestdata );
		$stored_indexable = $this->store_indexable( $new_indexable );

		if ( $stored_indexable === true ) {
			return $new_indexable->to_array();
		}

		throw WPSEO_REST_Request_Exception::patch( 'Term', $object_id );
	}

	/**
	 * Stores the indexable object.
	 *
	 * @param WPSEO_Indexable $indexable The indexable object to store.
	 *
	 * @return bool True if the indexable object was successfully stored.
	 */
	protected function store_indexable( WPSEO_Indexable $indexable ) {
		$values          = $this->convert_indexable_data( $indexable->to_array() );
		$renamed_values  = $this->rename_indexable_data( $values );
		$prefixed_values = $this->prefix_indexable_data( $renamed_values );

		WPSEO_Taxonomy_Meta::set_values( $values['object_id'], $values['object_subtype'], $prefixed_values );

		return true;
	}

	/**
	 * Prefixes the indexable data to make it compatible with the database.
	 *
	 * @param array $indexable_data The indexable data to prefix.
	 *
	 * @return array The compatible indexable data.
	 */
	protected function prefix_indexable_data( $indexable_data ) {
		$converted_data = array();

		foreach ( $indexable_data as $key => $item ) {
			if ( substr( strtolower( $key ), 0, 6 ) !== 'wpseo_' ) {
				$key = 'wpseo_' . $key;
			}

			$converted_data[ $key ] = $item;
		}

		return $converted_data;
	}

	/**
	 * Converts the indexable data to make it compatible with the database.
	 *
	 * @param array $indexable_data The indexable data to prepare.
	 *
	 * @return array The converted indexable data.
	 */
	protected function convert_indexable_data( $indexable_data ) {
		if ( WPSEO_Validator::key_exists( $indexable_data, 'is_robots_noindex' ) ) {
			$indexable_data['is_robots_noindex'] = $this->convert_noindex( $indexable_data['is_robots_noindex'] );
		}

		return $indexable_data;
	}

	/**
	 * Checks if the given object id belongs to an indexable.
	 *
	 * @param int $object_id The object id.
	 *
	 * @return bool Whether the object id is indexable.
	 */
	public function is_indexable( $object_id ) {
		$term = get_term( $object_id );

		return ( $term !== null && ! is_wp_error( $term ) );
	}

	/**
	 * Converts the noindex value to a database compatible one.
	 *
	 * @param bool $noindex The current noindex value.
	 *
	 * @return string|null The converted value.
	 */
	protected function convert_noindex( $noindex ) {
		if ( $noindex === 'false' ) {
			return 'index';
		}

		if ( $noindex === 'true' ) {
			return 'noindex';
		}

		return 'default';
	}
}
