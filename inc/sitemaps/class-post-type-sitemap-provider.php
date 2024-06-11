<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

use Yoast\WP\SEO\Models\SEO_Links;

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
	 * Holds the parsed home url.
	 *
	 * @var array
	 */
	protected static $parsed_home_url;

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
		add_action( 'save_post', [ $this, 'save_post' ] );

		/**
		 * Filter - Allows excluding images from the XML sitemap.
		 *
		 * @param bool $include True to include, false to exclude.
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
	 * Gets the parsed home url.
	 *
	 * @return array The home url, as parsed by wp_parse_url.
	 */
	protected function get_parsed_home_url() {
		if ( ! isset( self::$parsed_home_url ) ) {
			self::$parsed_home_url = wp_parse_url( home_url() );
		}

		return self::$parsed_home_url;
	}

	/**
	 * Check if provider supports given item type.
	 *
	 * @param string $type Type string to check for.
	 *
	 * @return bool
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
		$post_types  = WPSEO_Post_Type::get_accessible_post_types();
		$post_types  = array_filter( $post_types, [ $this, 'is_valid_post_type' ] );
		$index_links = [];

		foreach ( $post_types as $post_type ) {
			$index_links = array_merge( $index_links, $this->get_index_links_for_post_type( $post_type, $max_entries ) );
		}

		return $index_links;
	}

	/**
	 * Get set of sitemap link data.
	 *
	 * @param string $type         Sitemap type.
	 * @param int    $max_entries  Entries per sitemap.
	 * @param int    $current_page Current page of the sitemap.
	 *
	 * @return array
	 *
	 * @throws OutOfBoundsException When an invalid page is requested.
	 */
	public function get_sitemap_links( $type, $max_entries, $current_page ) {
		$links        = [];
		$post_type    = $type;
		$current_page = max( $current_page, 1 );

		if ( ! $this->is_valid_post_type( $post_type ) ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		if ( $current_page === 1 ) {
			$links = $this->get_first_links( $post_type );
		}

		// Even if we don't have posts for the page, we might have some first-page links to show.
		try {
			$page_boundaries = $this->get_page_boundaries( $post_type, $current_page, $max_entries );
		} catch ( OutOfBoundsException $e ) {
			if ( count( $links ) > 0 ) {
				return $links;
			}
			throw $e;
		}

		$posts_to_exclude = $this->get_excluded_posts( $type );
		$start_post_id    = $page_boundaries['start'];
		while ( $start_post_id <= $page_boundaries['end'] ) {
			$posts = $this->get_posts( $post_type, $max_entries, $start_post_id, $page_boundaries['end'] );
			if ( empty( $posts ) ) {
				break;
			}

			$last_id       = (int) current( array_slice( $posts, -1 ) )->ID;
			$start_post_id = ( $last_id + 1 );

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
		}

		return $links;
	}

	/**
	 * Check for relevant post type before invalidation.
	 *
	 * @param int $post_id Post ID to possibly invalidate for.
	 *
	 * @return void
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
		 * @param array $posts_to_exclude The posts to exclude.
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
	 * Produces set of links to prepend at start of first sitemap page.
	 *
	 * @param string $post_type Post type to produce links for.
	 *
	 * @return array
	 */
	protected function get_first_links( $post_type ) {
		$links = [];

		if ( $post_type === 'page' ) {

			$page_on_front_id = (int) get_option( 'page_on_front' );
			if ( $page_on_front_id > 0 ) {
				$front_page = $this->get_url(
					get_post( $page_on_front_id )
				);
			}

			if ( empty( $front_page ) ) {
				$front_page = [
					'loc' => YoastSEO()->helpers->url->home(),
				];
			}

			// Deprecated, kept for backwards data compat. R.
			$front_page['chf'] = 'daily';
			$front_page['pri'] = 1;

			$images = ( $front_page['images'] ?? [] );

			/**
			 * Filter images to be included for the term in XML sitemap.
			 *
			 * @param array $images Array of image items.
			 *
			 * @return array $image_list Array of image items.
			 */
			$image_list = apply_filters( 'wpseo_sitemap_urlimages_front_page', $images );
			if ( is_array( $image_list ) ) {
				$front_page['images'] = $image_list;
			}

			$links[] = $front_page;
		}
		else {
			/**
			 * Filter the URL Yoast SEO uses in the XML sitemap for this post type archive.
			 *
			 * @param string $archive_url The URL of this archive
			 * @param string $post_type   The post type this archive is for.
			 */
			$archive_url = (string) apply_filters(
				'wpseo_sitemap_post_type_archive_link',
				$this->get_post_type_archive_link( $post_type ),
				$post_type
			);

			if ( $archive_url !== '' ) {
				$links[] = [
					'loc' => $archive_url,
					'mod' => WPSEO_Sitemaps::get_last_modified_gmt( $post_type ),

					// Deprecated, kept for backwards data compat. R.
					'chf' => 'daily',
					'pri' => 1,
				];
			}
		}

		/**
		 * Filters the first post type links.
		 *
		 * @param array  $links     The first post type links.
		 * @param string $post_type The post type this archive is for.
		 */
		return apply_filters( 'wpseo_sitemap_post_type_first_links', $links, $post_type );
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
				return YoastSEO()->helpers->url->home();
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
	 * @param string   $post_type   Post type to retrieve.
	 * @param int      $count       Count of posts to retrieve.
	 * @param int      $offset      Starting offset.
	 * @param int|null $max_post_id The maximum post ID to retrieve.
	 *
	 * @return WP_Post[]
	 */
	protected function get_posts( $post_type, $count, $offset, $max_post_id = null ) {
		$raw_post_data = $this->get_raw_post_data( $post_type, $count, $offset, $max_post_id );
		$posts         = [];
		$post_ids      = [];
		foreach ( $raw_post_data as $row_index => $post_data ) {
			$post_data->post_type = $post_type;
			$sanitized_post       = sanitize_post( $post_data, 'raw' );
			$posts[ $row_index ]  = new WP_Post( $sanitized_post );

			$post_ids[] = $sanitized_post->ID;
		}

		// We'll need meta values for individual posts, so let's prime the cache with a single query instead of one per post.
		update_meta_cache( 'post', $post_ids );

		return $posts;
	}

	/**
	 * Retrieve raw post data for a given post type within a range of post IDs.
	 *
	 * @param string   $post_type   The post type to retrieve posts for.
	 * @param int      $count       The maximum number of posts to retrieve.
	 * @param int      $offset      The starting post ID.
	 * @param int|null $max_post_id The maximum post ID to retrieve.
	 *
	 * @return stdClass[]
	 */
	protected function get_raw_post_data( $post_type, $count, $offset, $max_post_id = null ) {
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

		$page_limit_clause = ( $max_post_id ) ? "AND {$wpdb->posts}.ID <= {$max_post_id}" : '';

		/*
		 * Optimized query per this thread:
		 * {@link http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-performance-suggestion}.
		 * Also see {@link http://explainextended.com/2009/10/23/mysql-order-by-limit-performance-late-row-lookups/}.
		 */

		$sql = "
			SELECT l.ID, post_title, post_content, post_name, post_parent, post_author, post_status, post_modified_gmt, post_date, post_date_gmt, post_password
			FROM (
				SELECT {$wpdb->posts}.ID
				FROM {$wpdb->posts}
				{$join_filter}
				{$where}
					{$where_filter}
					AND {$wpdb->posts}.ID >= %d
					{$page_limit_clause}
				ORDER BY {$wpdb->posts}.ID ASC LIMIT %d
			)
			o JOIN {$wpdb->posts} l ON l.ID = o.ID
		";

		// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.DirectDatabaseQuery.DirectQuery -- Can't do this with WP queries. Caching is done on the sitemap level.
		$raw_post_data = $wpdb->get_results( $wpdb->prepare( $sql, $offset, $count ) );
		// phpcs:enable

		return array_values( $raw_post_data );
	}

	/**
	 * Gets the first id of the post of all pages.
	 *
	 * @param string $post_type        The post type to retrieve posts for.
	 * @param int    $entries_per_page The maximum number of posts per page.
	 * @param int    $starting_post_id The lowest post ID to get the pages for.
	 *
	 * @return string[]
	 */
	protected function get_raw_page_data( $post_type, $entries_per_page, $starting_post_id ) {
		global $wpdb;

		$where = $this->get_sql_where_clause( $post_type );

		/*
		 * Optimized query per this thread:
		 * {@link http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-performance-suggestion}.
		 * Also see {@link http://explainextended.com/2009/10/23/mysql-order-by-limit-performance-late-row-lookups/}.
		 */
		$sql = "
			SELECT l.ID as first_id_on_page
			FROM (
				SELECT {$wpdb->posts}.ID
				FROM ( SELECT @rownum:=-1 ) as init
				JOIN {$wpdb->posts} USE INDEX (`type_status_date`)
				{$where}
				AND {$wpdb->posts}.ID >= %d
				ORDER BY {$wpdb->posts}.ID ASC
			)
			o JOIN {$wpdb->posts} l ON l.ID = o.ID
			WHERE (@rownum:=@rownum+1) %% %d = 0
		";
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.DirectDatabaseQuery.DirectQuery -- Can't do this with WP queries. Caching is done on the sitemap level.
		return $wpdb->get_col( $wpdb->prepare( $sql, $starting_post_id, $entries_per_page ) );
		// phpcs:enable
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
		$link_type  = YoastSEO()->helpers->url->get_link_type(
			wp_parse_url( $url['loc'] ),
			$this->get_parsed_home_url()
		);

		/*
		 * Do not include external URLs.
		 *
		 * {@link https://wordpress.org/plugins/page-links-to/} can rewrite permalinks to external URLs.
		 */
		if ( $link_type === SEO_Links::TYPE_EXTERNAL ) {
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

	/**
	 * Gets the boundaries of a single post sitemap page of a post type.
	 *
	 * @param string $post_type            The post type to get the boundaries for.
	 * @param int    $page_number          The page number to get the boundaries for. Starting at 1.
	 * @param int    $max_entries_per_page The maximum number of links that should be visible on a page.
	 *
	 * @return int[]
	 * @throws OutOfBoundsException When an invalid page is requested.
	 */
	private function get_page_boundaries( $post_type, $page_number, $max_entries_per_page ) {
		$map = $this->get_pagination_map( $post_type, $max_entries_per_page );
		if ( ! isset( $map[ $page_number ] ) ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		return $map[ $page_number ];
	}

	/**
	 * Gets a full pagination map for a post type.
	 * The map is an array of page numbers with the starting and ending post id of the page.
	 * When the map is malformed or missing, it will be rebuilt.
	 * When the map is incomplete, it will be completed.
	 *
	 * @param string $post_type            The post type to get the map for.
	 * @param int    $max_entries_per_page The maximum number of links that should be visible on a page.
	 *
	 * @return array<int, array{start: int, end: int}>
	 */
	private function get_pagination_map( $post_type, $max_entries_per_page ) {
		$pagination = get_option( "wpseo_{$post_type}_sitemap_pagination", [] );
		$aggregates = $this->get_aggregates( $post_type );

		if ( $this->pagination_is_malformed( $pagination ) || $this->map_needs_to_be_rebuilt( $pagination, $aggregates, $max_entries_per_page ) ) {
			$pagination_map = $this->create_map(
				$post_type,
				$max_entries_per_page,
				$aggregates['min_post_id'],
				$aggregates['max_post_id']
			);
			$this->save_pagination( $post_type, $pagination_map, $aggregates, $max_entries_per_page );

			return $pagination_map;
		}

		// If the map is outdated, replace the last page with an updated version and complete the map.
		if ( $this->map_is_missing_posts( $pagination, $aggregates ) ) {
			$pagination_map = $pagination['map'];
			// The existing map might be empty. E.g., when a post_type only has password protected posts.
			if ( empty( $pagination_map ) ) {
				$last_known_page       = 1;
				$first_id_on_last_page = $aggregates['min_post_id'];
			}
			else {
				$last_known_page       = max( array_keys( $pagination_map ) );
				$first_id_on_last_page = $pagination_map[ $last_known_page ]['start'];
			}
			array_pop( $pagination_map );

			$final_pages = $this->create_map(
				$post_type,
				$max_entries_per_page,
				$first_id_on_last_page,
				$aggregates['max_post_id'],
				$last_known_page
			);

			// Loop over pages instead of using array_merge to avoid losing array keys.
			foreach ( $final_pages as $page_number => $page_boundaries ) {
				$pagination_map[ $page_number ] = $page_boundaries;
			}

			$this->save_pagination( $post_type, $pagination_map, $aggregates, $max_entries_per_page );

			return $pagination_map;
		}

		return $pagination['map'];
	}

	/**
	 * Gets a map of the starting and ending post id of sitemap pages for a post_type.
	 *
	 * @param string $post_type            The post type to create the map for.
	 * @param int    $max_entries_per_page The maximum number of links that should be visible on a page.
	 * @param int    $min_post_id          The minimum post id to start the map from. The lowest known post ID when creating a new map.
	 * @param int    $max_post_id          The highest known post ID.
	 * @param int    $starting_page        The page number to start the map from. Defaults to 1.
	 *
	 * @return array<int, array{start: int, end: int}>
	 */
	private function create_map( $post_type, $max_entries_per_page, $min_post_id, $max_post_id, $starting_page = 1 ) {
		$map             = [];
		$current_page_id = max( $starting_page, 1 );

		$page_starting_ids = $this->get_raw_page_data( $post_type, $max_entries_per_page, $min_post_id );
		foreach ( $page_starting_ids as $index => $page_starting_id ) {
			$next_page_starting_id   = isset( $page_starting_ids[ ( $index + 1 ) ] ) ? ( $page_starting_ids[ ( $index + 1 ) ] ) : null;
			$map[ $current_page_id ] = [
				'start' => (int) $page_starting_id,
				'end'   => $next_page_starting_id ? ( $next_page_starting_id - 1 ) : $max_post_id,
			];
			++$current_page_id;
		}

		return $map;
	}

	/**
	 * Checks the structure of the pagination object.
	 *
	 * @param array<int, array{start: int, end: int}> $stored_pagination The stored pagination object to validate.
	 *
	 * @return bool
	 */
	private function pagination_is_malformed( $stored_pagination ): bool {
		return (
			! isset(
				$stored_pagination['min_post_id'],
				$stored_pagination['max_post_id'],
				$stored_pagination['total_number_of_posts'],
				$stored_pagination['max_entries_per_page'],
				$stored_pagination['map']
			)
			|| $this->map_is_malformed( $stored_pagination['map'] )
		);
	}

	/**
	 * Checks the structure of the pagination map.
	 * A map is malformed when it is not an array or when it contains pages with a start ID higher than the end ID.
	 *
	 * @param array{start: int, end: int} $map The map.
	 *
	 * @return bool
	 */
	private function map_is_malformed( $map ): bool {
		if ( ! is_array( $map ) ) {
			return true;
		}
		foreach ( $map as $page ) {
			if ( ! isset( $page['start'], $page['end'] ) || $page['end'] < $page['start'] ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Checks if the map in a pagination object needs to be rebuilt completely.
	 * This is the case when:
	 * 1. posts exists with a lower ID than what the pagination object knows about;
	 * 2. the map has pages for posts with a higher ID than the highest ID in the database for this post type;
	 * 3. the total number of posts shrunk since creating the last pagination object.
	 *    This can happen when posts are deleted, but could also hint at bigger site structure changes.
	 * 4. the site has been migrated to a different domain.
	 *
	 * This will trigger some false positives, causing some unnecessary rebuilds,
	 * but this will cover cases where bigger structural changes have been made that would otherwise go undetected.
	 *
	 * @param array                                                                 $stored_pagination    The stored pagination object.
	 * @param array{min_post_id: int, max_post_id: int, total_number_of_posts: int} $current_aggregates   The current aggregates for the post type.
	 * @param int                                                                   $max_entries_per_page The maximum number of links that should be visible on a page.
	 *
	 * @return bool
	 */
	private function map_needs_to_be_rebuilt( $stored_pagination, $current_aggregates, $max_entries_per_page ): bool {
		return $stored_pagination['min_post_id'] !== $current_aggregates['min_post_id']
				|| $stored_pagination['max_post_id'] > $current_aggregates['max_post_id']
				|| $stored_pagination['total_number_of_posts'] > $current_aggregates['total_number_of_posts']
				|| $stored_pagination['max_entries_per_page'] !== $max_entries_per_page
				|| $stored_pagination['site_url'] !== get_site_url();
	}

	/**
	 * Checks if the map in a pagination object is missing posts that have been published since the last update of the pagination object.
	 *
	 * @param array                                                                 $stored_pagination  The stored pagination object.
	 * @param array{min_post_id: int, max_post_id: int, total_number_of_posts: int} $current_aggregates The current aggregates for the post type.
	 *
	 * @return bool
	 */
	private function map_is_missing_posts( $stored_pagination, $current_aggregates ): bool {
		return $stored_pagination['max_post_id'] < $current_aggregates['max_post_id'];
	}

	/**
	 * Saves a pagination object to the database.
	 *
	 * @param string                                                                $post_type            The post type to save the pagination object for.
	 * @param array<int, array{start: int, end: int}>                               $pagination_map       The map to save as part of the pagination object.
	 * @param array{min_post_id: int, max_post_id: int, total_number_of_posts: int} $aggregates           The aggregates that were used when creating the map.
	 * @param int                                                                   $max_entries_per_page The maximum number of links that should be visible on a page.
	 *
	 * @return void
	 */
	private function save_pagination( $post_type, $pagination_map, $aggregates, $max_entries_per_page ): void {
		update_option(
			"wpseo_{$post_type}_sitemap_pagination",
			[
				'map'                   => $pagination_map,
				'min_post_id'           => $aggregates['min_post_id'],
				'max_post_id'           => $aggregates['max_post_id'],
				'total_number_of_posts' => $aggregates['total_number_of_posts'],
				'max_entries_per_page'  => $max_entries_per_page,
				'site_url'              => get_site_url(),
			]
		);
	}

	/**
	 * Gets links to show on the sitemap index/overview for a particular post type.
	 *
	 * @param string $post_type   The post type to get index links for.
	 * @param int    $max_entries The maximum number of links that should be visible on a page.
	 *
	 * @return array{loc: string, lastmod: string}
	 */
	protected function get_index_links_for_post_type( string $post_type, int $max_entries ): array {
		$index_links    = [];
		$pagination_map = $this->get_pagination_map( $post_type, $max_entries );

		// Ensure a first page, so we can check for first links.
		$pages = array_unique( array_merge( [ 1 ], array_keys( $pagination_map ) ) );
		foreach ( $pages as $page_number ) {
			$page_link_suffix = ( $page_number > 1 ) ? $page_number : '';
			$last_mod_gmt     = null;
			$raw_post_data    = null;
			if ( isset( $pagination_map[ $page_number ] ) ) {
				$page_boundaries = $pagination_map[ $page_number ];
				$raw_post_data = $this->get_raw_post_data( $post_type, $max_entries, $page_boundaries['start'], $page_boundaries['end'] );

				$last_mod_gmt = array_reduce(
					$raw_post_data,
					static function ( $carry, $post ) {
						return max( $post->post_modified_gmt, $carry );
					},
					$raw_post_data[0]->post_modified_gmt
				);
			}

			if ( $page_number === 1 ) {
				$first_links = $this->get_first_links( $post_type );

				if ( ! $first_links && ! $raw_post_data ) {
					continue;
				}

				$last_mod_gmt = array_reduce(
					$first_links,
					static function ( $carry, $link ) {
						if ( ! isset( $link['mod'] ) ) {
							return $carry;
						}

						return max( $link['mod'], $carry );
					},
					$last_mod_gmt
				);
			}

			$index_links[] = [
				'loc'     => WPSEO_Sitemaps_Router::get_base_url( $post_type . '-sitemap' . $page_link_suffix . '.xml' ),
				'lastmod' => $last_mod_gmt,
			];
		}

		return $index_links;
	}

	/**
	 * Gets current aggregates for a post type.
	 *
	 * @param string $post_type The post type to get aggregates for.
	 *
	 * @return array{min_post_id: int, max_post_id: int, total_number_of_posts: int}
	 */
	protected function get_aggregates( $post_type ): array {
		global $wpdb;
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching,WordPress.DB.DirectDatabaseQuery.DirectQuery -- Can't do this with WP queries. Caching is done on the sitemap level.
		$aggregates = (array) $wpdb->get_row(
			$wpdb->prepare(
				"SELECT
					MIN( ID ) AS min_post_id,
					MAX( ID ) AS max_post_id,
					COUNT( ID ) AS total_number_of_posts
				FROM {$wpdb->posts}
					WHERE post_type = %s",
				$post_type
			)
		);

		// phpcs:enable
		return [
			'min_post_id'           => (int) $aggregates['min_post_id'],
			'max_post_id'           => (int) $aggregates['max_post_id'],
			'total_number_of_posts' => (int) $aggregates['total_number_of_posts'],
		];
	}
}
