<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

/**
 * WPSEO_Image_Utils
 */
class WPSEO_Image_Utils {
	/**
	 * Find an attachment ID for a given URL.
	 *
	 * @param string $url The URL to find the attachment for.
	 *
	 * @return int The found attachment ID, or 0 if none was found.
	 */
	public static function get_attachment_by_url( $url ) {
		// Because get_attachment_by_url won't work on resized versions of images, we strip out the size part of an image URL.
		$url = preg_replace( '/(.*)-\d+x\d+\.(jpg|png|gif)$/', '$1.$2', $url );

		if ( function_exists( 'wpcom_vip_attachment_url_to_postid' ) ) {
			return wpcom_vip_attachment_url_to_postid( $url );
		}

		// phpcs:ignore WordPress.VIP.RestrictedFunctions -- We use the WP COM version if we can, see above.
		return attachment_url_to_postid( $url );
	}

	/**
	 * Finds an image size that is under 1 MB and thus viable to use for social sharing.
	 *
	 * @param int $attachment_id The attachment ID.
	 *
	 * @return array|false
	 */
	public static function find_correct_image_size( $attachment_id ) {
		foreach ( self::get_image_sizes() as $size ) {
			$image = self::check_image_by_size( $attachment_id, $size );
			if ( $image !== false ) {
				return $image;
			}
		}

		return false;
	}

	/**
	 * Checks a size version of an image to see if it's not too heavy.
	 *
	 * @param int    $attachment_id Attachment ID.
	 * @param string $size          Size name.
	 *
	 * @return array|false Image array with metadata on success, false on failure.
	 */
	public static function check_image_by_size( $attachment_id, $size ) {
		/**
		 * Filter: 'wpseo_image_image_weight_limit' - Determines what the maximum weight (in bytes) of an image is allowed to be, default is 2 MB.
		 *
		 * @api int - The maximum weight (in bytes) of an image.
		 */
		$max_size = apply_filters( 'wpseo_image_image_weight_limit', ( 2 * 1024 * 1024 ) );

		$image = image_get_intermediate_size( $attachment_id, $size );

		if ( $image === false ) {
			return false;
		}
		$file_size = self::get_image_file_size( $image );
		if ( $file_size > $max_size ) {
			return false;
		}

		return $image;
	}

	/**
	 * Finds the full file path for a given image file.
	 *
	 * @param string $path The relative file path.
	 *
	 * @return string
	 */
	public static function get_full_file_path( $path ) {
		static $uploads;

		if ( ! isset( $uploads ) ) {
			$uploads = wp_get_upload_dir();
		}

		if ( empty( $uploads['error'] ) ) {
			return $uploads['basedir'] . "/$path";
		}

		return $path;
	}

	/**
	 * Get the relative path of the image.
	 *
	 * @param string $img Image URL.
	 *
	 * @return string The expanded image URL.
	 */
	public static function get_relative_path( $img ) {
		if ( $img[0] !== '/' ) {
			return $img;
		}

		// If it's a relative URL, it's relative to the domain, not necessarily to the WordPress install, we
		// want to preserve domain name and URL scheme (http / https) though.
		$parsed_url = wp_parse_url( home_url() );
		$img        = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $img;

		return $img;
	}

	/**
	 * Get the image file size.
	 *
	 * @param array $image An image array object.
	 *
	 * @return int
	 */
	public static function get_image_file_size( $image ) {
		if ( isset( $image['filesize'] ) ) {
			return $image['filesize'];
		}
		// If the file size for the file is over our limit, we're going to go for a smaller version.
		// phpcs:ignore -- If file size doesn't properly return, we'll not fail.
		$file_size = @filesize( self::get_full_file_path( $image['path'] ) );
		// @todo save the filesize to the image metadata.
		return $file_size;
	}

	/**
	 * Retrieve the internal WP image file sizes.
	 */
	public static function get_image_sizes() {
		/**
		 * Filter: 'wpseo_image_sizes' - Determines which image sizes we'll loop through to get an appropriate image.
		 *
		 * @api array - The array of image sizes to loop through.
		 */
		$image_sizes = apply_filters( 'wpseo_image_sizes', array( 'full', 'large', 'medium_large' ) );
		return $image_sizes;
	}

	/**
	 * Grabs an image alt text.
	 *
	 * @param int $attachment_id The attachment ID.
	 *
	 * @return string The image alt text.
	 */
	public static function get_image_alt_tag( $attachment_id ) {
		return (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
	}
}
