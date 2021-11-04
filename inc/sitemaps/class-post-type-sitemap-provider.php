<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Sitemap provider for author archives.
 */
class WPSEO_Post_Type_Sitemap_Provider implements WPSEO_Sitemap_Provider {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {
		$this->repository = YoastSEO()->classes->get( 'Yoast\WP\SEO\Repositories\Indexable_Repository' );

		add_filter( 'save_post', [ $this, 'save_post' ] );
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
				$sql = 'SELECT object_last_modified
				    FROM ( SELECT @rownum:=0 ) init
				    JOIN ' . Model::get_table_name( 'Indexable' ) . '
				    WHERE ( post_status = "publish" OR post_status IS NULL )
				      AND ( is_robots_noindex = 0 OR is_robots_noindex IS NULL )
				      AND object_sub_type = %s
				      AND ( @rownum:=@rownum+1 ) %% %d = 0
				    ORDER BY object_last_modified ASC';

				// phpcs:ignore WordPress.DB
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
	 * Retrieves a count of URLs for a post type.
	 *
	 * @param string $post_type The post type to get a count for.
	 *
	 * @return int
	 */
	public function get_post_type_count( $post_type ) {
		return $this->repository
			->query()
			->where( 'object_sub_type', $post_type ) // by only checking object-sub-type, we automatically include post type archives if they're indexable.
			->where_raw( '( post_status = "publish" OR post_status IS NULL )' )
			->where_raw( '( is_robots_noindex = 0 OR is_robots_noindex IS NULL )' )
			->count();
	}

	/**
	 * Get set of sitemap link data.
	 *
	 * @param string $post_type    Sitemap type.
	 * @param int    $max_entries  Entries per sitemap.
	 * @param int    $current_page Current page of the sitemap.
	 *
	 * @return array
	 *
	 * @throws OutOfBoundsException When an invalid page is requested.
	 */
	public function get_sitemap_links( $post_type, $max_entries, $current_page ) {
		if ( ! $this->is_valid_post_type( $post_type ) ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		$steps  = min( 100, $max_entries );
		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;

		// By only checking object-sub-type, we automatically include post type archives if they're indexable.
		// By ordering on object-type, we'll get the archive first.
		$query = $this->repository
			->query()
			->select_many( 'id', 'permalink', 'object_last_modified' )
			->where_raw( '( post_status = "publish" OR post_status IS NULL )' )
			->where_raw( '( is_robots_noindex = 0 OR is_robots_noindex IS NULL )' )
			->order_by_desc( 'object_last_modified' )
			->offset( $offset )
			->limit( $steps );

		if ( $post_type === 'page' ) {
			$query->where_raw( '( object_sub_type = "page" OR object_sub_type IS NULL )' )
				->where_in( 'object_type', [ 'home-page', 'post' ] );
		}
		else {
			$query->where( 'object_sub_type', $post_type );
		}
		$posts_to_exclude = $this->get_excluded_posts( $post_type );
		if ( count( $posts_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $posts_to_exclude );
		}

		$indexables = $query->find_many();

		// If total post type count is lower than the offset, an invalid page is requested.
		if ( count( $indexables ) === 0 ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		return YoastSEO()->helpers->xml_sitemap->convert_indexables_to_sitemap_links( $indexables );
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

		return array_unique( $excluded_posts_ids );
	}
}
