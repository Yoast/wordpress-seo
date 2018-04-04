<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_OpenGraph_Image
 */
class WPSEO_OpenGraph_Image {
	/**
	 * Holds the images that have been put out as OG image.
	 *
	 * @var array
	 */
	protected $images = array();

	/**
	 * Constructor.
	 *
	 * @param string|boolean $image Optional image URL.
	 */
	public function __construct( $image = false ) {
		// If an image was not supplied or could not be added.
		if ( empty( $image ) || ! $this->add_image_by_url( $image ) ) {
			$this->set_images();
		}
	}

	/**
	 * Return the images array.
	 *
	 * @return array
	 */
	public function get_images() {
		return $this->images;
	}

	/**
	 * Display an OpenGraph image tag.
	 *
	 * @param string $img    Source URL to the image.
	 * @param int    $width  The image width.
	 * @param int    $height The image height.
	 *
	 * @return bool Whether we were succesful or not.
	 */
	public function add_image( $img, $width = null, $height = null ) {
		/**
		 * Filter: 'wpseo_opengraph_image' - Allow changing the OpenGraph image.
		 *
		 * @api string - The URL of the OpenGraph image.
		 */
		$img = trim( apply_filters( 'wpseo_opengraph_image', $img ) );

		if ( empty( $img ) ) {
			return false;
		}

		if ( WPSEO_Utils::is_url_relative( $img ) === true ) {
			$img = WPSEO_Image_Utils::get_relative_path( $img );
		}

		if ( array_key_exists( $img, $this->images ) ) {
			return false;
		}

		$this->images[ $img ] = array(
			'width'  => $width,
			'height' => $height,
		);

		return true;
	}

	/**
	 * Find the correct image for the current page type.
	 *
	 * @return bool Whether we added an image or not.
	 */
	protected function set_images() {
		/**
		 * Filter: wpseo_add_opengraph_images - Allow developers to add images to the OpenGraph tags.
		 *
		 * @api WPSEO_OpenGraph_Image The current object.
		 */
		do_action( 'wpseo_add_opengraph_images', $this );

		if ( is_front_page() ) {
			return $this->get_front_page_image();
		}
		if ( is_home() ) { // Posts page, which won't be caught by is_singular() below.
			return $this->get_posts_page_image();
		}
		if ( is_singular() ) {
			return $this->get_singular_image();
		}
		if ( is_category() || is_tax() || is_tag() ) {
			return $this->get_opengraph_image_taxonomy();
		}

		return $this->get_default_image();
	}

	/**
	 * If the frontpage image exists, call add_image.
	 *
	 * @return bool Whether we added an image or not.
	 */
	private function get_front_page_image() {
		if ( WPSEO_Options::get( 'og_frontpage_image', '' ) !== '' ) {
			return $this->add_image_by_url( WPSEO_Options::get( 'og_frontpage_image' ) );
		}
		return false;
	}

	/**
	 * Get the images of the posts page.
	 *
	 * @return bool Whether we added an image or not.
	 */
	private function get_posts_page_image() {
		$post_id = get_option( 'page_for_posts' );

		if ( $this->get_opengraph_image_post( $post_id ) ) {
			return true;
		}

		if ( $this->get_featured_image( $post_id ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Get the images of the singular post.
	 *
	 * @param null|int $post_id The post id to get the images for.
	 *
	 * @return bool Whether we added an image or not.
	 */
	private function get_singular_image( $post_id = null ) {
		if ( $post_id === null ) {
			$post_id = get_the_ID();
		}

		if ( $this->get_opengraph_image_post( $post_id ) ) {
			return true;
		}

		if ( $this->get_attachment_page_image( $post_id ) ) {
			return true;
		}

		if ( $this->get_featured_image( $post_id ) ) {
			return true;
		}

		return $this->get_content_images( get_post( $post_id ) );
	}

	/**
	 * Get default image and call add_image.
	 *
	 * @return bool Whether we added an image or not.
	 */
	private function get_default_image() {
		if ( count( $this->images ) === 0 && WPSEO_Options::get( 'og_default_image', '' ) !== '' ) {
			return $this->add_image_by_url( WPSEO_Options::get( 'og_default_image' ) );
		}
		return false;
	}

	/**
	 * If opengraph-image is set, call add_image and return true.
	 *
	 * @param int $post_id Optional post ID to use.
	 *
	 * @return bool Whether we added an image or not.
	 */
	private function get_opengraph_image_post( $post_id = 0 ) {
		$image_url = WPSEO_Meta::get_value( 'opengraph-image', $post_id );
		return $this->add_image_by_url( $image_url );
	}

	/**
	 * Check if taxonomy has an image and add this image.
	 *
	 * @return bool Whether we added an image or not.
	 */
	private function get_opengraph_image_taxonomy() {
		$image_url = WPSEO_Taxonomy_Meta::get_meta_without_term( 'opengraph-image' );
		return $this->add_image_by_url( $image_url );
	}

	/**
	 * If there is a featured image, check image size. If image size is correct, call add_image and return true.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool Whether we added an image or not.
	 */
	private function get_featured_image( $post_id ) {
		if ( has_post_thumbnail( $post_id ) ) {
			$attachment_id = get_post_thumbnail_id( $post_id );
			/**
			 * Filter: 'wpseo_opengraph_image_size' - Allow changing the image size used for OpenGraph sharing.
			 *
			 * @api string $unsigned Size string.
			 */
			$thumb = wp_get_attachment_image_src( $attachment_id, apply_filters( 'wpseo_opengraph_image_size', 'original' ) );

			if ( $this->check_featured_image_size( $thumb ) ) {
				$return = $this->add_image_by_id( $attachment_id );
				return $return;
			}
		}

		return false;
	}

	/**
	 * If this is an attachment page, call add_image with the attachment and return true.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool Whether we added an image or not.
	 */
	private function get_attachment_page_image( $post_id ) {
		if ( get_post_type( $post_id ) === 'attachment' && wp_attachment_is_image( $post_id ) ) {
			return $this->add_image_by_id( $post_id );
		}

		return false;
	}

	/**
	 * Retrieve images from the post content.
	 *
	 * @param object $post The post object.
	 *
	 * @return bool Whether we added an image or not.
	 */
	private function get_content_images( $post ) {
		$status       = false;
		$image_finder = new WPSEO_Content_Images();
		$images       = $image_finder->get_content_images( $post->ID, $post );

		if ( ! is_array( $images ) || $images === array() ) {
			return false;
		}

		foreach ( $images as $image ) {
			$return = $this->add_image_by_url( $image );
			if ( $return ) {
				$status = true;
			}
		}

		return $status;
	}

	/**
	 * Adds an image based on a given URL, and attempts to be smart about it.
	 *
	 * @param string $url The given URL.
	 *
	 * @return bool Whether we were successful or not.
	 */
	protected function add_image_by_url( $url ) {
		if ( $url !== '' ) {
			$attachment_id = WPSEO_Image_Utils::get_attachment_by_url( $url );
			if ( $attachment_id > 0 ) {
				return $this->add_image_by_id( $attachment_id );
			}
			return $this->add_image( $url );
		}

		return false;
	}

	/**
	 * Check size of featured image. If image is too small, return false, else return true.
	 *
	 * @param array $img_data Image info from wp_get_attachment_image_src: url, width, height, icon.
	 *
	 * @return bool Whether an image is fit for OpenGraph display or not.
	 */
	protected function check_featured_image_size( $img_data ) {
		if ( ! is_array( $img_data ) ) {
			return false;
		}

		// Get the width and height of the image.
		if ( $img_data[1] < 200 || $img_data[2] < 200 ) {
			return false;
		}

		return true;
	}

	/**
	 * Adds an image to the list by attachment ID.
	 *
	 * @param int $attachment_id The attachment ID to add.
	 *
	 * @return bool Whether we were successful or not.
	 */
	protected function add_image_by_id( $attachment_id ) {
		$attachment = WPSEO_Image_Utils::find_correct_image_size( $attachment_id );
		if ( $attachment ) {
			return $this->add_image( $attachment['url'], $attachment['width'], $attachment['height'] );
		}

		$image = wp_get_attachment_image_src( $attachment_id, 'full' );
		if ( $image ) {
			return $this->add_image( $image[0], $image[1], $image[2] );
		}

		return false;
	}

}
