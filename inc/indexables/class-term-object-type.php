<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Term_Object_Type
 */
class WPSEO_Term_Object_Type extends WPSEO_Object_Type {

	/**
	 * Creates a new instance based on the passed object ID.
	 *
	 * @param int $object_id The object ID to base the object on.
	 *
	 * @return WPSEO_Term_Object_Type The class instance.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if the term is null or if a WordPress error is thrown.
	 */
	public static function from_object( $object_id ) {
		$term = get_term( $object_id );

		if ( $term === null || is_wp_error( $term ) ) {
			throw WPSEO_Invalid_Argument_Exception::unknown_object( $object_id, 'term' );
		}

		return new self( $object_id, 'term', $term->taxonomy, get_term_link( $term ) );
	}
}
