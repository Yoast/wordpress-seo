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
	 * @var array List of non-updateable fields.
	 */
	private $non_updateable_fields = array(
		'object_id',
		'object_type',
		'object_subtype',
		'created_at',
		'updated_at',
		'is_robots_nofollow',
		'is_robots_noarchive',
		'is_robots_noimageindex',
		'is_robots_nosnippet',
		'is_cornerstone',
		'link_count',
		'incoming_link_count',
	);

	/**
	 * Returns an array with data for the target object.
	 *
	 * @param integer $object_id The target object id.
	 *
	 * @return array The retrieved data.
	 * @throws Exception
	 */
	public function get( $object_id ) {
		if ( ! $this->is_indexable( $object_id ) ) {
			return array();
		}

		return WPSEO_Term_Indexable::from_object( $object_id );
	}

	/**
	 * Handles the patching of values for an existing indexable.
	 *
	 * @param int 	$object_id 		The ID of the object.
	 * @param array $requestdata 	The request data to store.
	 *
	 * @return void
	 * @throws Exception
	 */
	public function patch( $object_id, $requestdata ) {
		$indexable = $this->get( $object_id );

		if ( $indexable === array() ) {
			throw WPSEO_Invalid_Indexable_Exception::non_existing_indexable( $object_id );
		}

		$new_indexable    = $indexable->update( $requestdata );
		$stored_indexable = $this->store_indexable( $new_indexable );

		if ( $stored_indexable === true ) {
			return;
		}

		throw new \Exception( 'Patch failed' );
	}

	/**
	 * Stores the indexable object.
	 *
	 * @param WPSEO_Indexable $indexable The indexable object to store.
	 *
	 * @return bool True if the indexable object was successfully stored.
	 */
	protected function store_indexable( WPSEO_Indexable $indexable ) {
		$values 		   	= $indexable->to_array();
		$prepared_indexable = $this->prepare_indexable_data( $values );

		WPSEO_Taxonomy_Meta::set_values( $values['object_id'], $values['object_subtype'], $prepared_indexable );

		return true;
	}

	/**
	 * Prepares the indexable data to make it compatible with the database.
	 *
	 * @param array $indexable_data The indexable data to prepare.
	 *
	 * @return array The prepared indexable data.
	 */
	protected function prepare_indexable_data( $indexable_data ) {
		$prepared_values = array();

		$translated_values = $this->translate_indexable_data( $indexable_data );
		$updateable_values = $this->filter_updateable_values( $translated_values );

		foreach ( $updateable_values as $key => $updateable_value ) {
			$prepared_values['wpseo_' . $key] = $updateable_value;
		}

		return $prepared_values;
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
	 * Translates some of the indexable data to its database variant.
	 *
	 * @param array $indexable_data The indexable data to translate.
	 *
	 * @return array The translated indexable data.
	 */
	protected function translate_indexable_data( &$indexable_data ) {
		$translatable = array(
			'description' 		  		  => 'desc',
			'breadcrumb_title' 	  		  => 'bctitle',
			'og_title' 			  		  => 'opengraph-title',
			'og_description' 	  		  => 'opengraph-description',
			'og_image' 			  		  => 'opengraph-image',
			'twitter_title' 	  		  => 'twitter-title',
			'twitter_description' 		  => 'twitter-description',
			'twitter_image' 			  => 'twitter-image',
			'is_robots_noindex' 		  => 'noindex',
			'primary_focus_keyword' 	  => 'focuskw',
			'primary_focus_keyword_score' => 'linkdex',
			'readability_score' 		  => 'content_score',
		);

		if ( WPSEO_Validator::key_exists( $indexable_data, 'is_robots_noindex' ) ) {
			$indexable_data['is_robots_noindex'] = $this->translate_noindex( $indexable_data[ 'is_robots_noindex' ] );
		}

		foreach ( $translatable as $old_key => $new_key ) {
			if ( WPSEO_Validator::key_exists( $indexable_data, $old_key ) ) {
				$indexable_data[$new_key] = $indexable_data[$old_key];

				unset( $indexable_data[$old_key] );
			}
		}

		return $indexable_data;
	}

	/**
	 * Translates the noindex value to a database compatible one.
	 *
	 * @param bool $noindex The current noindex value.
	 *
	 * @return string|null The translated value.
	 */
	protected function translate_noindex( $noindex ) {
		if ( $noindex === 'false' ) {
			return 'noindex';
		}

		if ( $noindex === 'true' ) {
			return 'index';
		}

		return 'default';
	}

}
