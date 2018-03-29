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
	 *
	 * @return array The retrieved data.
	 */
	public function get( $object_id );

	/**
	 * Checks if the given object id belongs to an indexable.
	 *
	 * @param int $object_id The object id.
	 *
	 * @return bool Whether the object id is indexable.
	 */
	public function is_indexable( $object_id );
}
