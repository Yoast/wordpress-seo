<?php
/**
 * A helper object for images.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use WPSEO_Image_Utils;

/**
 * Class Image_Helper
 */
class Image_Helper {

	/**
	 * Gets an attachment page's attachment url.
	 *
	 * @param string $post_id The ID of the post for which to retrieve the image.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	public function get_attachment_image( $post_id ) {
		if ( \get_post_type( $post_id ) !== 'attachment' ) {
			return '';
		}

		$mime_type         = \get_post_mime_type( $post_id );
		$allowed_mimetypes = [ 'image/jpeg', 'image/png', 'image/gif' ];

		if ( ! in_array( $mime_type, $allowed_mimetypes, false ) ) {
			return '';
		}

		return \wp_get_attachment_url( $post_id );
	}

	/**
	 * Gets the featured image url.
	 *
	 * @param int $post_id Post ID to use.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	public function get_featured_image( $post_id ) {
		if ( ! \has_post_thumbnail( $post_id ) ) {
			return '';
		}

		/**
		 * Filter: 'wpseo_twitter_image_size' - Allow changing the Twitter Card image size.
		 *
		 * @api string $featured_img Image size string.
		 */
		$image_size = \apply_filters( 'wpseo_twitter_image_size', 'full' );

		$featured_image = \wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), $image_size );

		if ( ! $featured_image ) {
			return '';
		}

		return $featured_image[0];
	}

	/**
	 * Gets the first image url of a gallery.
	 *
	 * @param int $post_id Post ID to use.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	public function get_gallery_image( $post_id ) {
		$post = \get_post( $post_id );
		if ( ! \has_shortcode( $post->post_content, 'gallery' ) ) {
			return '';
		}

		$images = \get_post_gallery_images();
		if ( empty( $images ) ) {
			return '';
		}

		return \reset( $images );
	}

	/**
	 * Gets the image url from the content.
	 *
	 * @param int $post_id The post id to extract the images from.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	public function get_post_content_image( $post_id ) {
		$image_url = WPSEO_Image_Utils::get_first_usable_content_image_for_post( $post_id );

		if ( $image_url === null ) {
			return '';
		}

		return $image_url;
	}
}
