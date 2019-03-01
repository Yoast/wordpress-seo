<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Class WPSEO_REST_Request_Exception
 */
class WPSEO_REST_Request_Exception extends Exception {

	/**
	 * Creates a patch failure exception.
	 *
	 * @param string $object_type The name of the parameter.
	 * @param string $object_id   The ID of the parameter.
	 *
	 * @return WPSEO_REST_Request_Exception The exception.
	 */
	public static function patch( $object_type, $object_id ) {
		return new self(
			sprintf(
				/* translators: %1$s expands to object type. %2$s expands to the object ID. */
				__( '%1$s with ID %2$s couldn\'t be patched', 'wordpress-seo' ),
				$object_type,
				$object_id
			)
		);
	}
}
