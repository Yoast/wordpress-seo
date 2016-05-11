<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Parses images from the given post.
 */
class WPSEO_Sitemap_Image_Parser {

	/** @var string $home_url Holds the home_url() value to speed up loops. */
	protected $home_url = '';

	/** @var string $host Holds site URL hostname. */
	protected $host = '';

	/** @var string $scheme Holds site URL protocol. */
	protected $scheme = 'http';

	/** @var array $attachments Cached set of attachments for multiple posts. */
	protected $attachments = array();

	/**
	 * Set up URL properties for reuse.
	 */
	public function __construct() {

		$this->home_url = home_url();
		$parsed_home    = parse_url( $this->home_url );

		if ( ! empty( $parsed_home['host'] ) ) {
			$this->host = str_replace( 'www.', '', $parsed_home['host'] );
		}

		if ( ! empty( $parsed_home['scheme'] ) ) {
			$this->scheme = $parsed_home['scheme'];
		}
	}

	/**
	 * Get set of image data sets for the given post.
	 *
	 * @param object $post Post object to get images for.
	 *
	 * @return array
	 */
	public function get_images( $post ) {

		$images = array();

		if ( ! is_object( $post ) ) {
			return $images;
		}

		$thumbnail_id = get_post_thumbnail_id( $post->ID );

		if ( $thumbnail_id ) {

			$src      = $this->get_absolute_url( $this->image_url( $thumbnail_id ) );
			$alt      = get_post_meta( $thumbnail_id, '_wp_attachment_image_alt', true );
			$title    = get_post_field( 'post_title', $thumbnail_id );
			$images[] = $this->get_image_item( $post, $src, $title, $alt );
		}

		$unfiltered_images = $this->parse_html_images( $post->post_content );

		foreach ( $unfiltered_images as $image ) {
			$images[] = $this->get_image_item( $post, $image['src'], $image['title'], $image['alt'] );
		}

		foreach ( $this->parse_galleries( $post->post_content, $post->ID ) as $attachment ) {

			$src = $this->get_absolute_url( $this->image_url( $attachment->ID ) );
			$alt = get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true );

			$images[] = $this->get_image_item( $post, $src, $attachment->post_title, $alt );
		}

		if ( 'attachment' === $post->post_type && wp_attachment_is_image( $post ) ) {

			$src      = $this->get_absolute_url( $this->image_url( $post->ID ) );
			$alt      = get_post_meta( $post->ID, '_wp_attachment_image_alt', true );

			$images[] = $this->get_image_item( $post, $src, $post->post_title, $alt );
		}

		/**
		 * Filter images to be included for the post in XML sitemap.
		 *
		 * @param array $images  Array of image items.
		 * @param int   $post_id ID of the post.
		 */
		$images = apply_filters( 'wpseo_sitemap_urlimages', $images, $post->ID );

		return $images;
	}

	/**
	 * Parse `<img />` tags in post content.
	 *
	 * @param string $content Content string to parse.
	 *
	 * @return array
	 */
	private function parse_html_images( $content ) {

		$images = array();

		if ( ! class_exists( 'DOMDocument' ) ) {
			return $images;
		}

		if ( empty( $content ) ) {
			return $images;
		}

		$post_dom = new DOMDocument();
		$post_dom->loadHTML( $content );

		/** @var DOMElement $img */
		foreach ( $post_dom->getElementsByTagName( 'img' ) as $img ) {

			$src = $img->getAttribute( 'src' );

			if ( empty( $src ) ) {
				continue;
			}

			$class = $img->getAttribute( 'class' );

			if ( // This detects WP-inserted images, which we need to upsize. R.
				! empty( $class )
				&& false === strpos( $class, 'size-full' )
				&& preg_match( '|wp-image-(?P<id>\d+)|', $class, $matches )
				&& get_post_status( $matches['id'] )
			) {
				$src = $this->image_url( $matches['id'] );
			}

			$src = $this->get_absolute_url( $src );

			if ( strpos( $src, $this->host ) === false ) {
				continue;
			}

			if ( $src !== esc_url( $src ) ) {
				continue;
			}

			$images[] = array(
				'src'   => $src,
				'title' => $img->getAttribute( 'title' ),
				'alt'   => $img->getAttribute( 'alt' ),
			);
		}

		return $images;
	}

	/**
	 * Parse gallery shortcodes in a given content.
	 *
	 * @param string $content Content string.
	 * @param int    $post_id Optional ID of post being parsed.
	 *
	 * @return array Set of attachment objects.
	 */
	private function parse_galleries( $content, $post_id = 0 ) {

		$attachments = array();
		$galleries   = $this->get_content_galleries( $content );

		foreach ( $galleries as $gallery ) {

			$id = $post_id;

			if ( ! empty( $gallery['id'] ) ) {
				$id = intval( $gallery['id'] );
			}

			// Forked from core gallery_shortcode() to have exact same logic. R.
			if ( ! empty( $gallery['ids'] ) ) {
				$gallery['include'] = $gallery['ids'];
			}

			$gallery_attachments = array();

			if ( ! empty( $gallery['include'] ) ) {

				$_attachments = get_posts( array(
					'include'        => $gallery['include'],
					'post_status'    => 'inherit',
					'post_type'      => 'attachment',
					'post_mime_type' => 'image',
				) );

				foreach ( $_attachments as $key => $val ) {
					$gallery_attachments[ $val->ID ] = $_attachments[ $key ];
				}
			}
			elseif ( ! empty( $gallery['exclude'] ) && ! empty( $id ) ) {

				$gallery_attachments = get_children( array(
					'post_parent'    => $id,
					'exclude'        => $gallery['exclude'],
					'post_status'    => 'inherit',
					'post_type'      => 'attachment',
					'post_mime_type' => 'image',
				) );
			}
			elseif ( ! empty( $id ) ) {

				$gallery_attachments = get_children( array(
					'post_parent'    => $id,
					'post_status'    => 'inherit',
					'post_type'      => 'attachment',
					'post_mime_type' => 'image',
				) );
			}

			$attachments = array_merge( $attachments, $gallery_attachments );
		}

		return array_unique( $attachments, SORT_REGULAR );
	}

	/**
	 * Retrieves galleries from the passed content.
	 *
	 * Forked from core to skip executing shortcodes for performance.
	 *
	 * @param string $content Content to parse for shortcodes.
	 *
	 * @return array A list of arrays, each containing gallery data.
	 */
	protected function get_content_galleries( $content ) {

		if ( ! has_shortcode( $content, 'gallery' ) ) {
			return array();
		}

		$galleries = array();

		if ( ! preg_match_all( '/' . get_shortcode_regex() . '/s', $content, $matches, PREG_SET_ORDER ) ) {
			return $galleries;
		}

		foreach ( $matches as $shortcode ) {
			if ( 'gallery' === $shortcode[2] ) {

				$attributes = shortcode_parse_atts( $shortcode[3] );

				if ( '' === $attributes ) { // Valid shortcode without any attributes. R.
					$attributes = array();
				}

				$galleries[] = $attributes;
			}
		}

		return $galleries;
	}

	/**
	 * Get image item array with filters applied.
	 *
	 * @param WP_Post $post  Post object for the context.
	 * @param string  $src   Image URL.
	 * @param string  $title Optional image title.
	 * @param string  $alt   Optional image alt text.
	 *
	 * @return array
	 */
	protected function get_image_item( $post, $src, $title = '', $alt = '' ) {

		$image = array();

		/**
		 * Filter image URL to be included in XML sitemap for the post.
		 *
		 * @param string $src  Image URL.
		 * @param object $post Post object.
		 */
		$image['src'] = apply_filters( 'wpseo_xml_sitemap_img_src', $src, $post );

		if ( ! empty( $title ) ) {
			$image['title'] = $title;
		}

		if ( ! empty( $alt ) ) {
			$image['alt'] = $alt;
		}

		/**
		 * Filter image data to be included in XML sitemap for the post.
		 *
		 * @param array  $image {
		 *                      Array of image data.
		 *
		 * @type string  $src   Image URL.
		 * @type string  $title Image title attribute (optional).
		 * @type string  $alt   Image alt attribute (optional).
		 * }
		 *
		 * @param object $post  Post object.
		 */
		return apply_filters( 'wpseo_xml_sitemap_img', $image, $post );
	}

	/**
	 * Get attached image URL. Adapted from core for speed.
	 *
	 * @param int $post_id ID of the post.
	 *
	 * @return string
	 */
	private function image_url( $post_id ) {

		static $uploads;

		if ( empty( $uploads ) ) {
			$uploads = wp_upload_dir();
		}

		if ( false !== $uploads['error'] ) {
			return '';
		}

		$file = get_post_meta( $post_id, '_wp_attached_file', true );

		if ( empty( $file ) ) {
			return '';
		}

		// Check that the upload base exists in the file location.
		if ( 0 === strpos( $file, $uploads['basedir'] ) ) {
			return str_replace( $uploads['basedir'], $uploads['baseurl'], $file );
		}

		// Replace file location with url location.
		if ( false !== strpos( $file, 'wp-content/uploads' ) ) {
			return $uploads['baseurl'] . substr( $file, ( strpos( $file, 'wp-content/uploads' ) + 18 ) );
		}

		// It's a newly uploaded file, therefore $file is relative to the baseurl.
		return $uploads['baseurl'] . "/$file";
	}

	/**
	 * Make absolute URL for domain or protocol-relative one.
	 *
	 * @param string $src URL to process.
	 *
	 * @return string
	 */
	protected function get_absolute_url( $src ) {

		if ( WPSEO_Utils::is_url_relative( $src ) === true ) {

			if ( $src[0] !== '/' ) {
				return $src;
			}

			// The URL is relative, we'll have to make it absolute.
			return $this->home_url . $src;
		}

		if ( strpos( $src, 'http' ) !== 0 ) {
			// Protocol relative url, we add the scheme as the standard requires a protocol.
			return $this->scheme . ':' . $src;
		}

		return $src;
	}

	/**
	 * Cache attached images and thumbnails for a set of posts.
	 *
	 * @deprecated 3.3 Blanket caching no longer makes sense with modern galleries. R.
	 */
	public function cache_attachments() {

		_deprecated_function( __FUNCTION__, '3.3' );
	}
}
