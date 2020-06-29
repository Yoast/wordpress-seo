<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Post_Type_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * Holds image parser instance.
	 *
	 * @var WPSEO_Sitemap_Image_Parser
	 */
	protected static $image_parser;

	/**
	 * Holds instance of classifier for a link.
	 *
	 * @var object
	 */
	protected static $classifier;

	/**
	 * Determines whether images should be included in the XML sitemap.
	 *
	 * @var bool
	 */
	private $include_images;

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {
		add_filter( 'save_post', [ $this, 'save_post' ] );

		/**
		 * Filter - Allows excluding images from the XML sitemap.
		 *
		 * @param bool unsigned True to include, false to exclude.
		 */
		$this->include_images = apply_filters( 'wpseo_xml_sitemap_include_images', true );
	}

	/**
	 * Get the Image Parser.
	 *
	 * @return WPSEO_Sitemap_Image_Parser
	 */
	protected function get_image_parser() {
		if ( ! isset( self::$image_parser ) ) {
			self::$image_parser = new WPSEO_Sitemap_Image_Parser();
		}

		return self::$image_parser;
	}

	/**
	 * Get the Classifier for a link.
	 *
	 * @return WPSEO_Link_Type_Classifier
	 */
	protected function get_classifier() {
		if ( ! isset( self::$classifier ) ) {
			self::$classifier = new WPSEO_Link_Type_Classifier( home_url() );
		}

		return self::$classifier;
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
	 * Retrieves the sitemap links.
	 *
	 * @param int $max_entries Entries per sitemap.
	 *
	 * @return array
	 */
	public function get_index_links( $max_entries ) {
		global $wpdb;

		$post_types          = WPSEO_Post_Type::get_accessible_post_types();
		$post_types          = array_filter( $post_types, [ $this, 'is_valid_post_type' ] );
		$last_modified_times = WPSEO_Sitemaps::get_last_modified_gmt( $post_types, true );
		$index               = [];

		foreach ( $post_types as $post_type ) {

			$total_count = $this->get_post_type_count( $post_type );

			$max_pages = 1;
			if ( $total_count > $max_entries ) {
				$max_pages = (int) ceil( $total_count / $max_entries );
			}

			$all_dates = [];

			if ( $max_pages > 1 ) {
				$post_statuses = array_map( 'esc_sql', WPSEO_Sitemaps::get_post_statuses( $post_type ) );

				$sql = "
				SELECT post_modified_gmt
				    FROM ( SELECT @rownum:=0 ) init 
				    JOIN {$wpdb->posts} USE INDEX( type_status_date )
				    WHERE post_status IN ('" . implode( "','", $post_statuses ) . "')
				      AND post_type = %s
				      AND ( @rownum:=@rownum+1 ) %% %d = 0
				    ORDER BY post_modified_gmt ASC
				";

				$all_dates = $wpdb->get_col( $wpdb->prepare( $sql, $post_type, $max_entries ) );
			}

			for ( $page_counter = 0; $page_counter < $max_pages; $page_counter++ ) {

				$current_page = ( $max_pages > 1 ) ? ( $page_counter + 1 ) : '';
				$date         = false;

				if ( empty( $current_page ) || $current_page === $max_pages ) {

					if ( ! empty( $last_modified_times[ $post_type ] ) ) {
						$date = $last_modified_times[ $post_type ];
					}
				}
				else {
					$date = $all_dates[ $page_counter ];
				}

				$index[] = [
					'loc'     => WPSEO_Sitemaps_Router::get_base_url( $post_type . '-sitemap' . $current_page . '.xml' ),
					'lastmod' => $date,
				];
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
	 * @throws OutOfBoundsException When an invalid page is requested.
	 *
	 * @return array
	 */
	public function get_sitemap_links( $type, $max_entries, $current_page ) {

		$links     = [];
		$post_type = $type;

		if ( ! $this->is_valid_post_type( $post_type ) ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		$steps  = min( 100, $max_entries );
		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;
		$total  = ( $offset + $max_entries );

		$post_type_entries = $this->get_post_type_count( $post_type );

		if ( $total > $post_type_entries ) {
			$total = $post_type_entries;
		}

		if ( $current_page === 1 ) {
			$links = array_merge( $links, $this->get_first_links( $post_type ) );
		}

		// If total post type count is lower than the offset, an invalid page is requested.
		if ( $post_type_entries < $offset ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		if ( $post_type_entries === 0 ) {
			return $links;
		}

		$posts_to_exclude = $this->get_excluded_posts( $type );

		while ( $total > $offset ) {

			$posts = $this->get_posts( $post_type, $steps, $offset );

			$offset += $steps;

			if ( empty( $posts ) ) {
				continue;
			}

			foreach ( $posts as $post ) {

				if ( in_array( $post->ID, $posts_to_exclude, true ) ) {
					continue;
				}

				if ( WPSEO_Meta::get_value( 'meta-robots-noindex', $post->ID ) === '1' ) {
					continue;
				}

				$url = $this->get_url( $post );

				if ( ! isset( $url['loc'] ) ) {
					continue;
				}

				/**
				 * Filter URL entry before it gets added to the sitemap.
				 *
				 * @param array  $url  Array of URL parts.
				 * @param string $type URL type.
				 * @param object $post Data object for the URL.
				 */
				$url = apply_filters( 'wpseo_sitemap_entry', $url, 'post', $post );

				if ( ! empty( $url ) ) {
					$links[] = $url;
				}
			}

			unset( $post, $url );
		}

		return $links;
	}

	/**
	 * Check for relevant post type before invalidation.
	 *
	 * @param int $post_id Post ID to possibly invalidate for.
	 */
	public function save_post( $post_id ) {

		if ( $this->is_valid_post_type( get_post_type( $post_id ) ) ) {
			WPSEO_Sitemaps_Cache::invalidate_post( $post_id );
		}
	}

	/**
	 * Check if post type should be present in sitemaps.
	 *
	 * @param string $post_type Post type string to check for.
	 *
	 * @return bool
	 */
	public function is_valid_post_type( $post_type ) {
		if ( ! WPSEO_Post_Type::is_post_type_accessible( $post_type ) || ! WPSEO_Post_Type::is_post_type_indexable( $post_type ) ) {
			return false;
		}

		/**
		 * Filter decision if post type is excluded from the XML sitemap.
		 *
		 * @param bool   $exclude   Default false.
		 * @param string $post_type Post type name.
		 */
		if ( apply_filters( 'wpseo_sitemap_exclude_post_type', false, $post_type ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Retrieves a list with the excluded post ids.
	 *
	 * @param string $post_type Post type.
	 *
	 * @return array Array with post ids to exclude.
	 */
	protected function get_excluded_posts( $post_type ) {
		$excluded_posts_ids = [];

		$page_on_front_id = ( $post_type === 'page' ) ? (int) get_option( 'page_on_front' ) : 0;
		if ( $page_on_front_id > 0 ) {
			$excluded_posts_ids[] = $page_on_front_id;
		}

		/**
		 * Filter: 'wpseo_exclude_from_sitemap_by_post_ids' - Allow extending and modifying the posts to exclude.
		 *
		 * @api array $posts_to_exclude The posts to exclude.
		 */
		$excluded_posts_ids = apply_filters( 'wpseo_exclude_from_sitemap_by_post_ids', $excluded_posts_ids );
		if ( ! is_array( $excluded_posts_ids ) ) {
			$excluded_posts_ids = [];
		}

		$excluded_posts_ids = array_map( 'intval', $excluded_posts_ids );

		$page_for_posts_id = ( $post_type === 'page' ) ? (int) get_option( 'page_for_posts' ) : 0;
		if ( $page_for_posts_id > 0 ) {
			$excluded_posts_ids[] = $page_for_posts_id;
		}

		return array_unique( $excluded_posts_ids );
	}

	/**
	 * Get count of posts for post type.
	 *
	 * @param string $post_type Post type to retrieve count for.
	 *
	 * @return int
	 */
	protected function get_post_type_count( $post_type ) {

		global $wpdb;

		/**
		 * Filter JOIN query part for type count of post type.
		 *
		 * @param string $join      SQL part, defaults to empty string.
		 * @param string $post_type Post type name.
		 */
		$join_filter = apply_filters( 'wpseo_typecount_join', '', $post_type );

		/**
		 * Filter WHERE query part for type count of post type.
		 *
		 * @param string $where     SQL part, defaults to empty string.
		 * @param string $post_type Post type name.
		 */
		$where_filter = apply_filters( 'wpseo_typecount_where', '', $post_type );

		$where = $this->get_sql_where_clause( $post_type );

		$sql = "
			SELECT COUNT({$wpdb->posts}.ID)
			FROM {$wpdb->posts}
			{$join_filter}
			{$where}
				{$where_filter}
		";

		return (int) $wpdb->get_var( $sql );
	}

	/**
	 * Produces set of links to prepend at start of first sitemap page.
	 *
	 * @param string $post_type Post type to produce links for.
	 *
	 * @return array
	 */
	protected function get_first_links( $post_type ) {

		$links       = [];
		$archive_url = false;

		if ( $post_type === 'page' ) {

			$page_on_front_id = (int) get_option( 'page_on_front' );
			if ( $page_on_front_id > 0 ) {
				$front_page = $this->get_url(
					get_post( $page_on_front_id )
				);
			}

			if ( empty( $front_page ) ) {
				$front_page = [
					'loc' => WPSEO_Utils::home_url(),
				];
			}

			// Deprecated, kept for backwards data compat. R.
			$front_page['chf'] = 'daily';
			$front_page['pri'] = 1;

			$links[] = $front_page;
		}
		elseif ( $post_type !== 'page' ) {
			/**
			 * Filter the URL Yoast SEO uses in the XML sitemap for this post type archive.
			 *
			 * @param string $archive_url The URL of this archive
			 * @param string $post_type   The post type this archive is for.
			 */
			$archive_url = apply_filters(
				'wpseo_sitemap_post_type_archive_link',
				$this->get_post_type_archive_link( $post_type ),
				$post_type
			);
		}

		if ( $archive_url ) {

			$links[] = [
				'loc' => $archive_url,
				'mod' => WPSEO_Sitemaps::get_last_modified_gmt( $post_type ),

				// Deprecated, kept for backwards data compat. R.
				'chf' => 'daily',
				'pri' => 1,
			];
		}

		return $links;
	}

	/**
	 * Get URL for a post type archive.
	 *
	 * @since 5.3
	 *
	 * @param string $post_type Post type.
	 *
	 * @return string|bool URL or false if it should be excluded.
	 */
	protected function get_post_type_archive_link( $post_type ) {

		$pt_archive_page_id = -1;

		if ( $post_type === 'post' ) {

			if ( get_option( 'show_on_front' ) === 'posts' ) {
				return WPSEO_Utils::home_url();
			}

			$pt_archive_page_id = (int) get_option( 'page_for_posts' );

			// Post archive should be excluded if posts page isn't set.
			if ( $pt_archive_page_id <= 0 ) {
				return false;
			}
		}

		if ( ! $this->is_post_type_archive_indexable( $post_type, $pt_archive_page_id ) ) {
			return false;
		}

		return get_post_type_archive_link( $post_type );
	}

	/**
	 * Determines whether a post type archive is indexable.
	 *
	 * @since 11.5
	 *
	 * @param string $post_type       Post type.
	 * @param int    $archive_page_id The page id.
	 *
	 * @return bool True when post type archive is indexable.
	 */
	protected function is_post_type_archive_indexable( $post_type, $archive_page_id = -1 ) {

		if ( WPSEO_Options::get( 'noindex-ptarchive-' . $post_type, false ) ) {
			return false;
		}

		/**
		 * Filter the page which is dedicated to this post type archive.
		 *
		 * @since 9.3
		 *
		 * @param string $archive_page_id The post_id of the page.
		 * @param string $post_type       The post type this archive is for.
		 */
		$archive_page_id = (int) apply_filters( 'wpseo_sitemap_page_for_post_type_archive', $archive_page_id, $post_type );

		if ( $archive_page_id > 0 && WPSEO_Meta::get_value( 'meta-robots-noindex', $archive_page_id ) === '1' ) {
			return false;
		}

		return true;
	}

	/**
	 * Retrieve set of posts with optimized query routine.
	 *
	 * @param string $post_type Post type to retrieve.
	 * @param int    $count     Count of posts to retrieve.
	 * @param int    $offset    Starting offset.
	 *
	 * @return object[]
	 */
	protected function get_posts( $post_type, $count, $offset ) {

		global $wpdb;

		static $filters = [];

		if ( ! isset( $filters[ $post_type ] ) ) {
			// Make sure you're wpdb->preparing everything you throw into this!!
			$filters[ $post_type ] = [
				/**
				 * Filter JOIN query part for the post type.
				 *
				 * @param string $join      SQL part, defaults to false.
				 * @param string $post_type Post type name.
				 */
				'join'  => apply_filters( 'wpseo_posts_join', false, $post_type ),

				/**
				 * Filter WHERE query part for the post type.
				 *
				 * @param string $where     SQL part, defaults to false.
				 * @param string $post_type Post type name.
				 */
				'where' => apply_filters( 'wpseo_posts_where', false, $post_type ),
			];
		}

		$join_filter  = $filters[ $post_type ]['join'];
		$where_filter = $filters[ $post_type ]['where'];
		$where        = $this->get_sql_where_clause( $post_type );

		/*
		 * Optimized query per this thread:
		 * {@link http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-performance-suggestion}.
		 * Also see {@link http://explainextended.com/2009/10/23/mysql-order-by-limit-performance-late-row-lookups/}.
		 */
		$sql = "
			SELECT l.ID, post_title, post_content, post_name, post_parent, post_author, post_status, post_modified_gmt, post_date, post_date_gmt
			FROM (
				SELECT {$wpdb->posts}.ID
				FROM {$wpdb->posts}
				{$join_filter}
				{$where}
					{$where_filter}
				ORDER BY {$wpdb->posts}.post_modified ASC LIMIT %d OFFSET %d
			)
			o JOIN {$wpdb->posts} l ON l.ID = o.ID
		";

		$posts = $wpdb->get_results( $wpdb->prepare( $sql, $count, $offset ) );

		$post_ids = [];

		foreach ( $posts as $post ) {
			$post->post_type   = $post_type;
			$post->filter      = 'sample';
			$post->ID          = (int) $post->ID;
			$post->post_parent = (int) $post->post_parent;
			$post->post_author = (int) $post->post_author;
			$post_ids[]        = $post->ID;
		}

		update_meta_cache( 'post', $post_ids );

		return $posts;
	}

	/**
	 * Constructs an SQL where clause for a given post type.
	 *
	 * @param string $post_type Post type slug.
	 *
	 * @return string
	 */
	protected function get_sql_where_clause( $post_type ) {

		global $wpdb;

		$join          = '';
		$post_statuses = array_map( 'esc_sql', WPSEO_Sitemaps::get_post_statuses( $post_type ) );
		$status_where  = "{$wpdb->posts}.post_status IN ('" . implode( "','", $post_statuses ) . "')";

		// Based on WP_Query->get_posts(). R.
		if ( $post_type === 'attachment' ) {
			$join            = " LEFT JOIN {$wpdb->posts} AS p2 ON ({$wpdb->posts}.post_parent = p2.ID) ";
			$parent_statuses = array_diff( $post_statuses, [ 'inherit' ] );
			$status_where    = "p2.post_status IN ('" . implode( "','", $parent_statuses ) . "') AND p2.post_password = ''";
		}

		$where_clause = "
			{$join}
			WHERE {$status_where}
				AND {$wpdb->posts}.post_type = %s
				AND {$wpdb->posts}.post_password = ''
				AND {$wpdb->posts}.post_date != '0000-00-00 00:00:00'
		";

		return $wpdb->prepare( $where_clause, $post_type );
	}

	/**
	 * Produce array of URL parts for given post object.
	 *
	 * @param object $post Post object to get URL parts for.
	 *
	 * @return array|bool
	 */
	protected function get_url( $post ) {

		$url = [];

		/**
		 * Filter the URL Yoast SEO uses in the XML sitemap.
		 *
		 * Note that only absolute local URLs are allowed as the check after this removes external URLs.
		 *
		 * @param string $url  URL to use in the XML sitemap
		 * @param object $post Post object for the URL.
		 */
		$url['loc'] = apply_filters( 'wpseo_xml_sitemap_post_url', get_permalink( $post ), $post );

		/*
		 * Do not include external URLs.
		 *
		 * {@link https://wordpress.org/plugins/page-links-to/} can rewrite permalinks to external URLs.
		 */
		if ( $this->get_classifier()->classify( $url['loc'] ) === WPSEO_Link::TYPE_EXTERNAL ) {
			return false;
		}

		$modified = max( $post->post_modified_gmt, $post->post_date_gmt );

		if ( $modified !== '0000-00-00 00:00:00' ) {
			$url['mod'] = $modified;
		}

		$url['chf'] = 'daily'; // Deprecated, kept for backwards data compat. R.

		$canonical = WPSEO_Meta::get_value( 'canonical', $post->ID );

		if ( $canonical !== '' && $canonical !== $url['loc'] ) {
			/*
			 * Let's assume that if a canonical is set for this page and it's different from
			 * the URL of this post, that page is either already in the XML sitemap OR is on
			 * an external site, either way, we shouldn't include it here.
			 */
			return false;
		}
		unset( $canonical );

		$url['pri'] = 1; // Deprecated, kept for backwards data compat. R.

		if ( $this->include_images ) {
			$url['images'] = $this->get_image_parser()->get_images( $post );
		}

		return $url;
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Get Home URL.
	 *
	 * @deprecated 11.5
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	protected function get_home_url() {
		_deprecated_function( __METHOD__, 'WPSEO 11.5', 'WPSEO_Utils::home_url' );

		return WPSEO_Utils::home_url();
	}

	/**
	 * Get front page ID.
	 *
	 * @deprecated 11.5
	 * @codeCoverageIgnore
	 *
	 * @return int
	 */
	protected function get_page_on_front_id() {
		_deprecated_function( __METHOD__, 'WPSEO 11.5' );

		return (int) get_option( 'page_on_front' );
	}

	/**
	 * Get page for posts ID.
	 *
	 * @deprecated 11.5
	 * @codeCoverageIgnore
	 *
	 * @return int
	 */
	protected function get_page_for_posts_id() {
		_deprecated_function( __METHOD__, 'WPSEO 11.5' );

		return (int) get_option( 'page_for_posts' );
	}
}
