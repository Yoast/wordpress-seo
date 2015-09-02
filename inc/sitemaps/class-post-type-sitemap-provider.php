<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Post_Type_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/** @var string $home_url Holds the home_url() value to speed up loops. */
	private $home_url = '';

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {

		$this->home_url = home_url();
	}

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return boolean
	 */
	public function handles_type( $type ) {

		return post_type_exists( $type );
	}

	/**
	 * @param int $max_entries Entries per sitemap.
	 *
	 * @return array
	 */
	public function get_index_links( $max_entries) {

		global $wpdb;

		$options    = WPSEO_Options::get_all();
		$post_types = get_post_types( array( 'public' => true ) );

		$index = array();

		foreach ( $post_types as $post_type ) {

			if ( ! empty( $options[ "post_types-{$post_type}-not_in_sitemap" ] ) ) {
				continue;
			}

			// TODO document filter. R.
			if ( apply_filters( 'wpseo_sitemap_exclude_post_type', false, $post_type ) ) {
				continue;
			}

			// Using same filters for filtering join and where parts of the query.
			$join_filter  = apply_filters( 'wpseo_typecount_join', '', $post_type );
			$where_filter = apply_filters( 'wpseo_typecount_where', '', $post_type );

			// Using the same query with build_post_type_map($post_type) function to count number of posts.
			$sql   = "
				SELECT COUNT(ID)
				FROM $wpdb->posts
				{$join_filter}
				WHERE post_status IN ('publish','inherit')
					AND post_password = ''
					AND post_date != '0000-00-00 00:00:00'
					AND post_type = %s
					{$where_filter}
			";
			$count = $wpdb->get_var( $wpdb->prepare( $sql, $post_type ) );

			if ( $count === 0 ) {
				continue;
			}

			$max_pages = ( $count > $max_entries ) ? (int) ceil( $count / $max_entries ) : 1;

			for ( $i = 0; $i < $max_pages; $i++ ) {
				$count = ( $max_pages > 1 ) ? ( $i + 1 ) : '';

				if ( empty( $count ) || $count === $max_pages ) {
					$date = WPSEO_Sitemaps::get_last_modified_gmt( $post_type );
				}
				else {
					$sql       = "
						SELECT post_modified_gmt
						FROM (
							SELECT @rownum:=@rownum+1 rownum, $wpdb->posts.post_modified_gmt
							FROM (SELECT @rownum:=0) r, $wpdb->posts
							WHERE post_status IN ('publish','inherit')
								AND post_type = %s
							ORDER BY post_modified_gmt ASC
						) x
						WHERE rownum %%%d=0
					";
					$all_dates = $wpdb->get_col( $wpdb->prepare( $sql, $post_type, $max_entries ) );
					$date      = $all_dates[ $i ];
				}

				$index[] = array(
					'loc'     => wpseo_xml_sitemaps_base_url( $post_type . '-sitemap' . $count . '.xml' ),
					'lastmod' => $date,
				);
			}
		}

		return $index;
	}

	/**
	 * Get set of sitemap link data.
	 *
	 * @param string $type         Sitemap type.
	 * @param int    $max_entries  Entries per sitemap.
	 * @param int    $current_page Current page of the sitemap.
	 *
	 * @return array
	 */
	public function get_sitemap_links( $type, $max_entries, $current_page ) {

		global $wpdb;

		$links     = array();
		$post_type = $type;
		$options   = WPSEO_Options::get_all();

		if (
			! empty( $options[ "post_types-{$post_type}-not_in_sitemap" ] )
			|| in_array( $post_type, array( 'revision', 'nav_menu_item' ) )
			|| apply_filters( 'wpseo_sitemap_exclude_post_type', false, $post_type ) // TODO document filter. R.
		) {
			return $links;
		}

		$steps  = ( 100 > $max_entries ) ? $max_entries : 100;
		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;
		$total  = ( $offset + $max_entries );

		$join_filter  = apply_filters( 'wpseo_typecount_join', '', $post_type );
		$where_filter = apply_filters( 'wpseo_typecount_where', '', $post_type );

		$sql = "
			SELECT COUNT(ID)
			FROM $wpdb->posts
			{$join_filter}
			WHERE post_status IN ('publish','inherit')
				AND post_password = ''
				AND post_date != '0000-00-00 00:00:00'
				AND post_type = %s
			{$where_filter}
		";

		$typecount = $wpdb->get_var( $wpdb->prepare( $sql, $post_type ) );

		if ( $total > $typecount ) {
			$total = $typecount;
		}

		if ( $current_page === 1 ) {

			$front_id = get_option( 'page_on_front' );

			if ( ! $front_id && ( $post_type == 'post' || $post_type == 'page' ) ) {

				$links[] = array(
					'loc' => $this->home_url,
					'pri' => 1,
					'chf' => WPSEO_Sitemaps::filter_frequency( 'homepage', 'daily', $this->home_url ),
				);
			}
			elseif ( $front_id && $post_type == 'post' ) {

				$page_for_posts = get_option( 'page_for_posts' );

				if ( $page_for_posts ) {

					$page_for_posts_url = get_permalink( $page_for_posts );

					$links[] = array(
						'loc' => $page_for_posts_url,
						'pri' => 1,
						'chf' => WPSEO_Sitemaps::filter_frequency( 'blogpage', 'daily', $page_for_posts_url ),
					);
					unset( $page_for_posts_url );
				}
			}

			$archive_url = get_post_type_archive_link( $post_type );
			/**
			 * Filter: 'wpseo_sitemap_post_type_archive_link' - Allow changing the URL Yoast SEO uses in the XML sitemap for this post type archive.
			 *
			 * @api float $archive_url The URL of this archive
			 *
			 * @param string $post_type The post type this archive is for.
			 */
			$archive_url = apply_filters( 'wpseo_sitemap_post_type_archive_link', $archive_url, $post_type );
			if ( $archive_url ) {
				/**
				 * Filter: 'wpseo_xml_post_type_archive_priority' - Allow changing the priority of the URL Yoast SEO uses in the XML sitemap.
				 *
				 * @api float $priority The priority for this URL, ranging from 0 to 1
				 *
				 * @param string $post_type The post type this archive is for.
				 */
				$links[] = array(
					'loc' => $archive_url,
					'pri' => apply_filters( 'wpseo_xml_post_type_archive_priority', 0.8, $post_type ),
					'chf' => WPSEO_Sitemaps::filter_frequency( $post_type . '_archive', 'weekly', $archive_url ),
					'mod' => WPSEO_Sitemaps::get_last_modified_gmt( $post_type ),
				);
			}
		}

		if ( $typecount == 0 && empty( $archive ) ) {

			return $links;
		}

		$stackedurls = array();

		// Make sure you're wpdb->preparing everything you throw into this!!
		$join_filter  = apply_filters( 'wpseo_posts_join', false, $post_type );
		$where_filter = apply_filters( 'wpseo_posts_where', false, $post_type );

		$status = ( $post_type == 'attachment' ) ? 'inherit' : 'publish';

		$parsed_home = parse_url( $this->home_url );
		$host        = '';
		$scheme      = 'http';

		if ( isset( $parsed_home['host'] ) && ! empty( $parsed_home['host'] ) ) {
			$host = str_replace( 'www.', '', $parsed_home['host'] );
		}

		if ( isset( $parsed_home['scheme'] ) && ! empty( $parsed_home['scheme'] ) ) {
			$scheme = $parsed_home['scheme'];
		}


		/**
		 * We grab post_date, post_name and post_status too so we can throw these objects
		 * into get_permalink, which saves a get_post call for each permalink.
		 */
		while ( $total > $offset ) {

			// Optimized query per this thread: http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-performance-suggestion.
			// Also see http://explainextended.com/2009/10/23/mysql-order-by-limit-performance-late-row-lookups/.
			$sql = "
				SELECT l.ID, post_title, post_content, post_name, post_parent, post_modified_gmt, post_date, post_date_gmt
				FROM (
					SELECT ID
					FROM $wpdb->posts
					{$join_filter}
					WHERE post_status = '%s'
						AND post_password = ''
						AND post_type = '%s'
						AND post_date != '0000-00-00 00:00:00'
						{$where_filter}
					ORDER BY post_modified ASC LIMIT %d OFFSET %d
				)
				o JOIN $wpdb->posts l ON l.ID = o.ID ORDER BY l.ID
			";
			$posts = $wpdb->get_results( $wpdb->prepare( $sql, $status, $post_type, $steps, $offset ) );

			$offset += $steps;

			if ( empty( $posts ) ) {
				continue;
			}

			$post_ids = wp_list_pluck( $posts, 'ID' );

			if ( count( $post_ids ) > 0 ) {
				update_meta_cache( 'post', $post_ids );

				$imploded_post_ids = implode( $post_ids, ',' );

				$attachments = $this->get_attachments( $imploded_post_ids );
				$thumbnails  = $this->get_thumbnails( $imploded_post_ids );

				$this->do_attachment_ids_caching( $attachments, $thumbnails );

				unset( $imploded_post_ids );
			}
			unset( $post_ids );

			$posts_to_exclude = explode( ',', $options['excluded-posts'] );

			foreach ( $posts as $post ) {

				$post->post_type   = $post_type;
				$post->post_status = 'publish';
				$post->filter      = 'sample';

				if ( WPSEO_Meta::get_value( 'meta-robots-noindex', $post->ID ) === '1' ) {
					continue;
				}

				if ( in_array( $post->ID, $posts_to_exclude ) ) {
					continue;
				}

				$url = array();

				if (
					isset( $post->post_modified_gmt )
					&& $post->post_modified_gmt !== '0000-00-00 00:00:00'
					&& $post->post_modified_gmt > $post->post_date_gmt
				) {
					$url['mod'] = $post->post_modified_gmt;
				}
				elseif ( $post->post_date_gmt !== '0000-00-00 00:00:00' ) {
					$url['mod'] = $post->post_date_gmt;
				}
				else {
					$url['mod'] = $post->post_date; // TODO does this ever happen? will wreck timezone later R.
				}

				$url['loc'] = get_permalink( $post );

				/**
				 * Filter: 'wpseo_xml_sitemap_post_url' - Allow changing the URL Yoast SEO uses in the XML sitemap.
				 *
				 * Note that only absolute local URLs are allowed as the check after this removes external URLs.
				 *
				 * @api string $url URL to use in the XML sitemap
				 *
				 * @param object $post Post object for the URL.
				 */
				$url['loc'] = apply_filters( 'wpseo_xml_sitemap_post_url', $url['loc'], $post );

				$url['chf'] = WPSEO_Sitemaps::filter_frequency( $post_type . '_single', 'weekly', $url['loc'] );

				/**
				 * Do not include external URLs.
				 * @see https://wordpress.org/plugins/page-links-to/ can rewrite permalinks to external URLs.
				 */
				if ( false === strpos( $url['loc'], $this->home_url ) ) {
					continue;
				}

				$canonical = WPSEO_Meta::get_value( 'canonical', $post->ID );

				if ( $canonical !== '' && $canonical !== $url['loc'] ) {
					/*
					Let's assume that if a canonical is set for this page and it's different from
					   the URL of this post, that page is either already in the XML sitemap OR is on
					   an external site, either way, we shouldn't include it here.
					*/
					continue;
				}
				unset( $canonical );

				if ( $options['trailingslash'] === true && $post->post_type != 'post' ) {
					$url['loc'] = trailingslashit( $url['loc'] );
				}

				$url['pri'] = $this->calculate_priority( $post );

				$url['images'] = array();

				$content = $post->post_content;
				$content = '<p><img src="' . $this->image_url( get_post_thumbnail_id( $post->ID ) ) . '" alt="' . $post->post_title . '" /></p>' . $content;

				if ( preg_match_all( '`<img [^>]+>`', $content, $matches ) ) {
					$url['images'] = $this->parse_matched_images( $matches, $post, $scheme, $host );
				}
				unset( $content, $matches, $img );

				if ( ! empty( $attachments ) && strpos( $post->post_content, '[gallery' ) !== false ) {

					$url['images'] = $this->parse_attachments( $attachments, $post );
				}

				// TODO document filter. R.
				$url['images'] = apply_filters( 'wpseo_sitemap_urlimages', $url['images'], $post->ID );

				if ( ! in_array( $url['loc'], $stackedurls ) ) {
					// Use this filter to adjust the entry before it gets added to the sitemap.
					// TODO document filter. R.
					$url = apply_filters( 'wpseo_sitemap_entry', $url, 'post', $post );
					if ( is_array( $url ) && $url !== array() ) {
						$links[]       = $url;
						$stackedurls[] = $url['loc'];
					}
				}
			}
			unset( $post, $url );
		}

		return $links;
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
			FROM $wpdb->posts
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
			FROM $wpdb->postmeta
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
	 * @param string $scheme  URL scheme.
	 * @param string $host    URL host.
	 *
	 * @return array
	 */
	private function parse_matched_images( $matches, $post, $scheme, $host ) {

		$return = array();

		foreach ( $matches[0] as $img ) {

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
				$src = $scheme . ':' . $src;
			}

			if ( strpos( $src, $host ) === false ) {
				continue;
			}

			if ( $src != esc_url( $src ) ) {
				continue;
			}

			if ( isset( $return[ $src ] ) ) {
				continue;
			}

			$image = array(
				'src' => apply_filters( 'wpseo_xml_sitemap_img_src', $src, $post ),
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
	 * @param array   $attachments Set of attachments.
	 * @param WP_Post $post        Post object.
	 *
	 * @return array
	 */
	private function parse_attachments( $attachments, $post ) {

		$return = array();

		foreach ( $attachments as $attachment ) {
			if ( $attachment->post_parent !== $post->ID ) {
				continue;
			}

			$src   = $this->image_url( $attachment->ID );
			$image = array(
				'src' => apply_filters( 'wpseo_xml_sitemap_img_src', $src, $post ),
			);

			$alt = get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true );
			if ( $alt !== '' ) {
				$image['alt'] = $alt;
			}
			unset( $alt );

			$image['title'] = $attachment->post_title;

			$image = apply_filters( 'wpseo_xml_sitemap_img', $image, $post );

			$return[] = $image;
		}

		return $return;
	}

	/**
	 * Get attached image URL.
	 *
	 * Adapted from core for speed.
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

	/**
	 * Calculate the priority of the post.
	 *
	 * @param WP_Post $post Post object.
	 *
	 * @return float|mixed
	 */
	private function calculate_priority( $post ) {

		$return = 0.6;
		if ( $post->post_parent == 0 && $post->post_type == 'page' ) {
			$return = 0.8;
		}

		$front_id = get_option( 'page_on_front' );

		if ( isset( $front_id ) && $post->ID == $front_id ) {
			$return = 1.0;
		}

		/**
		 * Filter: 'wpseo_xml_post_type_archive_priority' - Allow changing the priority of the URL
		 * Yoast SEO uses in the XML sitemap.
		 *
		 * @api float $priority The priority for this URL, ranging from 0 to 1
		 *
		 * @param string $post_type The post type this archive is for.
		 * @param object $p         The post object.
		 */
		$return = apply_filters( 'wpseo_xml_sitemap_post_priority', $return, $post->post_type, $post );

		return $return;
	}
}
