<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\XML_Sitemap_Helper;
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
	 * The XML sitemap helper.
	 *
	 * @var XML_Sitemap_Helper
	 */
	private $xml_sitemap_helper;

	/**
	 * Set up object properties for data reuse.
	 */
	public function __construct() {
		$this->repository         = YoastSEO()->classes->get( Indexable_Repository::class );
		$this->xml_sitemap_helper = YoastSEO()->helpers->xml_sitemap;
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
	 * @return array The index links.
	 */
	public function get_index_links( $max_entries ) {
		$post_types = $this->repository
			->query_where_noindex( false, 'post' )
			->select( 'object_sub_type' )
			->select_expr( 'MAX( `object_last_modified` ) AS max_object_last_modified' )
			->select_expr( 'COUNT(*) AS count' )
			->where( 'is_publicly_viewable', true )
			->group_by( 'object_sub_type' )
			->find_many();

		$index = [];

		foreach ( $post_types as $post_type ) {
			/**
			 * Filter decision if post type is excluded from the XML sitemap.
			 *
			 * @param bool   $exclude   Default false.
			 * @param string $post_type Post type name.
			 */
			if ( apply_filters( 'wpseo_sitemap_exclude_post_type', false, $post_type->object_sub_type ) ) {
				continue;
			}

			if ( ! WPSEO_Post_Type::is_post_type_accessible( $post_type->object_sub_type ) || ! WPSEO_Post_Type::is_post_type_indexable( $post_type->object_sub_type ) ) {
				continue;
			}

			$max_pages = 1;
			if ( $post_type->count > $max_entries ) {
				$max_pages = (int) ceil( $post_type->count / $max_entries );
			}

			if ( $max_pages > 1 ) {
				global $wpdb;

				// Our orm doesn't support querying table subqueries, which we need in order to get row numbers in MySQL < 8.
				// Get the highest object_last_modified value for every link in the index.
				$sql = 'SELECT object_last_modified
				    FROM ( SELECT @rownum:=0 ) init
				    JOIN ' . Model::get_table_name( 'Indexable' ) . '
				    WHERE object_sub_type = %s
				      AND is_publicly_viewable = 1
				      AND ( is_robots_noindex = 0 OR is_robots_noindex IS NULL )
				      AND ( @rownum:=@rownum+1 ) %% %d = 0
				    ORDER BY object_last_modified ASC';

				// phpcs:ignore WordPress.DB
				$query = $wpdb->prepare( $sql, $post_type->object_sub_type, $max_entries );
				// phpcs:ignore WordPress.DB
				$most_recent_mod_date_per_page = $wpdb->get_col( $query );

				// The last page doesn't always get a proper last_mod date from this query. So we use the most recent date from the posttype instead.
				if ( ( $post_type->count % $max_entries ) !== 0 ) {
					$most_recent_mod_date_per_page[] = $post_type->max_object_last_modified;
				}

				$page_counter = 1;
				foreach ( $most_recent_mod_date_per_page as $most_recent_mod_date_of_page ) {
					$index[] = [
						'loc'     => WPSEO_Sitemaps_Router::get_base_url( $post_type->object_sub_type . '-sitemap' . $page_counter . '.xml' ),
						'lastmod' => $most_recent_mod_date_of_page,
					];
					$page_counter++;
				}
			}
			else {
				$index[] = [
					'loc'     => WPSEO_Sitemaps_Router::get_base_url( $post_type->object_sub_type . '-sitemap.xml' ),
					'lastmod' => $post_type->max_object_last_modified,
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
	 * @return array The links.
	 *
	 * @throws OutOfBoundsException When an invalid page is requested.
	 */
	public function get_sitemap_links( $type, $max_entries, $current_page ) {
		if ( ! $this->is_valid_post_type( $type ) ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		$offset = ( $current_page > 1 ) ? ( ( $current_page - 1 ) * $max_entries ) : 0;

		$query = $this->repository
			->query_where_noindex( false, 'post', $type )
			->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
			->where( 'is_publicly_viewable', true )
			->order_by_asc( 'object_last_modified' )
			->offset( $offset )
			->limit( $max_entries );

		$posts_to_exclude = $this->get_excluded_posts( $type );
		if ( count( $posts_to_exclude ) > 0 ) {
			$query->where_not_in( 'object_id', $posts_to_exclude );
		}

		$indexables = $query->find_many();

		// Add the home page or archive to the first page.
		if ( $current_page === 1 ) {
			if ( $type === 'page' ) {
				$home_page = $this->repository
					->query_where_noindex( false, 'home-page' )
					->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
					->where( 'is_publicly_viewable', true )
					->find_one();
				if ( $home_page ) {
					// Prepend homepage.
					array_unshift( $indexables, $home_page );
				}
			}
			else {
				$archive_page = $this->repository
					->query_where_noindex( false, 'post-type-archive', $type )
					->select_many( 'id', 'object_id', 'permalink', 'object_last_modified' )
					->where( 'is_publicly_viewable', true )
					->find_one();
				if ( $archive_page ) {
					// Prepend archive.
					array_unshift( $indexables, $archive_page );
				}
			}
		}

		// If total post type count is lower than the offset, an invalid page is requested.
		if ( count( $indexables ) === 0 ) {
			throw new OutOfBoundsException( 'Invalid sitemap page requested' );
		}

		return $this->xml_sitemap_helper->convert_indexables_to_sitemap_links( $indexables, 'post' );
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
