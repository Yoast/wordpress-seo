<?php
/**
 * WPSEO plugin file.
 *
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

	/** @var string $charset Holds blog charset value for use in DOM parsing.  */
	protected $charset = 'UTF-8';

	/**
	 * Set up URL properties for reuse.
	 */
	public function __construct() {

		$this->home_url = home_url();
		$parsed_home    = wp_parse_url( $this->home_url );

		if ( ! empty( $parsed_home['host'] ) ) {
			$this->host = str_replace( 'www.', '', $parsed_home['host'] );
		}

		if ( ! empty( $parsed_home['scheme'] ) ) {
			$this->scheme = $parsed_home['scheme'];
		}

		$this->charset = esc_attr( get_bloginfo( 'charset' ) );
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
			$alt      = WPSEO_Image_Utils::get_alt_tag( $thumbnail_id );
			$title    = get_post_field( 'post_title', $thumbnail_id );
			$images[] = $this->get_image_item( $post, $src, $title, $alt );
		}

		/**
		 * Filter: 'wpseo_sitemap_content_before_parse_html_images' - Filters the post content
		 * before it is parsed for images.
		 *
		 * @param string $content The raw/unprocessed post content.
		 */
		$content = apply_filters( 'wpseo_sitemap_content_before_parse_html_images', $post->post_content );

		$unfiltered_images = $this->parse_html_images( $content );

		foreach ( $unfiltered_images as $image ) {
			$images[] = $this->get_image_item( $post, $image['src'], $image['title'], $image['alt'] );
		}

		foreach ( $this->parse_galleries( $post->post_content, $post->ID ) as $attachment ) {

			$src = $this->get_absolute_url( $this->image_url( $attachment->ID ) );
			$alt = WPSEO_Image_Utils::get_alt_tag( $attachment->ID );

			$images[] = $this->get_image_item( $post, $src, $attachment->post_title, $alt );
		}

		if ( 'attachment' === $post->post_type && wp_attachment_is_image( $post ) ) {

			$src = $this->get_absolute_url( $this->image_url( $post->ID ) );
			$alt = WPSEO_Image_Utils::get_alt_tag( $post->ID );

			$images[] = $this->get_image_item( $post, $src, $post->post_title, $alt );
		}

		foreach ( $images as $key => $image ) {

			if ( empty( $image['src'] ) ) {
				unset( $images[ $key ] );
			}
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
	 * @param object $term Term to get images from description for.
	 *
	 * @return array
	 */
	public function get_term_images( $term ) {

		$images = $this->parse_html_images( $term->description );

		foreach ( $this->parse_galleries( $term->description ) as $attachment ) {

			$images[] = array(
				'src'   => $this->get_absolute_url( $this->image_url( $attachment->ID ) ),
				'title' => $attachment->post_title,
				'alt'   => WPSEO_Image_Utils::get_alt_tag( $attachment->ID ),
			);
		}

		return $images;
	}

	/**
	 * Parse `<img />` tags in content.
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

		// Prevent DOMDocument from bubbling warnings about invalid HTML.
		libxml_use_internal_errors( true );

		$post_dom = new DOMDocument();
		$post_dom->loadHTML( '<?xml encoding="' . $this->charset . '">' . $content );

		// Clear the errors, so they don't get kept in memory.
		libxml_clear_errors();

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
	protected function parse_galleries( $content, $post_id = 0 ) {

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

			$gallery_attachments = $this->get_gallery_attachments( $id, $gallery );


			$attachments = array_merge( $attachments, $gallery_attachments );
		}

		if ( PHP_VERSION_ID >= 50209 ) {
			// phpcs:ignore PHPCompatibility.PHP.NewFunctionParameters.array_unique_sort_flagsFound -- Wrapped in version check.
			return array_unique( $attachments, SORT_REGULAR );
		}

		return $attachments;
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
	 * Get attached image URL with filters applied. Adapted from core for speed.
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
			$src = str_replace( $uploads['basedir'], $uploads['baseurl'], $file );
		}
		elseif ( false !== strpos( $file, 'wp-content/uploads' ) ) {
			$src = $uploads['baseurl'] . substr( $file, ( strpos( $file, 'wp-content/uploads' ) + 18 ) );
		}
		else {
			// It's a newly uploaded file, therefore $file is relative to the baseurl.
			$src = $uploads['baseurl'] . '/' . $file;
		}

		return apply_filters( 'wp_get_attachment_url', $src, $post_id );
	}

	/**
	 * Make absolute URL for domain or protocol-relative one.
	 *
	 * @param string $src URL to process.
	 *
	 * @return string
	 */
	protected function get_absolute_url( $src ) {

		if ( empty( $src ) || ! is_string( $src ) ) {
			return $src;
		}

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
	 * Returns the attachments for a gallery.
	 *
	 * @param int   $id      The post id.
	 * @param array $gallery The gallery config.
	 *
	 * @return array The selected attachments.
	 */
	protected function get_gallery_attachments( $id, $gallery ) {

		// When there are attachments to include.
		if ( ! empty( $gallery['include'] ) ) {
			return $this->get_gallery_attachments_for_included( $gallery['include'] );
		}

		// When $id is empty, just return empty array.
		if ( empty( $id ) ) {
			return array();
		}

		return $this->get_gallery_attachments_for_parent( $id, $gallery );
	}

	/**
	 * Returns the attachments for the given id.
	 *
	 * @param int   $id      The post id.
	 * @param array $gallery The gallery config.
	 *
	 * @return array The selected attachments.
	 */
	protected function get_gallery_attachments_for_parent( $id, $gallery ) {
		$query = array(
			'posts_per_page' => -1,
			'post_parent'    => $id,
		);

		// When there are posts that should be excluded from result set.
		if ( ! empty( $gallery['exclude'] ) ) {
			$query['post__not_in'] = wp_parse_id_list( $gallery['exclude'] );
		}

		return $this->get_attachments( $query );
	}

	/**
	 * Returns an array with attachments for the post ids that will be included.
	 *
	 * @param array $include Array with ids to include.
	 *
	 * @return array The found attachments.
	 */
	protected function get_gallery_attachments_for_included( $include ) {
		$ids_to_include = wp_parse_id_list( $include );
		$attachments    = $this->get_attachments(
			array(
				'posts_per_page' => count( $ids_to_include ),
				'post__in'       => $ids_to_include,
			)
		);

		$gallery_attachments = array();
		foreach ( $attachments as $key => $val ) {
			$gallery_attachments[ $val->ID ] = $val;
		}

		return $gallery_attachments;
	}

	/**
	 * Returns the attachments.
	 *
	 * @param array $args Array with query args.
	 *
	 * @return array The found attachments.
	 */
	protected function get_attachments( $args ) {
		$default_args = array(
			'post_status'         => 'inherit',
			'post_type'           => 'attachment',
			'post_mime_type'      => 'image',

			// Defaults taken from function get_posts.
			'orderby'             => 'date',
			'order'               => 'DESC',
			'meta_key'            => '',
			'meta_value'          => '',
			'suppress_filters'    => true,
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
		);

		$args = wp_parse_args( $args, $default_args );

		$get_attachments = new WP_Query();
		return $get_attachments->query( $args );
	}
}
