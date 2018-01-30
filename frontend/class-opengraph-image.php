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
	 * @var array $images Holds the images that have been put out as OG image.
	 */
	private $images = array();

	/**
	 * @todo This needs to be refactored since we only hold one set of dimensions for multiple images. R.
	 * @var array $dimensions Holds image dimensions, if determined.
	 */
	protected $dimensions = array();

	/**
	 * Constructor.
	 *
	 * @param string|boolean $image   Optional image URL.
	 */
	public function __construct( $image = false ) {
		// If an image was not supplied or could not be added.
		if ( empty( $image ) || ! $this->add_image( $image ) ) {
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
	 * Return the dimensions array.
	 *
	 * @return array
	 */
	public function get_dimensions() {
		return $this->dimensions;
	}

	/**
	 * Display an OpenGraph image tag.
	 *
	 * @param string $img Source URL to the image.
	 *
	 * @return bool
	 */
	public function add_image( $img ) {

		$original = trim( $img );

		// Filter: 'wpseo_opengraph_image' - Allow changing the OpenGraph image.
		$img = trim( apply_filters( 'wpseo_opengraph_image', $img ) );

		if ( $original !== $img ) {
			$this->dimensions = array();
		}

		if ( empty( $img ) ) {
			return false;
		}

		if ( WPSEO_Utils::is_url_relative( $img ) === true ) {
			$img = $this->get_relative_path( $img );
		}

		if ( in_array( $img, $this->images, true ) ) {
			return false;
		}
		array_push( $this->images, $img );

		return true;
	}

	/**
	 * Check if page is front page or singular and call the corresponding functions. If not, call get_default_image.
	 */
	private function set_images() {

		/**
		 * Filter: wpseo_add_opengraph_images - Allow developers to add images to the OpenGraph tags.
		 *
		 * @api WPSEO_OpenGraph_Image The current object.
		 */
		do_action( 'wpseo_add_opengraph_images', $this );

		if ( is_front_page() ) {
			$this->get_front_page_image();
		}
		elseif ( is_home() ) { // Posts page, which won't be caught by is_singular() below.
			$this->get_posts_page_image();
		}

		$frontend_page_type = new WPSEO_Frontend_Page_Type();
		if ( $frontend_page_type->is_simple_page() ) {
			$this->get_singular_image( $frontend_page_type->get_simple_page_id() );
		}

		if ( is_category() || is_tax() || is_tag() ) {
			$this->get_opengraph_image_taxonomy();
		}

		/**
		 * Filter: wpseo_add_opengraph_additional_images - Allows to add additional images to the OpenGraph tags.
		 *
		 * @api WPSEO_OpenGraph_Image The current object.
		 */
		do_action( 'wpseo_add_opengraph_additional_images', $this );

		$this->get_default_image();
	}

	/**
	 * If the frontpage image exists, call add_image.
	 */
	private function get_front_page_image() {
		if ( WPSEO_Options::get( 'og_frontpage_image', '' ) !== '' ) {
			$this->add_image( WPSEO_Options::get( 'og_frontpage_image' ) );
		}
	}

	/**
	 * Get the images of the posts page.
	 */
	private function get_posts_page_image() {

		$post_id = get_option( 'page_for_posts' );

		if ( $this->get_opengraph_image_post( $post_id ) ) {
			return;
		}

		if ( $this->get_featured_image( $post_id ) ) {
			return;
		}
	}

	/**
	 * Get the images of the singular post.
	 *
	 * @param null|int $post_id The post id to get the images for.
	 */
	private function get_singular_image( $post_id = null ) {
		if ( $post_id === null ) {
			$post_id = get_the_ID();
		}

		if ( $this->get_opengraph_image_post( $post_id ) ) {
			return;
		}

		if ( $this->get_attachment_page_image( $post_id ) ) {
			return;
		}

		if ( $this->get_featured_image( $post_id ) ) {
			return;
		}

		$this->get_content_images( get_post( $post_id ) );
	}

	/**
	 * Get default image and call add_image.
	 */
	private function get_default_image() {
		if ( count( $this->images ) === 0 && WPSEO_Options::get( 'og_default_image', '' ) !== '' ) {
			$this->add_image( WPSEO_Options::get( 'og_default_image' ) );
		}
	}

	/**
	 * If opengraph-image is set, call add_image and return true.
	 *
	 * @param int $post_id Optional post ID to use.
	 *
	 * @return bool
	 */
	private function get_opengraph_image_post( $post_id = 0 ) {
		$ogimg = WPSEO_Meta::get_value( 'opengraph-image', $post_id );
		if ( $ogimg !== '' ) {
			$this->add_image( $ogimg );

			return true;
		}

		return false;
	}

	/**
	 * Check if taxonomy has an image and add this image.
	 */
	private function get_opengraph_image_taxonomy() {
		$ogimg = WPSEO_Taxonomy_Meta::get_meta_without_term( 'opengraph-image' );
		if ( $ogimg !== '' ) {
			$this->add_image( $ogimg );
		}
	}

	/**
	 * If there is a featured image, check image size. If image size is correct, call add_image and return true.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	private function get_featured_image( $post_id ) {

		if ( has_post_thumbnail( $post_id ) ) {
			/**
			 * Filter: 'wpseo_opengraph_image_size' - Allow changing the image size used for OpenGraph sharing.
			 *
			 * @api string $unsigned Size string.
			 */
			$thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), apply_filters( 'wpseo_opengraph_image_size', 'original' ) );

			if ( $this->check_featured_image_size( $thumb ) ) {

				$this->dimensions['width']  = $thumb[1];
				$this->dimensions['height'] = $thumb[2];

				return $this->add_image( $thumb[0] );
			}
		}

		return false;
	}

	/**
	 * If this is an attachment page, call add_image with the attachment and return true.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	private function get_attachment_page_image( $post_id ) {
		if ( get_post_type( $post_id ) === 'attachment' ) {
			$mime_type = get_post_mime_type( $post_id );
			switch ( $mime_type ) {
				case 'image/jpeg':
				case 'image/png':
				case 'image/gif':
					return $this->add_image( wp_get_attachment_url( $post_id ) );
			}
		}

		return false;
	}

	/**
	 * Filter: 'wpseo_pre_analysis_post_content' - Allow filtering the content before analysis.
	 *
	 * @api string $post_content The Post content string.
	 *
	 * @param object $post The post object.
	 */
	private function get_content_images( $post ) {
		$content = apply_filters( 'wpseo_pre_analysis_post_content', $post->post_content, $post );

		if ( preg_match_all( '`<img [^>]+>`', $content, $matches ) ) {
			foreach ( $matches[0] as $img ) {
				if ( preg_match( '`src=(["\'])(.*?)\1`', $img, $match ) ) {
					$this->add_image( $match[2] );
				}
			}
		}
	}

	/**
	 * Check size of featured image. If image is too small, return false, else return true.
	 *
	 * @param array $img_data Image info from wp_get_attachment_image_src: url, width, height, icon.
	 *
	 * @return bool
	 */
	private function check_featured_image_size( $img_data ) {

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
	 * Get the relative path of the image.
	 *
	 * @param array $img Image data array.
	 *
	 * @return bool|string
	 */
	private function get_relative_path( $img ) {
		if ( $img[0] !== '/' ) {
			return false;
		}

		// If it's a relative URL, it's relative to the domain, not necessarily to the WordPress install, we
		// want to preserve domain name and URL scheme (http / https) though.
		$parsed_url = wp_parse_url( home_url() );
		$img        = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $img;

		return $img;
	}
}
