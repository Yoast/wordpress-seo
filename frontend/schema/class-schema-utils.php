<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Schema utility functions.
 *
 * @since 11.6
 */
class WPSEO_Schema_Utils {

	/**
	 * Retrieve a users Schema ID.
	 *
	 * @param int                  $user_id The ID of the User you need a Schema ID for.
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 *
	 * @return string The user's schema ID.
	 */
	public static function get_user_schema_id( $user_id, $context ) {
		$user = get_userdata( $user_id );

		if ( is_object( $user ) && isset( $user->user_login ) ) {
			return $context->site_url . WPSEO_Schema_IDs::PERSON_HASH . wp_hash( $user->user_login . $user_id );
		}
		return $context->site_url . WPSEO_Schema_IDs::PERSON_HASH;
	}
}
