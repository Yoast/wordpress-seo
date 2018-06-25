<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the indexable post service.
 */
class WPSEO_Indexable_Service_Post_Provider implements WPSEO_Indexable_Service_Provider {

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

		$link_count = new WPSEO_Link_Column_Count();
		$link_count->set( array( $object_id ) );

		$indexable = new Indexable(
			(int) $object_id,
			new Object_Type( 'post', get_post_type( $object_id ) ),
			new Meta_Values(
				$this->get_meta_value( 'title', $object_id ),
				$this->get_meta_value( 'metadesc', $object_id ),
				get_permalink( $object_id ),
				(int) $this->get_meta_value( 'content_score', $object_id ),
				$this->get_meta_value( 'is_cornerstone', $object_id ) === '1',
				$this->get_meta_value( 'canonical', $object_id ),
				$this->get_meta_value( 'bctitle', $object_id )
			),
			new OpenGraph(
				$this->get_meta_value( 'opengraph-title', $object_id ),
				$this->get_meta_value( 'opengraph-description', $object_id ),
				$this->get_meta_value( 'opengraph-image', $object_id )
			),
			new Twitter(
				$this->get_meta_value( 'twitter-title', $object_id ),
				$this->get_meta_value( 'twitter-description', $object_id ),
				$this->get_meta_value( 'twitter-image', $object_id )
			),
			new Robots(
				$this->get_meta_value( 'meta-robots-nofollow', $object_id ) === '1',
				$this->has_advanced_meta_value( $object_id, 'noarchive' ),
				$this->has_advanced_meta_value( $object_id, 'noimageindex' ),
				$this->has_advanced_meta_value( $object_id, 'nosnippet' ),
				$this->get_robots_noindex_value( $this->get_meta_value( 'meta-robots-noindex', $object_id ) )
			),
			new WPSEO_Keyword(
				$this->get_meta_value( 'focuskw', $object_id ),
				(int) $this->get_meta_value( 'linkdex', $object_id )
			),
			new Link(
				(int) $link_count->get( $object_id ),
				(int) $link_count->get( $object_id, 'incoming_link_count' )
			),
			null,
			null
		);

		return $indexable->to_array();
	}

	/**
	 * Handles the saving of the indexable parameters.
	 *
	 * @param Indexable $indexable The indexable object to parse and save.
	 *
	 * @return WP_REST_Response The REST API response. Can be an error if the object does not exist.
	 */
	public function post( Indexable $indexable ) {
		$items 	   = $indexable->to_array();
		$object_id = $items['object_id'];

		if ( ! $this->is_indexable( $object_id ) ) {
			$exception = WPSEO_Invalid_Indexable_Exception::non_existing_indexable( $object_id );

			return new WP_REST_Response( $exception->getMessage(), 500 );
		}

		// First validate that we don't already have these values
		if ( $this->is_valid_post_request( $indexable ) === false ) {
			$exception = WPSEO_Invalid_Indexable_Exception::invalid_post_request( $object_id );

			return new WP_REST_Response( $exception->getMessage(), 500 );
		}

		$this->store_indexable( $indexable );

		return new WP_REST_Response( 'Indexable parameters were successfully saved', 200 );
	}

	/**
	 * Stores the indexable object.
	 *
	 * @param Indexable $indexable The indexable object to store.
	 *
	 * @return void
	 */
	protected function store_indexable( Indexable $indexable ) {
		$values = $indexable->to_array();

		foreach ( $values as $key => $item ) {
			if ( $key === 'object_id' || empty( $item ) ) {
				continue;
			}

			$this->set_meta_value( $key, $item, $values['object_id'] );
		}
	}

	/**
	 * Validates if the Indexable is considered valid for a POST request.
	 *
	 * @param Indexable $indexable The indexable to validate.
	 *
	 * @return bool Whether or not the Indexable can be considered valid for a POST request.
	 */
	protected function is_valid_post_request( Indexable $indexable ) {
		$values = $indexable->to_array();

		foreach ( $values as $key => $item ) {
			if ( $key === 'object_id' || empty( $item ) ) {
				continue;
			}

			if ( $this->get_meta_value( $key, $values['object_id'] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Determines whether the advanced robot metas value contains the passed value.
	 *
	 * @param int 	 $object_id	The ID of the object to check.
	 * @param string $value 	The name of the advanced robots meta value to look for.
	 *
	 * @return bool Whether or not the advanced robots meta values contains the passed string.
	 */
	protected function has_advanced_meta_value( $object_id, $value ) {
		return strpos( $this->get_meta_value( 'meta-robots-adv', $object_id ), $value ) !== false;
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
	 * Translates the meta value to a boolean value.
	 *
	 * @param string $value The value to translate.
	 *
	 * @return bool|null The translated value.
	 */
	protected function get_robots_noindex_value( $value ) {
		if ( $value === '1' ) {
			return true;
		}

		if ( $value === '2' ) {
			return false;
		}

		return null;
	}

	/**
	 * Returns the needed post meta field.
	 *
	 * @param string $field   The requested field.
	 * @param int    $post_id The post id.
	 *
	 * @return bool|mixed The value of the requested field.
	 */
	protected function get_meta_value( $field, $post_id ) {
		return WPSEO_Meta::get_value( $field, $post_id );
	}

	/**
	 * Sets the meta value for the passed key and post ID.
	 *
	 * @param string $key     The key to set.
	 * @param mixed  $value   The value to set.
	 * @param int    $post_id The post id.
	 *
	 * @return int|bool Meta ID if the key didn't exist, true on successful update,
	 *                  false on failure.
	 */
	protected function set_meta_value( $key, $value, $post_id ) {
		return WPSEO_Meta::set_value( $key, $value, $post_id );
	}
}
