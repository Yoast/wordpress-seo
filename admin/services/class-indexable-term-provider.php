<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the indexable term service.
 */
class WPSEO_Indexable_Service_Term_Provider implements WPSEO_Indexable_Service_Provider {

	/**
	 * @var array List of fields that need to be renamed.
	 */
	private $renameable_fields = array(
		'description'				  => 'desc',
		'breadcrumb_title'			  => 'bctitle',
		'og_title'					  => 'opengraph-title',
		'og_description'			  => 'opengraph-description',
		'og_image'					  => 'opengraph-image',
		'twitter_title'				  => 'twitter-title',
		'twitter_description'		  => 'twitter-description',
		'twitter_image'				  => 'twitter-image',
		'is_robots_noindex'			  => 'noindex',
		'primary_focus_keyword'		  => 'focuskw',
		'primary_focus_keyword_score' => 'linkdex',
		'readability_score'			  => 'content_score',
	);

	/**
	 * Returns an array with data for the target object.
	 *
	 * @param integer $object_id The target object id.
	 * @param bool    $as_object Optional. Whether or not to return the indexable as an object. Defaults to false.
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
	 * @return void
	 *
	 * @throws WPSEO_Invalid_Indexable_Exception The indexable exception.
	 * @throws Exception 						 Exception that is thrown if patching the object has failed.
	 */
	public function patch( $object_id, $requestdata ) {
		$indexable = $this->get( $object_id, true );

		if ( $indexable === array() ) {
			throw WPSEO_Invalid_Indexable_Exception::non_existing_indexable( $object_id );
		}

		$new_indexable    = $indexable->update( $requestdata );
		$stored_indexable = $this->store_indexable( $new_indexable );

		if ( $stored_indexable === true ) {
			return;
		}

		throw new Exception(
			sprintf(
				/* translators: %1$s expands to 'Term'. %2$s resolved to the object ID. */
				__( '%1$s with ID %2$s couldn\'t be patched', 'wordpress-seo' ),
				'Term',
				$object_id
			)
		);
	}

	/**
	 * Stores the indexable object.
	 *
	 * @param WPSEO_Indexable $indexable The indexable object to store.
	 *
	 * @return bool True if the indexable object was successfully stored.
	 */
	protected function store_indexable( WPSEO_Indexable $indexable ) {
		$values 			= $indexable->to_array();
		$prepared_indexable = $this->convert_indexable_data( $values );

		WPSEO_Taxonomy_Meta::set_values( $values['object_id'], $values['object_subtype'], $prepared_indexable );

		return true;
	}

	/**
	 * Converts the indexable data to make it compatible with the database.
	 *
	 * @param array $indexable_data The indexable data to prepare.
	 *
	 * @return array The converted indexable data.
	 */
	protected function convert_indexable_data( $indexable_data ) {
		$converted_values  = array();

		if ( WPSEO_Validator::key_exists( $indexable_data, 'is_robots_noindex' ) ) {
			$indexable_data['is_robots_noindex'] = $this->convert_noindex( $indexable_data['is_robots_noindex'] );
		}

		$updateable_values = $this->rename_indexable_data( $indexable_data );

		foreach ( $updateable_values as $key => $updateable_value ) {
			$converted_values[ 'wpseo_' . $key ] = $updateable_value;
		}

		return $converted_values;
	}

	/**
	 * Filters out any non-updateable values.
	 *
	 * @param array $values The values to filter.
	 *
	 * @return array The filtered out values that are considered updateable.
	 */
	protected function filter_updateable_values( $values ) {
		return array_diff_key( $values, array_flip( $this->non_updateable_fields ) );
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
	 * Renames and converts some of the indexable data to its database variant.
	 *
	 * @param array $indexable_data The indexable data to rename and convert.
	 *
	 * @return array The renamed and converted indexable data.
	 */
	protected function rename_indexable_data( &$indexable_data ) {
		foreach ( $this->renameable_fields as $old_key => $new_key ) {
			if ( WPSEO_Validator::key_exists( $indexable_data, $old_key ) ) {
				$indexable_data[ $new_key ] = $indexable_data[ $old_key ];

				unset( $indexable_data[ $old_key ] );
			}
		}

		return $indexable_data;
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
