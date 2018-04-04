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

		// We use the WP COM version if we can, see above.
		// phpcs:ignore WordPress.VIP.RestrictedFunctions
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
		/**
		 * Filter: 'wpseo_image_image_weight_limit' - Determines what the maximum weight (in bytes) of an image is allowed to be, default is 2 MB.
		 *
		 * @api int - The maximum weight (in bytes) of an image.
		 */
		$max_size = apply_filters( 'wpseo_image_image_weight_limit', ( 2 * 1024 * 1024 ) );

		/**
		 * Filter: 'wpseo_opengraph_image_sizes' - Determines which image sizes we'll loop through to get an appropriate image.
		 *
		 * @api array - The array of image sizes to loop through.
		 */
		$image_sizes = apply_filters( 'wpseo_opengraph_image_sizes', array( 'full', 'large', 'medium_large' ) );
		foreach ( $image_sizes as $size ) {
			// @todo fix how this is tested in test-class-opengraph as that test now doesn't work.
			$image = image_get_intermediate_size( $attachment_id, $size );
			if ( $image === false ) {
				continue;
			}
			// If the file size for the file is over our limit, we're going to go for a smaller version.
			// phpcs:ignore -- If file size doesn't properly return, we'll not fail.
			$file_size = filesize( self::get_full_file_path( $image['path'] ) );
			if ( $file_size === false ) {
				return $image;
			}
			if ( $file_size < $max_size ) {
				return $image;
			}
		}

		return false;
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

		if ( false !== $uploads['error'] ) {
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

}
