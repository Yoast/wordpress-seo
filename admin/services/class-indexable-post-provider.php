<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the indexable post service.
 */
class WPSEO_Indexable_Service_Post_Provider extends WPSEO_Indexable_Provider {

	/**
	 * List of fields that need to be renamed.
	 *
	 * @var array
	 */
	protected $renameable_fields = array(
		'description'                 => 'metadesc',
		'breadcrumb_title'            => 'bctitle',
		'og_title'                    => 'opengraph-title',
		'og_description'              => 'opengraph-description',
		'og_image'                    => 'opengraph-image',
		'twitter_title'               => 'twitter-title',
		'twitter_description'         => 'twitter-description',
		'twitter_image'               => 'twitter-image',
		'is_robots_noindex'           => 'meta-robots-noindex',
		'is_robots_nofollow'          => 'meta-robots-nofollow',
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
	 * @return array|WPSEO_Post_Indexable The retrieved data. Defaults to an array format.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception The invalid argument exception.
	 */
	public function get( $object_id, $as_object = false ) {
		if ( ! $this->is_indexable( $object_id ) ) {
			return array();
		}

		$indexable = WPSEO_Post_Indexable::from_object( $object_id );

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
	 * @throws WPSEO_Invalid_Indexable_Exception The invalid argument exception.
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

		throw WPSEO_REST_Request_Exception::patch( 'Post', $object_id );
	}

	/**
	 * Stores the indexable object.
	 *
	 * @param WPSEO_Indexable $indexable The indexable object to store.
	 *
	 * @return bool True if saving was successful.
	 */
	protected function store_indexable( WPSEO_Indexable $indexable ) {
		$values         = $this->convert_indexable_data( $indexable->to_array() );
		$renamed_values = $this->rename_indexable_data( $values );

		foreach ( $renamed_values as $key => $item ) {
			WPSEO_Meta::set_value( $key, $item, $values['object_id'] );
		}

		return true;
	}

	/**
	 * Checks if the given object id belongs to an indexable.
	 *
	 * @param int $object_id The object id.
	 *
	 * @return bool Whether the object id is indexable.
	 */
	public function is_indexable( $object_id ) {
		if ( get_post( $object_id ) === null ) {
			return false;
		}

		if ( wp_is_post_autosave( $object_id ) ) {
			return false;
		}

		if ( wp_is_post_revision( $object_id ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Converts some of the indexable data to its database variant.
	 *
	 * @param array $indexable_data The indexable data to convert.
	 *
	 * @return array The converted indexable data.
	 */
	protected function convert_indexable_data( $indexable_data ) {
		if ( WPSEO_Validator::key_exists( $indexable_data, 'is_robots_nofollow' ) ) {
			$indexable_data['is_robots_nofollow'] = $this->convert_nofollow( $indexable_data['is_robots_nofollow'] );
		}

		if ( WPSEO_Validator::key_exists( $indexable_data, 'is_robots_noindex' ) ) {
			$indexable_data['is_robots_noindex'] = $this->convert_noindex( $indexable_data['is_robots_noindex'] );
		}

		if ( WPSEO_Validator::key_exists( $indexable_data, 'is_cornerstone' ) ) {
			$indexable_data['is_cornerstone'] = $this->convert_cornerstone( $indexable_data['is_cornerstone'] );
		}

		$indexable_data['meta-robots-adv'] = $this->convert_advanced( $indexable_data );

		return $indexable_data;
	}

	/**
	 * Converts the cornerstone value to its database variant.
	 *
	 * @param string $cornerstone_value The cornerstone value.
	 *
	 * @return string The converted indexable cornerstone value.
	 */
	protected function convert_cornerstone( $cornerstone_value ) {
		if ( $cornerstone_value === 'true' ) {
			return '1';
		}

		return null;
	}

	/**
	 * Converts the advanced meta settings to its database variant.
	 *
	 * @param array $indexable_data The indeaxable data to convert the advanced meta settings from.
	 *
	 * @return string The converted advanced meta settings.
	 */
	protected function convert_advanced( &$indexable_data ) {
		$translated_advanced_data = array();

		if ( WPSEO_Validator::key_exists( $indexable_data, 'is_robots_nosnippet' ) && (bool) $indexable_data['is_robots_nosnippet'] === true ) {
			$translated_advanced_data[] = 'nosnippet';

			unset( $indexable_data['is_robots_nosnippet'] );
		}

		if ( WPSEO_Validator::key_exists( $indexable_data, 'is_robots_noarchive' ) && (bool) $indexable_data['is_robots_noarchive'] === true ) {
			$translated_advanced_data[] = 'noarchive';

			unset( $indexable_data['is_robots_noarchive'] );
		}

		if ( WPSEO_Validator::key_exists( $indexable_data, 'is_robots_noimageindex' ) && (bool) $indexable_data['is_robots_noimageindex'] === true ) {
			$translated_advanced_data[] = 'noimageindex';

			unset( $indexable_data['is_robots_noimageindex'] );
		}

		return implode( ',', $translated_advanced_data );
	}

	/**
	 * Converts the nofollow value to a database compatible one.
	 *
	 * @param bool $nofollow The current nofollow value.
	 *
	 * @return string The converted value.
	 */
	protected function convert_nofollow( $nofollow ) {
		if ( $nofollow === 'true' ) {
			return '1';
		}

		return '0';
	}

	/**
	 * Converts the noindex value to a database compatible one.
	 *
	 * @param string $noindex The current noindex value.
	 *
	 * @return string|null The converted value.
	 */
	protected function convert_noindex( $noindex ) {
		if ( $noindex === 'false' ) {
			return '2';
		}

		if ( $noindex === 'true' ) {
			return '1';
		}

		return null;
	}
}
