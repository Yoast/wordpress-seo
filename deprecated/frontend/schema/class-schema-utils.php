<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Schema utility functions.
 *
 * @deprecated xx.x
 *
 * @since 11.6
 */
class WPSEO_Schema_Utils {

	/**
	 * Retrieve a users Schema ID.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param int                  $user_id The ID of the User you need a Schema ID for.
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 *
	 * @return string The user's schema ID.
	 */
	public static function get_user_schema_id( $user_id, $context ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		 return '';
	}
}
