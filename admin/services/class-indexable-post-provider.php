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

		$indexable = WPSEO_Indexable::from_object( $object_id );

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

	public function patch( $requestdata ) {
		$object_id = $requestdata['object_id'];

		if ( ! $this->is_indexable( $object_id ) ) {
			$exception = WPSEO_Invalid_Indexable_Exception::non_existing_indexable( $object_id );

			return new WP_REST_Response( $exception->getMessage(), 500 );
		}

		$indexable = $this->get( $object_id );




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
