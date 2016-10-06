<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Post_Type_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/** @var string $home_url Holds the home_url() value to speed up loops. */
	protected static $home_url;

	/** @var array $options All of plugin options. */
	protected static $options;

	/** @var WPSEO_Sitemap_Image_Parser $image_parser Holds image parser instance. */
	protected static $image_parser;

	/** @var int $page_on_front_id Static front page ID.  */
	protected static $page_on_front_id;

	/** @var int $page_for_posts_id Posts page ID.  */
	protected static $page_for_posts_id;

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {
		add_filter( 'save_post', array( $this, 'save_post' ) );
	}

	/**
	 * Get front page ID
	 *
	 * @return int
	 */
	protected function get_page_on_front_id() {
		if ( ! isset( self::$page_on_front_id ) ) {
			self::$page_on_front_id = (int) get_option( 'page_on_front' );
		}

		return self::$page_on_front_id;
	}

	/**
	 * Get page for posts ID
	 *
	 * @return int
	 */
	protected function get_page_for_posts_id() {
		if ( ! isset( self::$page_for_posts_id ) ) {
			self::$page_for_posts_id = (int) get_option( 'page_for_posts' );
		}

		return self::$page_for_posts_id;
	}

	/**
	 * Get the Image Parser
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
	 * Get Home URL
	 *
	 * This has been moved from the constructor because wp_rewrite is not available on plugins_loaded in multisite.
	 * It will now be requested on need and not on initialization.
	 *
	 * @return string
	 */
	protected function get_home_url() {
		if ( ! isset( self::$home_url ) ) {
			self::$home_url = WPSEO_Utils::home_url();
		}

		return self::$home_url;
	}

	/**
	 * Get all the options
	 *
	 * @return array
	 */
	protected function get_options() {
		if ( ! isset( self::$options ) ) {
			self::$options = WPSEO_Options::get_all();
		}

		return self::$options;
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
	public function get_index_links( $max_entries ) {

		global $wpdb;

		$post_types          = get_post_types( array( 'public' => true ) );
		$post_types          = array_filter( $post_types, array( $this, 'is_valid_post_type' ) );
		$last_modified_times = WPSEO_Sitemaps::get_last_modified_gmt( $post_types, true );
		$index               = array();

		foreach ( $post_types as $post_type ) {

			$total_count = $this->get_post_type_count( $post_type );

			if ( $total_count === 0 ) {
				continue;
			}

			$max_pages = 1;

			if ( $total_count > $max_entries ) {
				$max_pages = (int) ceil( $total_count / $max_entries );
			}

			$all_dates = array();

			if ( $max_pages > 1 ) {

				$sql       = "
				SELECT post_modified_gmt
				    FROM ( SELECT @rownum:=0 ) init 
				    JOIN {$wpdb->posts} USE INDEX( type_status_date )
				    WHERE post_status IN ( 'publish', 'inherit' )
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

				$index[] = array(
					'loc'     => WPSEO_Sitemaps_Router::get_base_url( $post_type . '-sitemap' . $current_page . '.xml' ),
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

		$links     = array();
		$post_type = $type;

		if ( ! $this->is_valid_post_type( $post_type ) ) {
			return $links;
		}

		$steps  = min( 100, $max_entries );
		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;
		$total  = ( $offset + $max_entries );

		$typecount = $this->get_post_type_count( $post_type );

		if ( $total > $typecount ) {
			$total = $typecount;
		}

		if ( $current_page === 1 ) {
			$links = array_merge( $links, $this->get_first_links( $post_type ) );
		}

		if ( $typecount === 0 ) {

			return $links;
		}

		$options = $this->get_options();

		$stacked_urls = array();

		while ( $total > $offset ) {

			$posts = $this->get_posts( $post_type, $steps, $offset );

			$offset += $steps;

			if ( empty( $posts ) ) {
				continue;
			}

			$posts_to_exclude = explode( ',', $options['excluded-posts'] );

			foreach ( $posts as $post ) {

				if ( WPSEO_Meta::get_value( 'meta-robots-noindex', $post->ID ) === '1' ) {
					continue;
				}

				if ( in_array( $post->ID, $posts_to_exclude ) ) {
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
				 * @param object $user Data object for the URL.
				 */
				$url = apply_filters( 'wpseo_sitemap_entry', $url, 'post', $post );

				if ( empty( $url ) ) {
					continue;
				}

				$stacked_urls[] = $url['loc'];

				if ( (int) $post->ID === $this->get_page_for_posts_id() || (int) $post->ID === $this->get_page_on_front_id() ) {

					array_unshift( $links, $url );
					continue;
				}
				$links[] = $url;
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

		$options = $this->get_options();

		if ( ! empty( $options[ "post_types-{$post_type}-not_in_sitemap" ] ) ) {
			return false;
		}

		if ( ! in_array( $post_type, get_post_types( array( 'public' => true ) ) ) ) {
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

		$sql   = "
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

		$links = array();

		$needs_archive = true;

		if ( ! $this->get_page_on_front_id() && ( $post_type == 'post' || $post_type == 'page' ) ) {

			$links[] = array(
				'loc' => $this->get_home_url(),

				// Deprecated, kept for backwards data compat. R.
				'chf' => 'daily',
				'pri' => 1,
			);

			$needs_archive = false;
		}
		elseif ( $this->get_page_on_front_id() && $post_type === 'post' && $this->get_page_for_posts_id() ) {

			$page_for_posts_url = get_permalink( $this->get_page_for_posts_id() );

			$links[] = array(
				'loc' => $page_for_posts_url,

				// Deprecated, kept for backwards data compat. R.
				'chf' => 'daily',
				'pri' => 1,
			);

			$needs_archive = false;
		}

		if ( ! $needs_archive ) {
			return $links;
		}

		$archive_url = get_post_type_archive_link( $post_type );

		/**
		 * Filter the URL Yoast SEO uses in the XML sitemap for this post type archive.
		 *
		 * @param string $archive_url The URL of this archive
		 * @param string $post_type   The post type this archive is for.
		 */
		$archive_url = apply_filters( 'wpseo_sitemap_post_type_archive_link', $archive_url, $post_type );

		if ( $archive_url ) {
			/**
			 * Filter the priority of the URL Yoast SEO uses in the XML sitemap.
			 *
			 * @param float  $priority  The priority for this URL, ranging from 0 to 1
			 * @param string $post_type The post type this archive is for.
			 */
			$links[] = array(
				'loc' => $archive_url,
				'mod' => WPSEO_Sitemaps::get_last_modified_gmt( $post_type ),

				// Deprecated, kept for backwards data compat. R.
				'chf' => 'daily',
				'pri' => 1,
			);
		}

		return $links;
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

		static $filters = array();

		if ( ! isset( $filters[ $post_type ] ) ) {
			// Make sure you're wpdb->preparing everything you throw into this!!
			$filters[ $post_type ] = array(
				/**
				 * Filter JOIN query part for the post type.
				 *
				 * @param string $join      SQL part, defaults to false.
				 * @param string $post_type Post type name.
				 */
				'join'  => apply_filters( 'wpseo_posts_join', false, $post_type ),

				/**
				 * Filter Where query part for the post type.
				 *
				 * @param string $where     SQL part, defaults to false.
				 * @param string $post_type Post type name.
				 */
				'where' => apply_filters( 'wpseo_posts_where', false, $post_type ),
			);
		}

		$join_filter  = $filters[ $post_type ]['join'];
		$where_filter = $filters[ $post_type ]['where'];
		$where        = $this->get_sql_where_clause( $post_type );

		// Optimized query per this thread: http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-performance-suggestion.
		// Also see http://explainextended.com/2009/10/23/mysql-order-by-limit-performance-late-row-lookups/.
		$sql = "
			SELECT l.ID, post_title, post_content, post_name, post_parent, post_author, post_modified_gmt, post_date, post_date_gmt
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

		$post_ids = array();

		foreach ( $posts as $post ) {
			$post->post_type   = $post_type;
			$post->post_status = 'publish';
			$post->filter      = 'sample';
			$post_ids[]        = $post->ID;
		}

		update_meta_cache( 'post', $post_ids );

		return $posts;
	}

	/**
	 * @param string $post_type Post type slug.
	 *
	 * @return string
	 */
	protected function get_sql_where_clause( $post_type ) {

		global $wpdb;

		$join   = '';
		$status = "{$wpdb->posts}.post_status = 'publish'";

		// Based on WP_Query->get_posts(). R.
		if ( 'attachment' === $post_type ) {
			$join   = " LEFT JOIN {$wpdb->posts} AS p2 ON ({$wpdb->posts}.post_parent = p2.ID) ";
			$status = "p2.post_status = 'publish'";
		}

		$where_clause = "
		{$join}
		WHERE {$status}
			AND {$wpdb->posts}.post_type = '%s'
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

		$url = array();

		/**
		 * Filter the URL Yoast SEO uses in the XML sitemap.
		 *
		 * Note that only absolute local URLs are allowed as the check after this removes external URLs.
		 *
		 * @param string $url  URL to use in the XML sitemap
		 * @param object $post Post object for the URL.
		 */
		$url['loc'] = apply_filters( 'wpseo_xml_sitemap_post_url', get_permalink( $post ), $post );

		/**
		 * Do not include external URLs.
		 *
		 * @see https://wordpress.org/plugins/page-links-to/ can rewrite permalinks to external URLs.
		 */
		if ( false === strpos( $url['loc'], $this->get_home_url() ) ) {
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
			Let's assume that if a canonical is set for this page and it's different from
			   the URL of this post, that page is either already in the XML sitemap OR is on
			   an external site, either way, we shouldn't include it here.
			*/
			return false;
		}
		unset( $canonical );

		$options = $this->get_options();
		if ( $options['trailingslash'] === true && $post->post_type !== 'post' ) {
			$url['loc'] = trailingslashit( $url['loc'] );
		}

		$url['pri']    = 1; // Deprecated, kept for backwards data compat. R.
		$url['images'] = $this->get_image_parser()->get_images( $post );

		return $url;
	}

	/**
	 * Calculate the priority of the post.
	 *
	 * @deprecated 3.5 Priority data dropped from sitemaps.
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

		if ( $post->ID === $this->get_page_on_front_id() || $post->ID === $this->get_page_for_posts_id() ) {
			$return = 1.0;
		}

		/**
		 * Filter the priority of the URL Yoast SEO uses in the XML sitemap.
		 *
		 * @param float  $priority  The priority for this URL, ranging from 0 to 1
		 * @param string $post_type The post type this archive is for.
		 * @param object $post      The post object.
		 */
		$return = apply_filters( 'wpseo_xml_sitemap_post_priority', $return, $post->post_type, $post );

		return $return;
	}
}
