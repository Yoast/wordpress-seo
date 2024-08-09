<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

/**
 * WPSEO_Content_Images.
 */
class WPSEO_Content_Images {

	/**
	 * Retrieves images from the post content.
	 *
	 * @param int          $post_id The post ID.
	 * @param WP_Post|null $post    The post object.
	 *
	 * @return array An array of images found in this post.
	 */
	public function get_images( $post_id, $post = null ) {
		return $this->get_images_from_content( $this->get_post_content( $post_id, $post ) );
	}

	/**
	 * Grabs the images from the content.
	 *
	 * @param string $content The post content string.
	 *
	 * @return array An array of image URLs.
	 */
	public function get_images_from_content( $content ) {


		if ( ! is_string( $content ) ) {
			return [];
		}

		$content_images2 = $this->gather_images_wp( $content);
		$content_images = $this->get_img_tags_from_content( $content );

		$images = array_map( [ $this, 'get_img_tag_source' ], $content_images );
		$images = array_filter( $images );
		$images = array_unique( $images );
		$images = array_values( $images ); // Reset the array keys.
		var_dump( $content_images2 );
		var_dump( $images );
		die;
		return $images;
	}
	/**
	 * Gathers all images from content with WP's WP_HTML_Tag_Processor() and returns them along with their IDs, if
	 * possible.
	 *
	 * @param string $content The content.
	 *
	 * @return int[] An associated array of image IDs, keyed by their URL.
	 */
	protected function gather_images_wp( $content ) {
		$processor = new WP_HTML_Tag_Processor( $content );
		$images    = [];

		$query = [
			'tag_name' => 'img',
		];

		/**
		 * Filter 'wpseo_image_attribute_containing_id' - Allows filtering what attribute will be used to extract image IDs from.
		 *
		 * Defaults to "class", which is where WP natively stores the image IDs, in a `wp-image-<ID>` format.
		 *
		 * @api string The attribute to be used to extract image IDs from.
		 */
		$attribute = \apply_filters( 'wpseo_image_attribute_containing_id', 'class' );

		while ( $processor->next_tag( $query ) ) {
			$src     = \htmlentities( $processor->get_attribute( 'src' ), ( \ENT_QUOTES | \ENT_SUBSTITUTE | \ENT_HTML401 ), \get_bloginfo( 'charset' ) );
			$classes = $processor->get_attribute( $attribute );
			$id      = $this->extract_id_of_classes( $classes );

			$images[ $src ] = $id;
		}

		return $images;
	}
	/**
	 * Extracts image ID out of the image's classes.
	 *
	 * @param string $classes The classes assigned to the image.
	 *
	 * @return int The ID that's extracted from the classes.
	 */
	protected function extract_id_of_classes( $classes ) {
		if ( ! $classes ) {
			return 0;
		}

		/**
		 * Filter 'wpseo_extract_id_pattern' - Allows filtering the regex patern to be used to extract image IDs from class/attribute names.
		 *
		 * Defaults to the pattern that extracts image IDs from core's `wp-image-<ID>` native format in image classes.
		 *
		 * @api string The regex pattern to be used to extract image IDs from class names. Empty string if the whole class/attribute should be returned.
		 */
		$pattern = \apply_filters( 'wpseo_extract_id_pattern', '/(?<!\S)wp-image-(\d+)(?!\S)/i' );

		if ( $pattern === '' ) {
			return (int) $classes;
		}

		$matches = [];

		if ( \preg_match( $pattern, $classes, $matches ) ) {
			return (int) $matches[1];
		}

		return 0;
	}

	/**
	 * Gets the image tags from a given content string.
	 *
	 * @param string $content The content to search for image tags.
	 *
	 * @return array An array of `<img>` tags.
	 */
	private function get_img_tags_from_content( $content ) {
		if ( strpos( $content, '<img' ) === false ) {
			return [];
		}

		preg_match_all( '`<img [^>]+>`', $content, $matches );
		if ( isset( $matches[0] ) ) {
			return $matches[0];
		}

		return [];
	}

	/**
	 * Retrieves the image URL from an image tag.
	 *
	 * @param string $image Image HTML element.
	 *
	 * @return string|bool The image URL on success, false on failure.
	 */
	private function get_img_tag_source( $image ) {
		preg_match( '`src=(["\'])(.*?)\1`', $image, $matches );
		if ( isset( $matches[2] ) && filter_var( $matches[2], FILTER_VALIDATE_URL ) ) {
			return $matches[2];
		}
		return false;
	}

	/**
	 * Retrieves the post content we want to work with.
	 *
	 * @param int                $post_id The post ID.
	 * @param WP_Post|array|null $post    The post.
	 *
	 * @return string The content of the supplied post.
	 */
	private function get_post_content( $post_id, $post ) {
		if ( $post === null ) {
			$post = get_post( $post_id );
		}

		if ( $post === null ) {
			return '';
		}

		/**
		 * Filter: 'wpseo_pre_analysis_post_content' - Allow filtering the content before analysis.
		 *
		 * @param string  $post_content The Post content string.
		 * @param WP_Post $post         The current post.
		 */
		$content = apply_filters( 'wpseo_pre_analysis_post_content', $post->post_content, $post );

		if ( ! is_string( $content ) ) {
			$content = '';
		}

		return $content;
	}
}
