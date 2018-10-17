<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Endpoints
 */

/**
 * Dictates the required methods for an indexable service provider.
 */
interface WPSEO_Indexable_Service_Provider {

	/**
	 * Returns an array with data for the target object.
	 *
	 * @param integer $object_id The target object id.
	 * @param bool    $as_object Optional. Whether or not to return the indexable as an object. Defaults to false.
	 *
	 * @return array The retrieved data.
	 */
	public function get( $object_id, $as_object = false );

	/**
	 * Handles the patching of values for an existing indexable.
	 *
	 * @param int   $object_id   The ID of the object.
	 * @param array $requestdata The request data to store.
	 *
	 * @return array The patched indexable.
	 */
	public function patch( $object_id, $requestdata );

	/**
	 * Checks if the given object id belongs to an indexable.
	 *
	 * @param int $object_id The object id.
	 *
	 * @return bool Whether the object id is indexable.
	 */
	public function is_indexable( $object_id );
}
