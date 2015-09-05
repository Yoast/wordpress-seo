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

		$parsed_home  = parse_url( $this->home_url );

		if ( isset( $parsed_home['host'] ) && ! empty( $parsed_home['host'] ) ) {
			$this->host = str_replace( 'www.', '', $parsed_home['host'] );
		}

		if ( isset( $parsed_home['scheme'] ) && ! empty( $parsed_home['scheme'] ) ) {
			$this->scheme = $parsed_home['scheme'];
		}
	}

	/**
	 * @param array $post_ids Set of post IDs to cache attachments for.
	 */
	public function cache_attachments( $post_ids ) {

		$imploded_post_ids = implode( $post_ids, ',' );

		$this->attachments = $this->get_attachments( $imploded_post_ids );
		$thumbnails        = $this->get_thumbnails( $imploded_post_ids );

		$this->do_attachment_ids_caching( $this->attachments, $thumbnails );
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

		$content = $post->post_content;
		$content = '<p><img src="' . $this->image_url( get_post_thumbnail_id( $post->ID ) ) . '" alt="' . $post->post_title . '" /></p>' . $content;

		if ( preg_match_all( '`<img [^>]+>`', $content, $matches ) ) {

			$images = $this->parse_matched_images( $matches[0], $post );
		}

		if ( strpos( $content, '[gallery' ) !== false ) {

			$images = array_merge( $images, $this->parse_attachments( $post ) );
		}

		// TODO document filter. R.
		$images = apply_filters( 'wpseo_sitemap_urlimages', $images, $post->ID );

		return $images;
	}

	/**
	 * Getting the attachments from database.
	 *
	 * @param string $post_ids Set of post IDs.
	 *
	 * @return mixed
	 */
	private function get_attachments( $post_ids ) {

		global $wpdb;

		$child_query = "
			SELECT ID, post_title, post_parent
			FROM {$wpdb->posts}
			WHERE post_status = 'inherit'
				AND post_type = 'attachment'
				AND post_parent IN (" . $post_ids . ')';
		$wpdb->query( $child_query );
		$attachments = $wpdb->get_results( $child_query );

		return $attachments;
	}

	/**
	 * Getting thumbnails.
	 *
	 * @param array $post_ids Set of post IDs.
	 *
	 * @return mixed
	 */
	private function get_thumbnails( $post_ids ) {

		global $wpdb;

		$thumbnail_query = "
			SELECT meta_value
			FROM {$wpdb->postmeta}
			WHERE meta_key = '_thumbnail_id'
				AND post_id IN (" . $post_ids . ')';
		$wpdb->query( $thumbnail_query );
		$thumbnails = $wpdb->get_results( $thumbnail_query );

		return $thumbnails;
	}

	/**
	 * Parsing attachment_ids and do the caching.
	 *
	 * Function will pluck ID from attachments and meta_value from thumbnails and marge them into one array. This
	 * array will be used to do the caching
	 *
	 * @param array $attachments Set of attachments data.
	 * @param array $thumbnails  Set of thumbnail IDs.
	 */
	private function do_attachment_ids_caching( $attachments, $thumbnails ) {

		$attachment_ids = wp_list_pluck( $attachments, 'ID' );
		$thumbnail_ids  = wp_list_pluck( $thumbnails, 'meta_value' );

		$attachment_ids = array_unique( array_merge( $thumbnail_ids, $attachment_ids ) );

		_prime_post_caches( $attachment_ids );
		update_meta_cache( 'post', $attachment_ids );
	}

	/**
	 * Parsing the matched images
	 *
	 * @param array  $matches Set of matches.
	 * @param object $post    Post object.
	 *
	 * @return array
	 */
	private function parse_matched_images( $matches, $post ) {

		$return = array();

		foreach ( $matches as $img ) {

			if ( ! preg_match( '`src=["\']([^"\']+)["\']`', $img, $match ) ) {
				continue;
			}

			$src = $match[1];

			if ( WPSEO_Utils::is_url_relative( $src ) === true ) {

				if ( $src[0] !== '/' ) {
					continue;
				}

				// The URL is relative, we'll have to make it absolute.
				$src = $this->home_url . $src;
			}
			elseif ( strpos( $src, 'http' ) !== 0 ) {
				// Protocol relative url, we add the scheme as the standard requires a protocol.
				$src = $this->scheme . ':' . $src;
			}

			if ( strpos( $src, $this->host ) === false ) {
				continue;
			}

			if ( $src != esc_url( $src ) ) {
				continue;
			}

			if ( isset( $return[ $src ] ) ) {
				continue;
			}

			$image = array(
				'src' => apply_filters( 'wpseo_xml_sitemap_img_src', $src, $post ), // TODO document filter. R.
			);

			if ( preg_match( '`title=["\']([^"\']+)["\']`', $img, $title_match ) ) {
				$image['title'] = str_replace( array( '-', '_' ), ' ', $title_match[1] );
			}
			unset( $title_match );

			if ( preg_match( '`alt=["\']([^"\']+)["\']`', $img, $alt_match ) ) {
				$image['alt'] = str_replace( array( '-', '_' ), ' ', $alt_match[1] );
			}
			unset( $alt_match );

			$image    = apply_filters( 'wpseo_xml_sitemap_img', $image, $post ); // TODO document filter. R.
			$return[] = $image;

			unset( $match, $src );
		}

		return $return;
	}

	/**
	 * Parses the given attachments.
	 *
	 * @param WP_Post $post        Post object.
	 *
	 * @return array
	 */
	private function parse_attachments( $post ) {

		$return = array();

		if ( empty( $this->attachments ) ) {
			return $return;
		}

		foreach ( $this->attachments as $attachment ) {
			if ( $attachment->post_parent !== $post->ID ) {
				continue;
			}

			$src   = $this->image_url( $attachment->ID );
			$image = array(
				'src' => apply_filters( 'wpseo_xml_sitemap_img_src', $src, $post ), // TODO document filter. R.
			);

			$alt = get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true );
			if ( $alt !== '' ) {
				$image['alt'] = $alt;
			}
			unset( $alt );

			$image['title'] = $attachment->post_title;

			$image = apply_filters( 'wpseo_xml_sitemap_img', $image, $post ); // TODO document filter. R.

			$return[] = $image;
		}

		return $return;
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

		// TODO check all this logic, looks messy. R.
		if ( 0 === strpos( $file, $uploads['basedir'] ) ) { // Check that the upload base exists in the file location.
			$url = str_replace( $uploads['basedir'], $uploads['baseurl'], $file );
		}
		// Replace file location with url location.
		elseif ( false !== strpos( $file, 'wp-content/uploads' ) ) {
			$url = $uploads['baseurl'] . substr( $file, ( strpos( $file, 'wp-content/uploads' ) + 18 ) );
		}
		// It's a newly uploaded file, therefore $file is relative to the baseurl.
		else {
			$url = $uploads['baseurl'] . "/$file";
		}

		return $url;
	}
}
