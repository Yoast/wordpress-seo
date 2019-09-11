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
	 * @param int      $post_id The post ID.
	 * @param \WP_Post $post    The post object.
	 *
	 * @return array An array of images found in this post.
	 */
	public function get_images( $post_id, $post = null ) {
		return $this->get_images_from_content( $this->get_post_content( $post_id, $post ) );
	}

	/**
	 * Retrieves images from the term description.
	 *
	 * @param int 	 $term_id          The term ID.
	 * @param string $term_description The term description.
	 *
	 * @return array An array of images found in this post.
	 */
	public function get_images_term( $term_id, $term_description ) {
		return $this->get_images_from_content( $this->get_term_description( $term_id, $term_description ) );
	}

	/**
	 * Grabs the images from the content.
	 *
	 * @param string $content The post content string.
	 *
	 * @return array An array of image URLs.
	 */
	protected function get_images_from_content( $content ) {
		$content_images = $this->get_img_tags_from_content( $content );
		$images         = array_map( array( $this, 'get_img_tag_source' ), $content_images );
		$images         = array_filter( $images );
		$images         = array_unique( $images );

		return $images;
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
			return array();
		}

		preg_match_all( '`<img [^>]+>`', $content, $matches );
		if ( isset( $matches[0] ) ) {
			return $matches[0];
		}

		return array();
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
		if ( isset( $matches[2] ) ) {
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
		 * @api string $post_content The Post content string.
		 */
		$content = apply_filters( 'wpseo_pre_analysis_post_content', $post->post_content, $post );

		if ( ! is_string( $content ) ) {
			$content = '';
		}

		return $content;
	}

	/**
	 * Retrieves the term description we want to work with.
	 *
	 * @param int 		  $term_id 		    The term ID.
	 * @param string|null $term_description The term description.
	 *
	 * @return string The content of the supplied post.
	 */
	private function get_term_description( $term_id, $term_description ) {
		if ( $term_description === null ) {
			$term_description = term_description( $term_id );
		}

		if ( $term_description === null ) {
			return '';
		}

		/**
		 * Filter: 'wpseo_pre_analysis_term_description' - Allow filtering the description before analysis.
		 *
		 * @api string $term_description The term description string.
		 */
		$content = apply_filters( 'wpseo_pre_analysis_term_description', $term_description );

		if ( ! is_string( $content ) ) {
			$content = '';
		}

		return $content;
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Removes the cached images on post save.
	 *
	 * @deprecated 7.7
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post id to remove the images from.
	 *
	 * @return void
	 */
	public function clear_cached_images( $post_id ) {
		_deprecated_function( __METHOD__, '7.7.0' );
	}

	/**
	 * Registers the hooks.
	 *
	 * @deprecated 9.6
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO 9.6' );
	}
}
