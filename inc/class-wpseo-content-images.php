<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

/**
 * WPSEO_Content_Images
 */
class WPSEO_Content_Images {
	/**
	 * The key used to store our image cache.
	 *
	 * @var string
	 */
	private $key_name = 'wpseo_post_image_cache';

	/**
	 * Retrieve images from the post content.
	 *
	 * @param int      $post_id The post ID.
	 * @param \WP_Post $post    The post object.
	 *
	 * @return array An array of images found in this post.
	 */
	public function get_content_images( $post_id, $post = null ) {
		$post_image_cache = get_post_meta( $post_id, $this->key_name, true );
		if ( is_array( $post_image_cache ) ) {
			return $post_image_cache;
		}
		if ( is_null( $post ) ) {
			$post = get_post( $post_id );
		}
		return $this->heat_content_image_cache( $post );
	}

	/**
	 * Heat the content image cache so we can retrieve it everywhere.
	 *
	 * @param \WP_Post $post The post object.
	 *
	 * @return array $images An array of images found in the post, empty if none found.
	 */
	private function heat_content_image_cache( $post ) {
		/**
		 * Filter: 'wpseo_pre_analysis_post_content' - Allow filtering the content before analysis.
		 *
		 * @api string $post_content The Post content string.
		 */
		$content = apply_filters( 'wpseo_pre_analysis_post_content', $post->post_content, $post );

		$images = array();
		if ( preg_match_all( '`<img [^>]+>`', $content, $matches ) ) {
			foreach ( $matches[0] as $img ) {
				if ( preg_match( '`src=(["\'])(.*?)\1`', $img, $match ) ) {
					$images[] = $match[2];
				}
			}
		}
		update_post_meta( $post->ID, $this->key_name, $images );

		return $images;
	}
}
