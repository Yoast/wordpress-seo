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
	 * Retrieves an attachment ID for an image uploaded in the settings.
	 *
	 * Due to self::get_attachment_by_url returning 0 instead of false.
	 * 0 is also a possibility when no ID is available.
	 *
	 * @param string $setting The setting the image is stored in.
	 *
	 * @return int|bool The attachment id, or false or 0 if no ID is available.
	 */
	public function get_attachment_id_from_settings( $setting ) {
		return WPSEO_Image_Utils::get_attachment_id_from_settings( $setting );
	}

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
	 * @param int    $post_id    Post ID to use.
	 * @param string $image_size The image size to retrieve.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	public function get_featured_image( $post_id, $image_size = 'full' ) {
		if ( ! \has_post_thumbnail( $post_id ) ) {
			return '';
		}

		$thumbnail_id   = \get_post_thumbnail_id( $post_id );
		$featured_image = \wp_get_attachment_image_src( $thumbnail_id, $image_size );

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
		$image_url = $this->get_first_usable_content_image_for_post( $post_id );

		if ( $image_url === null ) {
			return '';
		}

		return $image_url;
	}

	/**
	 * Retrieves the first usable content image for a post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post id to extract the images from.
	 *
	 * @return string|null
	 */
	public function get_first_usable_content_image_for_post( $post_id ) {
		return WPSEO_Image_Utils::get_first_usable_content_image_for_post( $post_id );
	}
}
