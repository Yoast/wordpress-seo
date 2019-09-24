<?php
/**
 * Presenter of the Twitter image for post type singles.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use WPSEO_Image_Utils;
use WPSEO_Options;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Twitter_Image_Presenter;

/**
 * Class Twitter_Image_Presenter
 */
class Twitter_Image_Presenter extends Abstract_Twitter_Image_Presenter {

	/**
	 * Generates the Twitter image for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The Twitter image.
	 */
	protected function generate( Indexable $indexable ) {
		if ( \post_password_required() ) {
			return '';
		}

		$image = $this->retrieve_social_image( $indexable );
		if ( $image ) {
			return $image;
		}

		$image = $this->retrieve_attachment_image( $indexable->object_id );
		if ( $image ) {
			return $image;
		}

		$image = $this->retrieve_featured_image( $indexable->object_id );
		if ( $image ) {
			return $image;
		}

		$image = $this->retrieve_gallery_image( $indexable->object_id );
		if ( $image ) {
			return $image;
		}

		$image = $this->retrieve_content_image( $indexable->object_id );
		if ( $image ) {
			return $image;
		}

		$image = WPSEO_Options::get( 'og_default_image', '' );
		if ( $image ) {
			return $image;
		}

		return '';
	}

	/**
	 * Retrieves Twitter_image from the indexable. If not available, defaults to og_image.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The image or an empty string when not found.
	 */
	protected function retrieve_social_image( Indexable $indexable ) {
		if ( $indexable->twitter_image ) {
			return $indexable->twitter_image;
		}

		if ( $indexable->og_image && WPSEO_Options::get( 'opengraph' ) === true ) {
			return $indexable->og_image;
		}

		return '';
	}

	/**
	 * Retrieves an attachment page's attachment.
	 *
	 * @param string $post_id The ID of the post for which to retrieve the image.
	 *
	 * @return string The image or an empty string when not found.
	 */
	protected function retrieve_attachment_image( $post_id ) {
		if ( ! \get_post_type( $post_id ) === 'attachment' ) {
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
	 * Retrieves the featured image.
	 *
	 * @param int $post_id Post ID to use.
	 *
	 * @return string The image or an empty string when not found.
	 */
	protected function retrieve_featured_image( $post_id ) {
		if ( ! \function_exists( 'has_post_thumbnail' ) || ! \has_post_thumbnail( $post_id ) ) {
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
	 * Retrieves the first image of a gallery.
	 *
	 * @param int $post_id Post ID to use.
	 *
	 * @return string The image or an empty string when not found.
	 */
	protected function retrieve_gallery_image( $post_id ) {
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
	 * Retrieves the image from the content.
	 *
	 * @param int $post_id The post id to extract the images from.
	 *
	 * @return string The image or an empty string when not found.
	 */
	protected function retrieve_content_image( $post_id ) {
		$image_url = WPSEO_Image_Utils::get_first_usable_content_image_for_post( $post_id );

		if ( $image_url === null ) {
			return '';
		}

		return $image_url;
	}
}
