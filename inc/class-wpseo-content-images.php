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
	private $key_name = '_wpseo_post_image_cache';

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

		$images = $this->get_images_from_content( $content );
		update_post_meta( $post->ID, $this->key_name, $images );

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
			$url = $this->get_image_url_from_img( $img );
			if ( $url ) {
				$attachment_id  = WPSEO_Image_Utils::get_attachment_by_url( $url );
				$images[ $url ] = $attachment_id;
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
		preg_match_all( '`<img [^>]+>`', $content, $matches, PREG_SET_ORDER );
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
	 * @return string
	 */
	private function get_image_url_from_img( $image ) {
		preg_match( '`src=(["\'])(.*?)\1`', $image, $matches );
		if ( isset( $matches[2] ) ) {
			return $matches[2];
		}
		return false;
	}
}
