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
			// @codeCoverageIgnoreStart -- we can't test this properly.
			return (int) wpcom_vip_attachment_url_to_postid( $url );
			// @codeCoverageIgnoreEnd -- The rest we _can_ test.
		}

		// phpcs:ignore WordPress.VIP.RestrictedFunctions -- We use the WP COM version if we can, see above.
		return (int) attachment_url_to_postid( $url );
	}

	/**
	 * Finds an image size that is under 2 MB and thus viable to use for social sharing.
	 *
	 * @param int $attachment_id The attachment ID.
	 *
	 * @return array|false
	 */
	public static function find_correct_image_size( $attachment_id ) {
		foreach ( self::get_image_sizes() as $size ) {
			$image = self::check_image_by_size( $attachment_id, $size );
			if ( $image !== false ) {
				return self::complete_image_data( $image, $attachment_id );
			}
		}

		return false;
	}

	/**
	 * Enrich the image data to use elsewhere.
	 *
	 * @param array $image         Image array with URL and metadata.
	 * @param int   $attachment_id Attachment ID.
	 *
	 * @return array $image {
	 *     Array of image data
	 *
	 *     @type string $alt    Image's alt text.
	 *     @type int    $width  Width of image.
	 *     @type int    $height Height of image.
	 *     @type string $type   Image's MIME type.
	 *     @type string $url    Image's URL.
	 * }
	 */
	public static function complete_image_data( $image, $attachment_id ) {
		$image['alt'] = self::get_image_alt_tag( $attachment_id );
		if ( ! isset( $image['type'] ) ) {
			$image['type'] = get_post_mime_type( $attachment_id );
		}
		// Keep only the keys we need, and nothing else.
		$image = array_intersect_key( $image, array_flip( array( 'alt', 'width', 'height', 'type', 'url' ) ) );
		return $image;
	}

	/**
	 * Check original size of image. If original image is too small, return false, else return true.
	 *
	 * @param int   $attachment_id The attachment ID to check the size of.
	 * @param array $params {
	 *    The parameters to check against.
	 *
	 *    @type int    $min_width     Minimum width of image.
	 *    @type int    $max_width     Maximum width of image.
	 *    @type int    $min_height    Minimum height of image.
	 *    @type int    $max_height    Maximum height of image.
	 *    @type int    $min_ratio     Minimum aspect ratio of image.
	 *    @type int    $max_ratio     Maximum aspect ratio of image.
	 * }
	 *
	 * @return bool Whether an image is fit for display or not.
	 */
	public static function check_image_measurements( $attachment_id, $params ) {
		$img_data = wp_get_attachment_metadata( $attachment_id );
		if ( ! isset( $img_data['width'] ) || ! isset( $img_data['height'] ) ) {
			return true;
		}

		$img_data['ratio'] = ( $img_data['width'] / $img_data['height'] );

		return self::check_image_measurement_params( $params, $img_data );
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

		$image = self::get_image( $attachment_id, $size );

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
	 * Find the right version of an image based on size.
	 *
	 * @param int    $attachment_id Attachment ID.
	 * @param string $size          Size name.
	 *
	 * @return array|false Returns an array with image data on success, false on failure.
	 */
	private static function get_image( $attachment_id, $size ) {
		if ( $size === 'full' ) {
			$image        = wp_get_attachment_metadata( $attachment_id );
			$image['url'] = wp_get_attachment_image_url( $attachment_id, 'full' );
			return $image;
		}
		return image_get_intermediate_size( $attachment_id, $size );
	}

	/**
	 * Finds the full file path for a given image file.
	 *
	 * @param string $path The relative file path.
	 *
	 * @return string The full file path.
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
	 * @return int The file size in bytes.
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
	 *
	 * @return array $image_sizes An array of image sizes.
	 */
	public static function get_image_sizes() {
		/**
		 * Filter: 'wpseo_image_sizes' - Determines which image sizes we'll loop through to get an appropriate image.
		 *
		 * @api array - The array of image sizes to loop through.
		 */
		return apply_filters( 'wpseo_image_sizes', array( 'full', 'large', 'medium_large' ) );
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

	/**
	 * Checks whether an img sizes up to the parameters.
	 *
	 * @param array $params   The parameters to check against.
	 * @param array $img_data The image values.
	 *
	 * @return bool
	 */
	private static function check_image_measurement_params( $params, $img_data ) {
		foreach ( array( 'width', 'height', 'ratio' ) as $param ) {
			if (
				( $img_data[ $param ] < $params[ 'min_' . $param ] ) ||
				( $img_data[ $param ] > $params[ 'max_' . $param ] )
			) {
				return false;
			}
		}

		return true;
	}
}
