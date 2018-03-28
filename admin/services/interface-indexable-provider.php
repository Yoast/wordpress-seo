<?php

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
	 * @param $object_id
	 *
	 * @return bool Whether the obvj
	 */
	public function exists( $object_id );
}