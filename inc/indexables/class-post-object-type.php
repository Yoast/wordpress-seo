<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Post_Object_Type
 */
class WPSEO_Post_Object_Type extends WPSEO_Object_Type {

	/**
	 * Creates a new instance based on the passed object ID.
	 *
	 * @param int $object_id The object ID to base the object on.
	 *
	 * @return WPSEO_Post_Object_Type The class instance.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if the post is null.
	 */
	public static function from_object( $object_id ) {
		$post = get_post( $object_id );

		if ( $post === null ) {
			throw WPSEO_Invalid_Argument_Exception::unknown_object( $object_id, 'post' );
		}

		return new self( $object_id, 'post', get_post_type( $object_id ), get_permalink( $object_id ) );
	}
}
