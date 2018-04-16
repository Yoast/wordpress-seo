<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the utils for the links module.
 */
class WPSEO_Link_Utils {

	/**
	 * Returns all the supported public post types.
	 *
	 * @return array The supported public post types.
	 */
	public static function get_public_post_types() {
		_deprecated_function( __METHOD__, '5.9', 'WPSEO_Post_Type::get_accessible_post_types' );

		return WPSEO_Post_Type::filter_attachment_post_type( WPSEO_Post_Type::get_accessible_post_types() );
	}

	/**
	 * Returns the value that is part of the given url.
	 *
	 * @param string $url  The url to parse.
	 * @param string $part The url part to use.
	 *
	 * @return string The value of the url part.
	 */
	public static function get_url_part( $url, $part ) {
		$url_parts = wp_parse_url( $url );

		if ( isset( $url_parts[ $part ] ) ) {
			return $url_parts[ $part ];
		}

		return '';
	}
}
