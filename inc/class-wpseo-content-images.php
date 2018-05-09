<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

/**
 * WPSEO_Content_Images
 */
class WPSEO_Content_Images implements WPSEO_WordPress_Integration {
	/**
	 * The key used to store our image cache.
	 *
	 * @var string
	 */
	private $cache_meta_key = '_yoast_wpseo_post_image_cache';

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'save_post', array( $this, 'clear_cached_images' ) );
	}

	/**
	 * Removes the cached images on post save.
	 *
	 * @param int $post_id The post id to remove the images from.
	 *
	 * @return void
	 */
	public function clear_cached_images( $post_id ) {
		delete_post_meta( $post_id, $this->cache_meta_key );
	}

	/**
	 * Retrieves images from the post content.
	 *
	 * @param int      $post_id The post ID.
	 * @param \WP_Post $post    The post object.
	 *
	 * @return array An array of images found in this post.
	 */
	public function get_images( $post_id, $post = null ) {
		$post_image_cache = $this->get_cached_images( $post_id );
		if ( is_array( $post_image_cache ) ) {
			return $post_image_cache;
		}

		$images = $this->get_images_from_content( $this->get_post_content( $post_id, $post ) );

		// Store the data in the cache.
		$this->update_image_cache( $post, $images );

		return $images;
	}

	/**
	 * Grabs the images from the content.
	 *
	 * @param string $content The post content string.
	 *
	 * @return array An array of image URLs as keys and ID's as values.
	 */
	private function get_images_from_content( $content ) {
		$images = array();
		foreach ( $this->get_img_tags_from_content( $content ) as $img ) {
			$url = $this->get_img_tag_source( $img );
			if ( $url ) {
				$images[ $url ] = WPSEO_Image_Utils::get_attachment_by_url( $url );
			}
		}

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
	 * Retrieves the images from the cache.
	 *
	 * @param int $post_id Post ID to retrieve images for.
	 *
	 * @return mixed Data stored in the cache.
	 */
	private function get_cached_images( $post_id ) {
		return get_post_meta( $post_id, $this->cache_meta_key, true );
	}

	/**
	 * Updates the image cache.
	 *
	 * @param WP_Post|array $post   The post to store the cache for.
	 * @param array         $images The data to store in the cache.
	 *
	 * @return void
	 */
	private function update_image_cache( $post, $images ) {
		update_post_meta( $post->ID, $this->cache_meta_key, $images );
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
}
