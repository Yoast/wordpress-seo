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
	 * Cache attached images and thumbnails for a set of posts.
	 *
	 * @param array $post_ids Set of post IDs to cache attachments for.
	 */
	public function cache_attachments( $post_ids ) {

		$imploded_post_ids = implode( $post_ids, ',' );
		$this->attachments = $this->get_attachments( $imploded_post_ids );
		$attachment_ids    = wp_list_pluck( $this->attachments, 'ID' );
		$thumbnail_ids     = $this->get_thumbnails( $imploded_post_ids );
		$attachment_ids    = array_unique( array_merge( $thumbnail_ids, $attachment_ids ) );

		_prime_post_caches( $attachment_ids );
		update_meta_cache( 'post', $attachment_ids );
	}

	/**
	 * Getting the attachments from database.
	 *
	 * @param string $post_ids Set of post IDs.
	 *
	 * @return array
	 */
	private function get_attachments( $post_ids ) {

		global $wpdb;

		$sql = "
			SELECT ID, post_title, post_parent
			FROM {$wpdb->posts}
			WHERE post_status = 'inherit'
				AND post_type = 'attachment'
				AND post_parent IN (" . $post_ids . ')';

		return $wpdb->get_results( $sql );
	}

	/**
	 * Get thumbnail IDs for a set of posts.
	 *
	 * @param array $post_ids Set of post IDs.
	 *
	 * @return array
	 */
	private function get_thumbnails( $post_ids ) {

		global $wpdb;

		$sql = "
			SELECT meta_value
			FROM {$wpdb->postmeta}
			WHERE meta_key = '_thumbnail_id'
				AND post_id IN (" . $post_ids . ')';

		return $wpdb->get_col( $sql );
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

		$content      = get_post_field( 'post_content', $post );
		$thumbnail_id = get_post_thumbnail_id( $post->ID );

		if ( $thumbnail_id ) {
			// Content of title and alt is legacy from previous logic. R.
			$images[] = $this->get_image_item( $post, $this->image_url( $thumbnail_id ), '', $post->post_title );
		}

		$images = array_merge( $images, $this->parse_html_images( $post ) );

		if ( strpos( $content, '[gallery' ) !== false ) {

			$images = array_merge( $images, $this->parse_attachments( $post ) );
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
	 * @param object $post Post object.
	 *
	 * @return array
	 */
	private function parse_html_images( $post ) {

		$images = array();

		if ( ! class_exists( 'DOMDocument' ) ) {
			return $images;
		}

		$post_content = get_post_field( 'post_content', $post );

		if ( empty( $post_content ) ) {
			return $images;
		}

		$post_dom = new DOMDocument();
		$post_dom->loadHTML( $post_content );

		/** @var DOMElement $img */
		foreach ( $post_dom->getElementsByTagName( 'img' ) as $img ) {

			$src = $img->getAttribute( 'src' );

			if ( empty( $src ) ) {
				continue;
			}

			$src = $this->get_absolute_url( $src );

			if ( strpos( $src, $this->host ) === false ) {
				continue;
			}

			if ( $src !== esc_url( $src ) ) {
				continue;
			}

			$image    = $this->get_image_item( $post, $src, $img->getAttribute( 'title' ), $img->getAttribute( 'alt' ) );
			$images[] = $image;
		}

		return $images;
	}

	/**
	 * Parses the given attachments.
	 *
	 * @param WP_Post $post        Post object.
	 *
	 * @return array
	 */
	private function parse_attachments( $post ) {

		$images = array();

		if ( empty( $this->attachments ) ) {
			return $images;
		}

		foreach ( $this->attachments as $attachment ) {

			if ( $attachment->post_parent !== $post->ID ) {
				continue;
			}

			$src = $this->image_url( $attachment->ID );
			$alt = get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true );

			$images[] = $this->get_image_item( $post, $src, $attachment->post_title, $alt );
		}

		return $images;
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
}
