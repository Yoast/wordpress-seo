<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_OpenGraph_OEmbed
 */
class WPSEO_OpenGraph_OEmbed implements WPSEO_WordPress_Integration {
	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_filter( 'oembed_response_data', array( $this, 'wpseo_hook_oembed' ), 10, 4 );
	}

	/**
	 * Callback function to pass to the oEmbed's response data that will enable
	 * support for using the image and title set by the WordPress SEO plugin's fields. This
	 * address the concern where some social channels/subscribed use oEmebed data over OpenGraph data
	 * if both are present.
	 *
	 * @param array  $data   - The oEmbed data.
	 * @param object $post   - The current Post object.
	 * @param number $width  - The current post's width (more applicable for attachments).
	 * @param number $height - The current post's height (more applicable for attachments).
	 *
	 * @see https://developer.wordpress.org/reference/hooks/oembed_response_data/ for hook info
	 *
	 * @return array $filter_data - An array of oEmbed data with modified values where appropriate.
	 */
	public function wpseo_hook_oembed( $data, $post, $width, $height ) {
		// Data to be returned.
		$filter_data = $data;

		// Look for the Yoast meta values (image and title)...
		$opengraph_title = WPSEO_Meta::get_value( 'opengraph-title', $post->ID );
		$opengraph_image = WPSEO_Meta::get_value( 'opengraph-image', $post->ID );

		// If yoast has a title set, update oEmbed with Yoast's title.
		if ( ! empty( $yoast_title ) ) {
			$filter_data['title'] = $opengraph_title;
		}

		// If the a Yoast Image was set, update the oEmbed data with the Yoast Image's info.
		if ( ! empty( $opengraph_image ) ) {
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
		}

		return $filter_data;
	}
}
