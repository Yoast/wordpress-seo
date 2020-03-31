<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_OpenGraph_OEmbed.
 *
 * @deprecated 14.0
 */
class WPSEO_OpenGraph_OEmbed implements WPSEO_WordPress_Integration {

	/**
	 * @inheritDoc
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Callback function to pass to the oEmbed's response data that will enable
	 * support for using the image and title set by the WordPress SEO plugin's fields. This
	 * address the concern where some social channels/subscribed use oEmebed data over OpenGraph data
	 * if both are present.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array   $data The oEmbed data.
	 * @param WP_Post $post The current Post object.
	 *
	 * @link https://developer.wordpress.org/reference/hooks/oembed_response_data/ for hook info.
	 *
	 * @return array An array of oEmbed data with modified values where appropriate.
	 */
	public function set_oembed_data( $data, $post ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return $data;
	}
}
