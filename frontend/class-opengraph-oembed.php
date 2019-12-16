<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_OpenGraph_OEmbed.
 */
class WPSEO_OpenGraph_OEmbed implements WPSEO_WordPress_Integration {

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		// Check to make sure opengraph is enabled before adding filter.
		if ( WPSEO_Options::get( 'opengraph' ) ) {
			add_filter( 'oembed_response_data', [ $this, 'set_oembed_data' ], 10, 2 );
		}
	}

	/**
	 * Callback function to pass to the oEmbed's response data that will enable
	 * support for using the image and title set by the WordPress SEO plugin's fields. This
	 * address the concern where some social channels/subscribed use oEmebed data over OpenGraph data
	 * if both are present.
	 *
	 * @param array   $data The oEmbed data.
	 * @param WP_Post $post The current Post object.
	 *
	 * @link https://developer.wordpress.org/reference/hooks/oembed_response_data/ for hook info.
	 *
	 * @return array $filter_data - An array of oEmbed data with modified values where appropriate.
	 */
	public function set_oembed_data( $data, $post ) {
		// Data to be returned.
		$filter_data = $data;

		// Look for the Yoast meta values (image and title)...
		$opengraph_title = WPSEO_Meta::get_value( 'opengraph-title', $post->ID );
		$opengraph_image = WPSEO_Meta::get_value( 'opengraph-image', $post->ID );

		// If yoast has a title set, update oEmbed with Yoast's title.
		if ( ! empty( $opengraph_title ) ) {
			$filter_data['title'] = $opengraph_title;
		}

		// If WPSEO Image was _not_ set, return the `$filter_data` as it currently is.
		if ( empty( $opengraph_image ) ) {
			return $filter_data;
		}

		// Since the a WPSEO Image was set, update the oEmbed data with the Yoast Image's info.
		// Get the image's ID from a URL.
		$image_id = WPSEO_Image_Utils::get_attachment_by_url( $opengraph_image );

		// Get the image's info from it's ID.
		$image_info = wp_get_attachment_metadata( $image_id );

		// Update the oEmbed data.
		$filter_data['thumbnail_url'] = $opengraph_image;
		if ( ! empty( $image_info['height'] ) ) {
			$filter_data['thumbnail_height'] = $image_info['height'];
		}
		if ( ! empty( $image_info['width'] ) ) {
			$filter_data['thumbnail_width'] = $image_info['width'];
		}

		return $filter_data;
	}
}
