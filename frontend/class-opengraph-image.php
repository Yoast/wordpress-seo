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
	 * Holds the WPSEO_OpenGraph instance, so we can call og_tag.
	 *
	 * @var WPSEO_OpenGraph
	 */
	private $opengraph;

	/**
	 * Image tags that we output for each image.
	 *
	 * @var array
	 */
	private $image_tags = array(
		'width'     => 'width',
		'height'    => 'height',
		'alt'       => 'alt',
		'mime-type' => 'type',
	);

	/**
	 * Constructor.
	 *
	 * @param WPSEO_OpenGraph $wpseo_opengraph The OpenGraph object.
	 */
	public function __construct( $wpseo_opengraph ) {
		$this->opengraph = $wpseo_opengraph;

		$this->set_images();
	}

	/**
	 * Outputs the images.
	 */
	public function show() {
		foreach ( $this->get_images() as $img => $image_meta ) {
			$this->og_image_tag( $img );
			$this->show_image_meta( $image_meta );
		}
	}

	/**
	 * Output the image metadata.
	 *
	 * @param array $image_meta Image meta data to output.
	 *
	 * @return void
	 */
	private function show_image_meta( $image_meta ) {
		foreach ( $this->image_tags as $key => $value ) {
			if ( isset( $image_meta[ $key ] ) && ! empty( $image_meta[ $key ] ) ) {
				$this->opengraph->og_tag( 'og:image:' . $key, $image_meta[ $key ] );
			}
		}
	}
	/**
	 * Outputs an image tag based on whether it's https or not.
	 *
	 * @param string $img The image URL.
	 *
	 * @return void
	 */
	private function og_image_tag( $img ) {
		$this->opengraph->og_tag( 'og:image', esc_url( $img ) );
		if ( 0 === strpos( $img, 'https://' ) ) {
			$this->opengraph->og_tag( 'og:image:secure_url', esc_url( $img ) );
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
	 * Check whether we have images or not.
	 *
	 * @return bool True if we have images, false if we don't.
	 */
	public function has_images() {
		if ( ! empty( $this->images ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Display an OpenGraph image tag.
	 *
	 * @param array $attachment Attachment array.
	 *
	 * @return void
	 */
	public function add_image( $attachment ) {
		/**
		 * Filter: 'wpseo_opengraph_image' - Allow changing the OpenGraph image.
		 *
		 * @api string - The URL of the OpenGraph image.
		 */
		$img = trim( apply_filters( 'wpseo_opengraph_image', $attachment['url'] ) );

		if ( empty( $img ) ) {
			return;
		}

		if ( WPSEO_Utils::is_url_relative( $img ) === true ) {
			$img = WPSEO_Image_Utils::get_relative_path( $img );
		}

		if ( array_key_exists( $img, $this->images ) ) {
			return;
		}

		$this->images[ $img ] = $attachment;
	}

	/**
	 * If the frontpage image exists, call add_image.
	 */
	private function set_front_page_image() {
		if ( WPSEO_Options::get( 'og_frontpage_image', '' ) !== '' ) {
			$this->add_image_by_url( WPSEO_Options::get( 'og_frontpage_image' ) );
		}
	}

	/**
	 * Get the images of the posts page.
	 *
	 * @return void
	 */
	private function set_posts_page_image() {
		$post_id = get_option( 'page_for_posts' );

		$this->set_image_post_meta( $post_id );
		if ( $this->has_images() ) {
			return;
		}

		$this->set_featured_image( $post_id );
	}

	/**
	 * Get the images of the singular post.
	 *
	 * @param null|int $post_id The post id to get the images for.
	 *
	 * @return void
	 */
	private function set_singular_image( $post_id = null ) {
		if ( $post_id === null ) {
			$post_id = get_queried_object_id();
		}

		$this->set_image_post_meta( $post_id );
		if ( $this->has_images() ) {
			return;
		}

		$this->set_featured_image( $post_id );
		if ( $this->has_images() ) {
			return;
		}

		$this->add_content_images( get_post( $post_id ) );
	}

	/**
	 * Get default image and call add_image.
	 */
	private function maybe_set_default_image() {
		if ( ! $this->has_images() && WPSEO_Options::get( 'og_default_image', '' ) !== '' ) {
			$this->add_image_by_url( WPSEO_Options::get( 'og_default_image' ) );
		}
	}

	/**
	 * If opengraph-image is set, call add_image and return true.
	 *
	 * @param int $post_id Optional post ID to use.
	 */
	private function set_image_post_meta( $post_id = 0 ) {
		$image_url = WPSEO_Meta::get_value( 'opengraph-image', $post_id );
		$this->add_image_by_url( $image_url );
	}

	/**
	 * Check if taxonomy has an image and add this image.
	 */
	private function set_taxonomy_image() {
		$image_url = WPSEO_Taxonomy_Meta::get_meta_without_term( 'opengraph-image' );
		$this->add_image_by_url( $image_url );
	}

	/**
	 * If there is a featured image, check image size. If image size is correct, call add_image and return true.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return void
	 */
	private function set_featured_image( $post_id ) {
		if ( has_post_thumbnail( $post_id ) ) {
			$attachment_id = get_post_thumbnail_id( $post_id );
			/**
			 * Filter: 'wpseo_opengraph_image_size' - Allow changing the image size used for OpenGraph sharing.
			 *
			 * @api string $unsigned Size string.
			 */
			$thumb = wp_get_attachment_image_src( $attachment_id, apply_filters( 'wpseo_opengraph_image_size', 'original' ) );

			if ( $this->check_featured_image_size( $thumb ) ) {
				$this->add_image_by_id( $attachment_id );
				return;
			}
		}
	}

	/**
	 * If this is an attachment page, call add_image with the attachment.
	 *
	 * @return void
	 */
	private function set_attachment_page_image() {
		$post_id = get_queried_object_id();
		if ( wp_attachment_is_image( $post_id ) ) {
			$this->add_image_by_id( $post_id );
		}
	}

	/**
	 * Retrieve images from the post content.
	 *
	 * @param object $post The post object.
	 *
	 * @return void
	 */
	private function add_content_images( $post ) {
		$image_finder = new WPSEO_Content_Images();
		$images       = $image_finder->get_content_images( $post->ID, $post );

		if ( ! is_array( $images ) || $images === array() ) {
			return;
		}

		foreach ( $images as $image_url => $attachment_id ) {
			$this->add_image_by_url_or_id( $image_url, $attachment_id );
		}
	}

	/**
	 * Add an image based on either the attachment ID or the URL.
	 *
	 * @param string $image_url     The image URL.
	 * @param int    $attachment_id The attachment ID.
	 */
	private function add_image_by_url_or_id( $image_url, $attachment_id ) {
		if ( $attachment_id !== 0 ) {
			$this->add_image_by_id( $attachment_id );
			return;
		}
		$this->add_image_by_url( $image_url );
	}

	/**
	 * Adds an image based on a given URL, and attempts to be smart about it.
	 *
	 * @param string $url The given URL.
	 *
	 * @return void
	 */
	protected function add_image_by_url( $url ) {
		if ( $url !== '' ) {
			$attachment_id = WPSEO_Image_Utils::get_attachment_by_url( $url );
			if ( $attachment_id > 0 ) {
				$this->add_image_by_id( $attachment_id );
				return;
			}
			$this->add_image( array( 'url' => $url ) );
		}
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
	 * @return void
	 */
	protected function add_image_by_id( $attachment_id ) {
		$attachment = WPSEO_Image_Utils::find_correct_image_size( $attachment_id );
		$alt_text   = WPSEO_Image_Utils::get_image_alt_tag( $attachment_id );

		if ( $attachment ) {
			$attachment['alt'] = $alt_text;
			$this->add_image( $attachment );

			return;
		}

		$image = wp_get_attachment_image_src( $attachment_id, 'full' );
		if ( $image ) {
			$attachment = array(
				'url'    => $image[0],
				'width'  => $image[1],
				'height' => $image[2],
				'alt'    => $alt_text,
				'type'   => get_post_mime_type( $attachment_id ),
			);
			$this->add_image( $attachment );
		}
	}

	/**
	 * Sets the images based on the page type.
	 */
	private function set_images() {
		/**
		 * Filter: wpseo_add_opengraph_images - Allow developers to add images to the OpenGraph tags.
		 *
		 * @api WPSEO_OpenGraph_Image The current object.
		 */
		do_action( 'wpseo_add_opengraph_images', $this );

		switch ( true ) {
			case is_front_page():
				$this->set_front_page_image();
				break;
			case is_home():
				$this->set_posts_page_image();
				break;
			case is_attachment():
				$this->set_attachment_page_image();
				break;
			case is_singular():
				$this->set_singular_image();
				break;
			case is_category():
			case is_tag():
			case is_tax():
				$this->set_taxonomy_image();
		}

		/**
		 * Filter: wpseo_add_opengraph_additional_images - Allows to add additional images to the OpenGraph tags.
		 *
		 * @api WPSEO_OpenGraph_Image The current object.
		 */
		do_action( 'wpseo_add_opengraph_additional_images', $this );

		$this->maybe_set_default_image();
	}
}
